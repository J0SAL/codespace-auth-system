require('dotenv').config()
require('./database/database').connect()
const express = require("express")
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("<h1>Codespaces OP!</h1>");
});

app.post('/register', async (req, res)=>{
    try{
        const {firstName, lastName, email, password} = req.body
        if(!(firstName && lastName && email && password)){
            res.status(400).send("Invalid Data")
        }
        const existingUser = await User.findOne({ email })
        if(existingUser)
            res.status(401).send("User Already Exist!")
        
        const encPassword = await bycrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: encPassword
        })

        const token = jwt.sign(
            {id: user._id, email},
            "secret",
            {
                expiresIn: "2h"
            }
        )
        user.token = token;
        user.password = undefined

        res.status(201).send(user)
    }catch(error){
        console.log("Error!")
        res.status(500).send("Something went wrong")
    }
});

module.exports = app;

