import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { SAQuery } from './SAQuery';
import { SAResults } from './SAResults';

import './SalesAnalysis.css';


export const SalesAnalysis = ({user}) => {



    return (
        <div id='salesanal' >
            <div className='SAQueryContainer'>
                <SAQuery user={user} />
            </div>
            <div className='SAResultsContainer'>
                <SAResults user={user} />
            </div>
        </div>
        )
}