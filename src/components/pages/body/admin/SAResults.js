import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import './SAResults.css';


export const SAResults = ({salesData, setSalesData}) => {

    const [ sortBy, setSortBy ] = useState({field: 'sale', direction: 'up'});

    const up = String.fromCodePoint(10836);
    const down = String.fromCodePoint(10835);

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