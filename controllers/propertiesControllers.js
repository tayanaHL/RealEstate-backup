/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Property = require('../models/properties')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////

// INDEX route 
// Read -> finds and displays all fruits
router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the fruits
    Property.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        // send json if successful
        .then(properties => { 
            // res.json({ fruits: fruits })
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('properties/index', { properties, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET for the new page
// shows a form where a user can create a new fruit
router.get('/new', (req, res) => {
    res.render('properties/new', { ...req.session })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // console.log('this is req.body before owner: \n', req.body)
    // here, we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our fruit
    // luckily for us, we saved the user's id on the session object, so it's really easy for us to access that data
    req.body.owner = req.session.userId

    // we need to do a little js magic, to get our checkbox turned into a boolean
    // here we use a ternary operator to change the on value to send as true
    // otherwise, make that field false
    req.body.forSale = req.body.forSale === 'on' ? true : false
    const newProperty = req.body
    console.log('this is req.body aka newFruit, after owner\n', newProperty)
    Property.create(newProperty)
        // send a 201 status, along with the json response of the new fruit
        .then(property => {
            // in the API server version of our code we sent json and a success msg
            // res.status(201).json({ fruit: fruit.toObject() })
            // we could redirect to the 'mine' page
            // res.status(201).redirect('/fruits/mine')
            // we could also redirect to the new fruit's show page
            res.redirect(`/properties/${property.id}`)
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's fruits
router.get('/mine', (req, res) => {
    // find fruits by ownership, using the req.session info
    Property.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(property => {
            // if found, display the fruits
            // res.status(200).json({ fruits: fruits })
            res.render('properties/index', { property, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route for getting json for specific user fruits
// Index -> This is a user specific index route
// this will only show the logged in user's fruits
router.get('/json', (req, res) => {
    // find fruits by ownership, using the req.session info
    Property.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(property => {
            // if found, display the fruits
            res.status(200).json({ property: property })
            // res.render('fruits/index', { fruits, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// GET request -> edit route
// shows the form for updating a fruit
router.get('/edit/:id', (req, res) => {
    // because we're editing a specific fruit, we want to be able to access the fruit's initial values. so we can use that info on the page.
    const propertyId = req.params.id
    Property.findById(propertyId)
        .then(property => {
            res.render('properties/edit', { property, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// PUT route
// Update -> updates a specific fruit(only if the fruit's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.forSale = req.body.forSale === 'on' ? true : false
    Property.findById(id)
        .then(property => {
            // if the owner of the fruit is the person who is logged in
            if (property.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // update and save the fruit
                return property.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20fruit`)
            }
        })
        .then(() => {
            // console.log('the fruit?', fruit)
            res.redirect(`/properties/mine`)
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// DELETE route
// Delete -> delete a specific fruit
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Property.findById(id)
        .then(property => {
            // if the owner of the fruit is the person who is logged in
            if (property.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // delete the fruit
                return property.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20fruit`)
            }
        })
        .then(() => {
            res.redirect('/properties/mine')
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Property.findById(id)
        .populate('comments.author', 'username')
        // send the fruit as json upon success
        .then(property => {
            // res.json({ fruit: fruit })
            res.render('properties/show.liquid', {property, ...req.session})
        })
        // catch any errors
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router