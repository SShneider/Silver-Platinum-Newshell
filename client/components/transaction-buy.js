import React from 'react'
import {connect} from 'react-redux'
import {addPurchaseThunk} from '../store/transactions'
import {Table, Form, Button} from 'react-bootstrap'

const BuyStock = (props) => {
    let textColor = "text-white";
    let priceTextColor = "text-white";
    let roundedPrice = props.trans.priceAtTransaction.toFixed(2)
    let roundedPriceOpen = props.trans.oldprice.toFixed(2)
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
                <td>{props.trans.ticker}</td>
                <td className={priceTextColor}>{roundedPrice}</td>
                <td>{props.trans.quantity}</td>
                <td>{(roundedPrice*props.trans.quantity).toFixed(2).toString()}</td>
                
            </tr>
        </tbody>
        </Table> 
       
    )
}


const mapDispatch = dispatch => {
    return {
        makePurchase(stockIn){
            dispatch(addPurchaseThunk(stockIn))
        }
    }
}

export default connect(null, mapDispatch)(BuyStock)