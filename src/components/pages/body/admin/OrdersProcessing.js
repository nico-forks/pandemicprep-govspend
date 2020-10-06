/** @format */

import React, { useState, useEffect } from "react";
// import users from '../../../../../db/singletables/users';

import "./OrdersProcessing.css";


export const OrdersProcessing = () => {


    return (
        <div id='all-processing' >
            <h1 id="ordersH1">Orders Processing:</h1>
            <div className='order-list' >
                <div id='initial-titles' >
                    <p>Name:</p>
                    <p>Email:</p>
                    <p>Total $:</p>
                    <p id="date">Date Placed:</p>
                </div>

                <div className='order-content' >

                    <div id='initial-details' >
                        <p>Name</p>
                        <p>Email</p>
                        <p>Price</p>
                        <p>Date</p>
                        <button id='dropdown-arrow' >ˇ</button>
                        <button className='processing-button' >Finalize</button>

                    </div>

                    <div id='hidden-details'>

                        <div id='hidden-titles' >
                          
                        </div>

                        <div id='each-hidden-item' >
                            
                        </div>

                    </div>

                </div>



            </div>
        </div>
    );
};
