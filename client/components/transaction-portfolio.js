import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserTransThunk } from '../store/transactions'
class TransactionPortfolio extends Component{
    constructor(){
        super()
        this.state = {
            allTransactions: [],//could be user specific or all all
            portfolio: []//only stocks that havent been sold
        }
    }

    componentDidMount(){
        this.props.findUserTrans()
        
    }

    render(){
        return(
            <div>{JSON.stringify(this.props.portfolio)}
            {JSON.stringify(this.props.allTransactions)}</div>
        )
    }
}
const mapState = (state) =>{
    
       return {
           allTransactions: state.transState.transactions, 
           portfolio: state.transState.transactions.filter(trans => !trans.sold)
       }
}

const mapDispatch = dispatch => {
    return {
        findUserTrans(){
            dispatch(getUserTransThunk())
        }
    }
}

export default connect(mapState, mapDispatch)(TransactionPortfolio)
