import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_ALL_TRANS = "GET_ALL_TRANS"
/**
 * INITIAL STATE
 */
const defaultTransaction = {}
/**
 * ACTION CREATORS
 */
const getAllTrans = transactions => ({type: GET_ALL_TRANS, transactions})

/**
 * THUNK CREATORS
 */

export const getAllTransThunk = () => async dispatch => {
	try {
		const { data } = await Axios.get('/api/transactions/all')
		dispatch(getAllTrans(data))
	} catch (error) {
		console.error(error)
	}
}//gets all transactions of all users. Only accessible by an admin. Errors need not to be brought to front


