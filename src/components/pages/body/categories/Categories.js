/** @format */

import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

import "./Categories.css";

export const Categories = ({ NavLink, category, setCategory, categoryList, setPageType }) => {
    const history = useHistory();

    const categoryHandler = (selectedCat, i) => {
        setPageType("category");
        setCategory(selectedCat.name);
    };

    if (category === '') {
        history.push('/');
    }

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
                                <button className="category-name redCat">{item.name}</button>
                            ) : (
                                <button className="category-name">{item.name}</button>
                            )}
                        </div>
                    </NavLink>
                );
            })}
        </div>
    );
};
