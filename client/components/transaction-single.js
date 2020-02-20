import React from 'react'

export default function SingleTransaction(props){
    let textColor = "text-white";
    let boughtOrSold = 'Bought';
    let priceTextColor = "text-white";
    let readableDate;
    let roundedPrice = props.trans.priceAtTransaction.toFixed(2)
   
    if(!props.isPortfolio){
        readableDate= new Date(props.trans.dateOfTransaction).toUTCString()
        if(props.trans.sold){
            textColor = "text-danger"
            boughtOrSold = "Sold"
        }
        else textColor="text-success"
        priceTextColor = textColor
    }else{
        let roundedPriceOpen = props.trans.oldprice.toFixed(2)
        roundedPrice > roundedPriceOpen ? priceTextColor = "text-success" : priceTextColor ="text-danger"
        if(roundedPrice === roundedPriceOpen) priceTextColor = "text-muted"
    } 
    
    return(
        <tr className={textColor}>
        <td>{props.trans.ticker}</td>
        <td className={priceTextColor}>{roundedPrice}</td>
        <td>{props.trans.quantity}</td>
        <td>{(roundedPrice*props.trans.quantity).toFixed(2).toString()}</td>
        {props.isPortfolio ? null : <td>{boughtOrSold}</td>}
        {props.isPortfolio ? null : <td>{readableDate.split('GMT')[0]}</td>}
        </tr>
    )
}

