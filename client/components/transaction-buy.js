import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addPurchaseThunk} from '../store/transactions'
import {me} from '../store/user'
import {Table, Form, Button, Alert} from 'react-bootstrap'

class BuyStock extends Component{
    constructor(){
        super()
        this.state = {
            quantity: 1,
            warningVisibility: false
        }
    }
    
    handleOnChange = (event) =>{
        event.preventDefault()
        let quantityIn = event.target.value
        this.setState({quantity:quantityIn})
        if(quantityIn<1 ||this.props.balance<(this.props.trans.priceAtTransaction*quantityIn)) this.setState({warningVisibility: true})
        else{
        this.setState({warningVisibility: false})
        }
    }
    handlePurchase =  (event) =>{
        if(this.props.balance<(this.props.trans.priceAtTransaction*this.state.quantity) || this.props.quantity<1){
            this.setState({warningVisibility: true})
        }else{ this.props.makePurchase([{ticker: this.props.trans.ticker, 
                priceAtTransaction: this.props.trans.priceAtTransaction,
                quantity: Number(this.state.quantity)
                }])
               
        }
    }
    render(){
        let textColor = "text-white";
        let priceTextColor = "text-white";
        let roundedPrice = this.props.trans.priceAtTransaction.toFixed(2)
        let roundedPriceOpen = this.props.trans.oldprice.toFixed(2)
        roundedPrice > roundedPriceOpen ? priceTextColor = "text-success" : priceTextColor ="text-danger"
        if(roundedPrice === roundedPriceOpen) priceTextColor = "text-muted"
        return(
            <Table striped bordered hover variant="dark" responsive>
            <thead>
                <tr>
                    <th>Found Ticker: </th>
                    <th>Price: </th>
                    <th>Quantity to Buy: </th>
                    <th>Order Total: </th>
                    <th>Confirm Purchase</th>
                </tr>
            </thead>
            <tbody>
                <tr className={textColor}>
                    <td>{this.props.trans.ticker}</td>
                    <td className={priceTextColor}>{roundedPrice}</td>
                    <td>
					<Form.Control
                        size="sm"
                        type="number"
                        min="1"
                        max={`${(Math.floor(this.props.balance/this.props.trans.priceAtTransaction))}`}
                        step="1"
						name="quantity"
						defaultValue={this.state.quantity}
						onChange={this.handleOnChange}
						pattern="[0-9]"
					/>
                    {this.state.warningVisibility ? <Alert variant="danger">Insufficient funds!</Alert> : null }
					</td>
                    <td>{(roundedPrice*this.state.quantity).toFixed(2)}</td>
                    <td><Button 
                    onClick={() => this.handlePurchase(event)}
                    variant="success" type="submit" className="rounded-0 border-0 w-25">Buy!</Button></td>
                </tr>
            </tbody>
            </Table> 
        
        )
    }
}


const mapDispatch = dispatch => {
    return {
        makePurchase(stockIn){
            dispatch(addPurchaseThunk(stockIn))
        },
        updateBankroll(){
            dispatch(me())
        }
    }
}

export default connect(null, mapDispatch)(BuyStock)