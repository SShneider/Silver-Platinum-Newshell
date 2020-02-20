import axios from 'axios'
import history from '../history'
require("../../secrets");
/**
 * ACTION TYPES
 */
const GET_ALL_TRANS = "GET_ALL_TRANS"
const GET_USER_TRANS = "GET_USER_TRANS"
const ADD_PURCHASE = "ADD_PURCHASE"
const GET_IEX_UPDATE ="GET_STOCK_UPDATE"
/**
 * INITIAL STATE
 */
const initialTransState = {
	transactions: [{}],
	portfolio: {}, 
	isMarketOpen: true,
}
/**
 * ACTION CREATORS
 */
const getAllTrans = transactions => ({type: GET_ALL_TRANS, transactions})
const getUserTrans = transactions => ({type: GET_USER_TRANS, transactions})
const addPurchase = transactions => ({type: ADD_PURCHASE, transactions})
const iexUpdate = apiPayload => ({type: GET_IEX_UPDATE, apiPayload})
/**
 * THUNK CREATORS
 */
export const iexUpdateThunk = (stocksToUpdate) => async dispatch => {
	try{
		let sendTickers = Object.keys(stocksToUpdate).join().toLowerCase()
		const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/market/batch?symbols=${sendTickers}&types=quote&token=${process.env.IEX_API_TOKEN}`)
		dispatch(iexUpdate(data))
	}catch(error){
		console.error(error)
	}
}

export const getAllTransThunk = () => async dispatch => {
	try {
		const { data } = await axios.get('/api/transactions/all')
		dispatch(getAllTrans(data))
	} catch (error) {
		console.error(error)
	}
}//gets all transactions of all users. Only accessible by an admin. Errors need not to be brought to front

export const getUserTransThunk = (id) => async dispatch => {
	try {
		const { data } = await axios.get('/api/transactions/', {params: {id:id}})
		dispatch(getUserTrans(data))
	} catch (error) {
		dispatch(getUserTrans({error}))
	}
}

export const addPurchaseThunk = (order) => async dispatch => {
	try {
		const { data } = await axios.post('/api/transactions/', order, {params: {id:user}})
		dispatch(addPurchase(data))
	} catch (error) {
		dispatch(addPurchase({error}))
	}
}
//end thunks
/**
 * REDUCER
 */

 export default function(state=initialTransState, action){
	 let output = action.transactions
	 switch(action.type){
		case GET_ALL_TRANS:
			return {...state, transactions: output}
		case GET_USER_TRANS:
			let incPortfolio = {}
			//computes a new object with updated quantities (+bought stocks.quantity, -sold stocks.quantity), returns an object of {Ticker: {Reduced Transaction Object}}
			output.forEach(stock => {
				let key = stock.ticker
				if(!incPortfolio[key]){
					incPortfolio[key] = {...stock};
				  if(incPortfolio[key].sold) incPortfolio[key].quantity*=-1 // while stock needs to be bought before it can be sold, this will catch any error in ordering
				  incPortfolio[key].oldprice=incPortfolio[key].priceAtTransaction //sets the purchase price to compare stock performance to
				}
				else{
				  stock.sold ? incPortfolio[key].quantity -= stock.quantity : incPortfolio[key].quantity += stock.quantity
				}
			  })
			return {...state, transactions: output, portfolio: incPortfolio}
		case ADD_PURCHASE:
			return {...state, transactions: output}
		case GET_IEX_UPDATE:
			const stateToUpdate = {...state.portfolio}
			for (let key in action.apiPayload) {
				let stock = action.apiPayload[key]
				stateToUpdate[stock.quote.symbol].priceAtTransaction = stock.quote.latestPrice
				stateToUpdate[stock.quote.symbol].oldprice = stock.quote.previousClose
				}
			return {...state, portfolio: stateToUpdate, isMarketOpen: Object.values(action.apiPayload)[0].quote.isUSMarketOpen}
		default:
			return state
	 }
 }