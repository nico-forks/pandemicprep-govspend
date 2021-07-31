import React, { useState, useEffect } from "react";
import _ from 'lodash';
import './SAResults.css';

export const SAResults = ({salesData, setSalesData}) => {

    const [ sortBy, setSortBy ] = useState({field: 'sale', direction: 'up'});
    const [ salesTotals, setSalesTotals ] = useState({title: 'Total', quantity: 0, sale: 0, cost: 0, profits: 0})

    const up = String.fromCodePoint(10836);
    const down = String.fromCodePoint(10835);

    useEffect(() => {
        const newTotals = _.clone(salesTotals);
        newTotals.quantity = _.sumBy(salesData, item => parseInt(item.quantity));
        newTotals.sale = _.sumBy(salesData, item => parseFloat(item.sale));
        newTotals.cost = _.sumBy(salesData, item => parseFloat(item.cost));
        newTotals.profits = _.sumBy(salesData, item => parseFloat(item.profits));
        setSalesTotals(newTotals);
    }, [salesData])

    const sortHandler = (field) => {
        let newData = [];
        let newSortBy = {field: null, direction: null};
        if (sortBy.field === field) {
            newData = _.clone(salesData);
            _.reverse(newData);
            newSortBy.direction = sortBy.direction === 'down' ? 'up' : 'down';
        } else {
            if (field === 'title') {
                newData = _.sortBy(salesData, (item => item[field]));
                newSortBy.direction = 'down';
            } else {
                newData = _.sortBy(salesData, (item => parseInt(item[field])));
                newSortBy.direction = 'down';
            }
        }
        newSortBy.field = field;
        setSortBy(newSortBy);
        setSalesData(newData);
    }

    return (
        <div className="salesReportOuter" >
            
                <div className="salesReportHeaderContainer">
                    <h3>Deep Sales Report</h3>
                    <div className="salesReportInner">
                        <div className="salesReportHeaders salesReportRow">
                            <p onClick={(event) => sortHandler('title')}  >Product {
                            sortBy.field === 'title' && sortBy.direction === 'down' ? `${down}` : 
                                sortBy.field === 'title' && sortBy.direction === 'up' ? `${up}` : ''}</p>
                            <p className='salesReportValue' onClick={(event) => sortHandler('quantity')} >Quantity {
                            sortBy.field === 'quantity' && sortBy.direction === 'down' ? `${down}` : 
                                sortBy.field === 'quantity' && sortBy.direction === 'up' ? `${up}` : ''}</p>
                            <p className='salesReportValue' onClick={(event) => sortHandler('sale')} >Sales {
                            sortBy.field === 'sale' && sortBy.direction === 'down' ? `${down}` : 
                                sortBy.field === 'sale' && sortBy.direction === 'up' ? `${up}` : ''}</p>
                            <p className='salesReportValue' onClick={(event) => sortHandler('cost')} >Cost {
                            sortBy.field === 'cost' && sortBy.direction === 'down' ? `${down}` : 
                                sortBy.field === 'cost' && sortBy.direction === 'up' ? `${up}` : ''}</p>
                            <p className='salesReportValue' onClick={(event) => sortHandler('profit')} >Profit {
                            sortBy.field === 'profit' && sortBy.direction === 'down' ? `${down}` : 
                                sortBy.field === 'profit' && sortBy.direction === 'up' ? `${up}` : ''}</p>
                        </div>
                        <div className='salesReportRow'>
                                <p className='salesReportRowTitle bold' >{salesTotals.title}</p>
                                <p className='salesReportValue bold'>{salesTotals.quantity}</p>
                                <p className='salesReportValue bold' >{'$ ' + parseFloat(salesTotals.sale).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                            })}</p>
                                <p className='salesReportValue bold' >{'$ ' + parseFloat(salesTotals.cost).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                            })}</p>
                                <p className='salesReportValue bold'>{'$ ' + parseFloat(salesTotals.profits).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                            }) }</p>
                        </div>
                    </div >
                </div>
                <div className="salesReportTable">
                    {Array.isArray(salesData) ? salesData.map((item, index) => {
                        return (
                            <div key={index} className="salesReportRow">
                                <p className='salesReportRowTitle' >{item.title}</p>
                                <p className='salesReportValue'>{item.quantity}</p>
                                <p className='salesReportValue' >{'$ ' + parseFloat(item.sale).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                            })}</p>
                                <p className='salesReportValue' >{'$ ' + parseFloat(item.cost).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                            })}</p>
                                <p className='salesReportValue'>{'$ ' + parseFloat(item.profits).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                            }) }</p>
                            </div>
                        );
                    }) : ''}
                </div>
        </div>
    );
}