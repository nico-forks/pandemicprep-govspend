import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import _ from 'lodash';
import { getAllCategories, getAllProductNamesAndIds, getCities, getZipcodes } from '../../../../api/index';

import './SAQuery.css';


export const SAQuery = ({user}) => {

    const [ categories, setCategories ] = useState({categories: [], products: []});
    const [ demographics, setDemographics ] = useState({genders: ['male', 'female'], 
    ages: ['19-', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'], cities: [], zipcodes: []});

    useEffect(() => {

        async function fixCategories() {
            try {
                const newCategories = _.clone(categories);
                newCategories.categories = await getAllCategories();
                newCategories.products = await getAllProductNamesAndIds(user.token);
                return newCategories;
            } catch (error) {
                console.error('error in fixCategories inside SAQuery useEffect', error);
            }
        }

        fixCategories().then(result => setCategories(result));

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

    }, []);


    return (
        <div>
            <div className='categoriesOuter' >
                <p className='title' >Product categories:</p>
                <Form.Group className='categoriesInner mb-3' controlId="formBasicCheckbox" >
                    
                    {categories.categories.map((result, index) => {
                        return (
                            <div className='checkboxGroup' >
                                <label className='checkboxLabel' htmlFor={`cat-${index}`} >{result.name}</label>
                                <input className='checkboxes' type="checkbox" name={`cat-${index}`} value={result.id} checked />
                            </div>
                        );
                    })}
                </Form.Group>
                <hr></hr>
                <Form.Group className='selectInner' >
                    <select name="products" className="select" form="productform">
                        <option value={0}>Select a product</option>
                        {categories.products.map((product, index) => {
                            return <option key={index} value={product.id}>{product.title}</option>
                        })}
                    </select>
                </Form.Group>
            </div>
            <div className='demoOuter'>
                <p className='title' >Gender</p>
                <div className='genderInner' >
                            <div className='checkboxGroup' >
                                <label className='checkboxLabel' htmlFor='male' >male</label>
                                <input className='checkboxes' type="checkbox" name='male' value='male' checked />
                            </div>
                            <div className='checkboxGroup' >
                                <label className='checkboxLabel' htmlFor='female' >female</label>
                                <input className='checkboxes' type="checkbox" name='female' value='female' checked />
                            </div>                    
                </div>
                <hr />
                <div className='ageOuter'>
                <p className='title'>Age group</p>
                <div className="ageInner">
                        {demographics.ages.map((age, index) => {
                            return (
                                <div className='checkboxGroup' key={index}>
                                    <label className='checkboxLabel' htmlFor={age} >{age}</label>
                                    <input className='checkboxes' type="checkbox" name={age} value={age} checked />
                                </div> 
                            );
                        })}
                        
                    </div>
                </div>
                <hr />
                <div className='selectInner'>
                    <select name="cities" className="select" form="cityform">
                        <option value={0}>Select a city</option>
                        {demographics.cities.map((city, index) => {
                            
                            return <option key={index} value={city.location}>{city.location}</option>
                        })}
                    </select>
                </div>
                <hr />
                <div className='selectInner'>
                    
                    <select name="zipcode" className="select lastItem" form="zipcodeform">
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