/** @format */

import React, { useState, useEffect } from 'react';
// import { Pagination } from 'react-bootstrap';
import _ from 'lodash';

import './Sales.css';
import { getSalesReport } from '../../../../api';

export const Sales = ({ user }) => {
	const [salesReport, setSalesReport] = useState([]);
	
	const [twentyTwenty, setTwentyTwenty] = useState({
		january: [],
		february: [],
		march: [],
		april: [],
		may: [],
		june: [],
		july: [],
		august: [],
		september: [],
		october: [],
		november: [],
		december: []
	})

	useEffect(() => {
		getSalesReport(user.token)
			.then((response) => {
				console.log('res', response);
				response.forEach((item) => {
					if (item.date.substring(0, 7) === '2021-01') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.january.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-02') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.february.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-03') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.march.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-04') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.april.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-05') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.may.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-06') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.june.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-07') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.july.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-08') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.august.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-09') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.september.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-10') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.october.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-11') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.november.push(item);
						setTwentyTwenty(newTwenty);
					} else if (item.date.substring(0, 7) === '2021-12') {
						const newTwenty = _.clone(twentyTwenty);
						newTwenty.december.push(item);
						setTwentyTwenty(newTwenty);
					}
				});
				
				setSalesReport(response.sort( compare ));
			})
			.catch((error) => {
				console.error(error);
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const compare = (a, b) => {
		if (a.date > b.date) {
			return 1;
		}
		if (a.date < b.date) {
			return -1;
		} 
		return 0;
	}
	// const toggleDetails = (index) => {
	// 	setClickedIndex(index);
	// };
	useEffect(() => {
		console.log(Object.entries(twentyTwenty));
	}, [twentyTwenty]);
	return (
		<div className='sales-container'>
			<div className='sales-report'>
			{salesReport.length < 1 ? <h1 className='empty'>No Sales to Report</h1> :
			(Object.entries(twentyTwenty).map((month, index) => {
				
				if (month[1].length === 0) {
					return '';
				}
				let total = 0.00;
				let cartQuantity = 0;
				for (let i = 0; i < month[1].length; i++) {
					total = total + parseFloat(month[1][i].total);
					cartQuantity = cartQuantity + parseInt(month[1][i].cartQuantity);
				}
				month[1].push({date: 'Monthly Total', cartQuantity: cartQuantity, total: total})

				return(					  
						<div key={index} className='month-container'>
							<p className='month-h1'>{month[0]}</p>
							<div className='report-titles'>
								<p className='each-title'>Date</p>
								<p className='each-title'>Total Items</p>
								<p className='each-title'>Total Revenue</p>
							</div>
							
							{ month[1].map((day, i) => {
								return (
									<div key={i} className='month-data'>
										<p className='each-data'>{day.date}</p>
										<p className='each-data'>{day.cartQuantity}</p>
										<p className='each-data'>{'$ ' + parseFloat(day.total).toLocaleString('en-US', {
											minimumFractionDigits: 2,
										})}</p>
									</div>
								)
							})}
						</div>
					
				)
			}))}
			</div>
		</div>
	)
};
