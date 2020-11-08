/** @format */

import React from "react";
import { Button } from 'react-bootstrap'

import "./Categories.css";

export const Categories = ({ NavLink, category, setCategory, categoryList, setPageType }) => {

    const categoryHandler = (selectedCat, i) => {
        setPageType("category");
        setCategory(selectedCat.name);
    };

    
    

    return (
        <div className="category">
            {categoryList.map((item, i) => {
                return (
                    <NavLink
                        key={i}
                        to="/productsview"
                        onClick={() => {
                            categoryHandler(item, i);
                        }}
                    >
                        <div key={i} id="cat" className="category-tile">
                            {category === item.name ? (
                                <Button variant='primary' className="category-name redCat">{item.name}</Button>
                            ) : (
                                <Button variant='dark' className="category-name">{item.name}</Button>
                            )}
                        </div>
                    </NavLink>
                );
            })}
        </div>
    );
};
