import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_ALL_TRANS = "GET_ALL_TRANS"
const GET_USER_TRANS = "GET_USER_TRANS"
const ADD_PURCHASE = "ADD_PURCHASE"
/**
 * INITIAL STATE
 */
const initialTransState = {
	transactions: [{}],
}
/**
 * ACTION CREATORS
 */
const getAllTrans = transactions => ({type: GET_ALL_TRANS, transactions})
const getUserTrans = transactions => ({type: GET_USER_TRANS, transactions})
const addPurchase = transactions => ({type: ADD_PURCHASE, transactions})
/**
 * THUNK CREATORS
 */

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
			return {...state, transactions: output}
		case ADD_PURCHASE:
			return {...state, transactions: output}
		default:
			return state
	 }
 }