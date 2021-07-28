import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import _ from 'lodash';
import { getAllCategories, getAllProductNamesAndIds, getCities, getZipcodes, getDeepSalesReport } from '../../../../api/index';

import './SAQuery.css';


export const SAQuery = ({user, setSalesData}) => {

    const [ categories, setCategories ] = useState({categories: [], products: []});
    const [ demographics, setDemographics ] = useState({genders: ['male', 'female'], 
    ages: ['all ages', '0-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'], cities: [], zipcodes: []});
    const [ query, setQuery ] = useState({age: [{from: '1900-01-01', to: '2200-01-01'}], gender: ['male', 'female'], date: [{from: '1900-01-01', to: '2200-01-01'}]})

    
    useEffect(() => {

        async function fixCategories() {
            try {
                const newCategories = _.clone(categories);
                newCategories.categories = await getAllCategories();
                newCategories.products = await getAllProductNamesAndIds(user.token);
                newCategories.products = _.sortBy(newCategories.products, item => item.title);
                return newCategories;
            } catch (error) {
                console.error('error in fixCategories inside SAQuery useEffect', error);
            }
        }

        fixCategories().then(result => {
            setCategories(result);
            setQuery(fixQuery(result.categories));
        });

        async function fixDemographics() {
            try {
                const newDemographics = _.cloneDeep(demographics);
                newDemographics.cities = await getCities(user.token);
                newDemographics.zipcodes = await getZipcodes(user.token);
                return newDemographics;
            } catch (error) {
                console.error('error in fixDemographics inside SAQuery useEffect', error);
            }
        }

        fixDemographics().then(result => setDemographics(result));

        function fixQuery(categories) {
            try {
                const newQuery = _.cloneDeep(query);
                newQuery.category = _.map(categories, cat => cat.id);
                
                return newQuery;
            } catch (error) {
                console.error('error in fixQuery inside SAQuery useEffect', error);
            }
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    useEffect(() => {
        
        getDeepSalesReport(user.token, query).then(data => {
            const newData = _.map(data, (item) => {
                item.profits = item.sale - item.cost;
                return item;
            });
            setSalesData(newData);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])


    //full object {category: [1, 2], product: [25], date: [{from: '2000-01-01', to: '2200-01-01'}], 
    //age: [{name: '0-19', from: '2001-07-20', to: '2021-07-20'}, ...], 
    //gender: ['male', 'female'], city: ['Orlando'], zipcode: ['12345']}
    const queryHandler = async (event, kind) => {
        const newQuery = _.cloneDeep(query);
        if (kind === 'category') {
            if (event.target.checked) {
                newQuery.category.push(event.target.value);
            } else {
                
                _.pull(newQuery.category, parseInt(event.target.value));
            }
        }
        if (kind === 'product') {
            resetExclusive('product');
            if (event.target.value !== '0') {
                newQuery.product = [event.target.value];
            } else {
                resetExclusive();
            }
        }
        if (kind === 'date') {
            if (event.target.name === 'dateFrom') {
                newQuery.date[0].from = event.target.value;
            } else {
                newQuery.date[0].to = event.target.value;
            }
        }
        if (kind === 'gender') {
            if (event.target.checked) {
                if (newQuery.hasOwnProperty('gender')) {
                    newQuery.gender.push(event.target.value);
                } else {
                    newQuery.gender = [event.target.value];
                }
            } else {
                if (newQuery.gender.length === 1) {
                    delete newQuery.gender;
                } else {
                    _.pull(newQuery.gender, event.target.value);
                }
            }
        }
        if (kind === 'age') {
            newQuery.age = [ageConverter(event.target.value)];
        }
        if (kind === 'city') {
            resetExclusive('city');
            if (event.target.value !== '0') {
                newQuery.city = [event.target.value];
            } else {
                resetExclusive();
            }
            
        }
        if (kind === 'zipcode') {
            resetExclusive('zipcode');
            if (event.target.value !== '0') {
                newQuery.zipcode = [event.target.value];
            } else {
                resetExclusive();
            }
        }
        setQuery(newQuery);

        function resetExclusive(exclude = null) {
            const properties = ['product', 'city', 'zipcode'];
            _.pull(properties, exclude);
            _.forEach(properties, item => {
                if (newQuery.hasOwnProperty(item)) delete newQuery[item];
                const tag = document.getElementById(item);
                tag.value = 0;
            })
        }
    }




    return (
        <div>
            <div className='queryOuter' >
                <p className='title' >Product categories:</p>
                <Form.Group className='categoriesInner mb-3' controlId="formBasicCheckbox" onChange={event => queryHandler(event, 'category')} >
                    
                    {categories.categories.map((result, index) => {
                        return (
                            <div className='checkboxGroup' key={index}> >
                                <label className='checkboxLabel' htmlFor={`cat-${index}`} >{result.name}</label>
                                <input className='checkboxes' type="checkbox" name={`cat-${index}`} value={result.id} defaultChecked />
                            </div>
                        );
                    })}
                </Form.Group>
                <hr></hr>
                <Form.Group className='selectInner' >
                    <select id='product' name="products" className="select" form="productform" onChange={event => queryHandler(event, 'product')} >
                        <option value={0}>Select a product</option>
                        {categories.products.map((product, index) => {
                            return <option key={index} value={product.id}>{product.title}</option>
                        })}
                    </select>
                </Form.Group>
            </div>
            <div className="queryOuter">
                <p className="title" >Date range:</p>
                <div className='dateOuter'>
                    <div className='dateGroup'>
                        <label htmlFor='dateFrom' >From:</label>
                        <input className='datePicker' type='date' name='dateFrom' onChange={event => queryHandler(event, 'date')} />
                    </div>
                    <div className='dateGroup'>
                        <label htmlFor='dateTo' >To:</label>
                        <input className='datePicker' type='date' name='dateTo' onChange={event => queryHandler(event, 'date')} />
                    </div>
                </div>
            </div>
            <div className='queryOuter'>
                <p className='title' >Gender</p>
                <div className='genderInner' onChange={event => queryHandler(event, 'gender')} >
                            <div className='checkboxGroup' >
                                <label className='checkboxLabel' htmlFor='male' >male</label>
                                <input className='checkboxes' type="checkbox" name='male' value='male' defaultChecked />
                            </div>
                            <div className='checkboxGroup' >
                                <label className='checkboxLabel' htmlFor='female' >female</label>
                                <input className='checkboxes' type="checkbox" name='female' value='female' defaultChecked />
                            </div>                    
                </div>
                <hr />
                <div className='ageOuter'>
                <p className='title'>Age group</p>
                <div className="ageInner" onChange={event => queryHandler(event, 'age')} >
                        {demographics.ages.map((age, index) => {
                            return (
                                <div className='checkboxGroup' key={index}>
                                    <label className='checkboxLabel' htmlFor={age} >{age}</label>
                                    <input className='checkboxes' type="radio" name='age' value={age} defaultChecked={age === 'all ages' ? true : false} />
                                </div> 
                            );
                        })}
                        
                    </div>
                </div>
                <hr />
                <div className='selectInner'>
                    <select id='city' name="cities" className="select" form="cityform" onChange={event => queryHandler(event, 'city')} >
                        <option value={0}>Select a city</option>
                        {demographics.cities.map((city, index) => {
                            
                            return <option key={index} value={city.location}>{city.location}</option>
                        })}
                    </select>
                </div>
                <hr />
                <div className='selectInner'>
                    
                    <select id='zipcode' name="zipcode" className="select lastItem" form="zipcodeform" onChange={event => queryHandler(event, 'zipcode')} >
                    <option value={0}>Select a Zip Code</option>
                        {demographics.zipcodes.map((zip, index) => {
                            
                            return <option key={index} value={zip.code}>{zip.code}</option>
                        })}
                    </select>
                </div>
            </div>
        </div>
    );

}


/**
 * 
 * @param {String} age is an age range like ('0-19') 
 * @returns {Object} a date range object ready for the query
 */
function ageConverter(age) {
    const today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth() + 1;
    let thisDay = today.getDate();
    if (thisMonth < 10) thisMonth = '0' + thisMonth;
    if (thisDay < 10) thisDay = '0' + thisDay;

    switch (age) {
        case 'all ages':
            return {name: 'all ages', from: '1900-01-01', to: '2200-01-01'}
        case '0-19':
            return {name: '0-19', from: dateOffset(19), to: dateOffset(0)};
        case '20-29':
            return {name: '20-29', from: dateOffset(29), to: dateOffset(20)};
        case '30-39':
            return {name: '30-39', from: dateOffset(39), to: dateOffset(30)};
        case '40-49':
            return {name: '40-49', from: dateOffset(49), to: dateOffset(40)};
        case '50-59':
            return {name: '50-59', from: dateOffset(59), to: dateOffset(50)};
        case '60-69':
            return {name: '60-69', from: dateOffset(69), to: dateOffset(60)};
        default:
            return {name: '70+', from: dateOffset(200), to: dateOffset(70)};
    }

    function dateOffset(offset) {
        return `${thisYear - offset}-${thisMonth}-${thisDay}`;
    }
}