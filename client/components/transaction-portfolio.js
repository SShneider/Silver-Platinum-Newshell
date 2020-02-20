import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserTransThunk, iexUpdateThunk } from '../store/transactions'
import {Table, Form, FormControl, Button} from 'react-bootstrap'
import { SingleTrans } from './index.js'
class TransactionPortfolio extends Component{
    constructor(){
        super()
        this.state = {
            allTransactions: [],//could be user specific or all all
            portfolio: [],
            initialLossGain: this.updateStockMarketInitial()
        }
    }
    updateStockMarket = () =>{
        this.interval = setInterval(() =>{
            if(this.props) this.props.getStockUpdate(this.props.portfolio)
        }, 50000)
    }
    updateStockMarketInitial = () =>{
        let invoked = 0
        return function(portIn, funcIn) { 
            if(!invoked) funcIn(portIn)
            invoked = 1;
        }
    }
    componentDidMount(){
        this.props.findUserTrans()
        clearInterval(this.interval)
        if(this.props.location.query && this.props.location.query.type==="portfolio" || this.props.location.pathname==="/portfolio") {
            this.updateStockMarket()
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
      }
    render(){
        if(!this.props.isMarketOpen) clearInterval(this.interval)
        if(Object.keys(this.props.portfolio).length){
            this.state.initialLossGain(this.props.portfolio, this.props.getStockUpdate)
        }
        let transactionToPass = Object.values(this.props.portfolio)
        let isPortfolio = true//because our default unprompted view will be portfolio we start with it
        if(this.props.location.query && this.props.location.query.type==="transactions"){
            transactionToPass = this.props.allTransactions;
            isPortfolio = false;
           
        } 
        return(
            <div>
            <Form inline >
            <FormControl type="text" placeholder="Search For Ticker" className="rounded-0 border-0 w-75" />
            <Button variant="secondary" className="rounded-0 border-0 w-25">Search</Button>
            </Form>
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
            </div>
        )
    }
}
const mapState = (state) =>{
       return {
           allTransactions: state.transState.transactions, 
           portfolio: state.transState.portfolio,
           isMarketOpen: state.transState.isMarketOpen
       }
}

const mapDispatch = dispatch => {
    return {
        findUserTrans(){
            dispatch(getUserTransThunk())
        },
        getStockUpdate(portfolioIn){
            dispatch(iexUpdateThunk(portfolioIn))
        }
    }
}

export default connect(mapState, mapDispatch)(TransactionPortfolio)
