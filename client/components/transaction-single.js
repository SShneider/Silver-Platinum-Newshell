import React from 'react'

export default function SingleTransaction(props){
    let textColor = "text-white";
    let boughtOrSold = 'Bought'
    let readableDate;
    if(!props.isPortfolio){
        readableDate= new Date(props.trans.dateOfTransaction).toUTCString()
        if(props.trans.sold){
            textColor = "text-danger"
            boughtOrSold = "Sold"
        }
        else textColor="text-success"
    } 
    
    return(
        <tr className={textColor}>
        <td>{props.trans.ticker}</td>
        <td>{props.trans.priceAtTransaction}</td>
        <td>{props.trans.quantity}</td>
        <td>{(props.trans.priceAtTransaction*props.trans.quantity).toString()}</td>
        {props.isPortfolio ? null : <td>{boughtOrSold}</td>}
        {props.isPortfolio ? null : <td>{readableDate.split('GMT')[0]}</td>}
        </tr>
    )
}