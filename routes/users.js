const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');


const {
    addUser,
    getAllUsers
    } = require('../db/singletables/users');
    
    usersRouter.post('/register', async (req, res, next) => {
        const user = req.body;
        console.log('got into router', user);
        try {
        const newUser = await addUser(user);
        console.log('new user ', newUser);
            res.send(newUser);
        } catch (error) {
            throw error;
        }
    
    });

    // get all users
    usersRouter.get('/', async (req, res, next) => {
        try {
            const allUsers = await getAllUsers();

            res.send(allUsers);
        } catch (error) {
            throw error;
        }
    })

    module.exports = usersRouter;