/** @format */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink } from "react-router-dom";

import { Header, MainBody, Categories, Footer } from "./index";

import { getSomething } from "../api";

const App = () => {
    const [products, setProducts] = useState([]);
    const [searchString, setSearchString] = useState('');

    return (
        <div className="App">
            <Header />
            <MainBody />
            <Footer />
        </div>
    );
};

export default App;
