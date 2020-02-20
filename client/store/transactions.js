import axios from 'axios'
import history from '../history'
import {me} from './user'
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
const iexUpdate = apiPayload => ({type: GET_IEX_UPDATE, apiPayload})
/**
 * THUNK CREATORS
 */
export const iexUpdateThunk = (stocksToUpdate) => async dispatch => {
	try{
		let sendTickers = Object.keys(stocksToUpdate).join().toLowerCase()
		const { data } = await axios.get('/api/stocks', {params:{tickers: sendTickers}})
		console.log('in iex update', data)
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
		
		const { data } = await axios.post('/api/transactions/', {order})
		let sendTickers = ""
		Object.values(data).forEach(stock => {
			sendTickers+=(stock.ticker+',')
		})
		const res = await axios.get('/api/stocks', {params:{tickers: sendTickers}})
		dispatch(getUserTrans(data))//updates state.transactions
		dispatch(iexUpdate(res.data))//updates state.portfolio there could be a better way
		if(res) dispatch(me())
		// 
	} catch (error) {
		dispatch(iexUpdate({error}))
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
		case GET_IEX_UPDATE:
			const stateToUpdate = {...state.portfolio}
			for (let key in action.apiPayload) {
				let stock = action.apiPayload[key]
				if(!stateToUpdate[stock.quote.symbol]){
					stateToUpdate[stock.quote.symbol] = {ticker: stock.quote.symbol, priceAtTransaction: 0, oldprice: 0}
				}
				stateToUpdate[stock.quote.symbol].priceAtTransaction = stock.quote.latestPrice
				stateToUpdate[stock.quote.symbol].oldprice = stock.quote.previousClose
				}
			return {...state, portfolio: stateToUpdate, isMarketOpen: Object.values(action.apiPayload)[0].quote.isUSMarketOpen}
		default:
			return state
	 }
 }