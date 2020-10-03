/** @format */

import React, { useState, useEffect } from "react";

import "./Product.css";

import { addProductToCart } from "../../../../api/cart";

export const Product = ({ product, setCart, cart, user, setCartSize }) => {
    const addToCartHandler = () => {
        console.log('user id from product ', user);
        addProductToCart(
            {
                userId: user.id,
                productId: product.id,
                cartId: cart.id,
                quantity: 1,
                unitPrice: parseFloat(product.price),
            },
            user.token
        )
            .then((response) => {
                
                setCart(response);
                setCartSize(response.items.length);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div key={product.id} className="product">
                <div className="info">
                    <p className="header">{product.title}</p>
                    <p className="image">{product.imageURL}</p>
                    <p className="description">{product.description}</p>
                    <p className="price">{product.price}</p>
                    <button onClick={addToCartHandler}>Add to Cart</button>
                </div>
            </div>
        </>
    );
};
