/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express') 
const morgan = require('morgan') 
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()
const methodOverride = require('method-override')

/////////////////////////////////////
//// Middleware function         ////
/////////////////////////////////////

const middleware = (app) => {
   
    app.use(methodOverride('_method'))
    app.use(morgan('tiny')) 
    app.use(express.urlencoded({ extended: true })) 
    app.use(express.static('public')) 
    app.use(express.json()) 
    
    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            saveUninitialized: true,
            resave: false
        })
    )
}

///////////////////////////////////////////
//// Export middleware function        ////
///////////////////////////////////////////
module.exports = middleware