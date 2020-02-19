import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserTransThunk } from '../store/transactions'
import {Table} from 'react-bootstrap'
import { SingleTrans } from './index.js'
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
        let transactionToPass = this.props.portfolio
        let isPortfolio = true//because our default unprompted view will be portfolio we start with it
        if(this.props.location.query && this.props.location.query.type==="transactions"){
            transactionToPass = this.props.allTransactions;
            isPortfolio = false;
        } 
        return(
            <Table striped bordered hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>Ticker: </th>
                        <th>Price: </th>
                        <th>Quantity: </th>
                        <th>Total: </th>
                        {isPortfolio ? null : <th>Type: </th>}
                        {isPortfolio ? null :<th>Date of:</th>}
                    </tr>
                </thead>
                <tbody>
                    {transactionToPass.length && transactionToPass.map((transaction, idx) => {
                        let key = Date.parse(transaction.dateOfTransaction)*idx
                        return(
                            <SingleTrans key={key} trans = {transaction} isPortfolio = {isPortfolio} />
                        )
                    })}
                </tbody>
            </Table>
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
