import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import _ from 'lodash';
import { SAQuery } from './SAQuery';
import { SAResults } from './SAResults';
import { getDeepSalesReport } from '../../../../api/admin'

import './SalesAnalysis.css';


export const SalesAnalysis = ({user}) => {

    const [ salesData, setSalesData ] = useState({});

    useEffect(() => {
        getDeepSalesReport(user.token, {}).then(data => {
            const newData = _.map(data, (item) => {
                item.profits = item.sale - item.cost;
                return item;
            });
            setSalesData(newData);
        })
    }, []);

    useEffect(() => {
        console.log(salesData);
    }, [salesData])

    return (
        <div id='salesanal' >
            <div className='SAQueryContainer'>
                <SAQuery user={user} setSalesData={setSalesData} />
            </div>
            <div className='SAResultsContainer'>
                <SAResults user={user} salesData={salesData} setSalesData={setSalesData} />
            </div>
        </div>
        )
}