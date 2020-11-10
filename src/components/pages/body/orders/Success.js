import React from 'react';
import { Button } from 'react-bootstrap'
import './Success.css';
import { useHistory } from 'react-router-dom';

export const Success = () => {
    const history = useHistory()
    return (
        <div className='success-div' >
            <h1 className='thankyou' >Thank you for your purchase!</h1>
            <Button id='success-button' variant='success' onClick={() => {
                history.push('/');
            }}>Continue Shopping</Button>
        </div>
    )
}