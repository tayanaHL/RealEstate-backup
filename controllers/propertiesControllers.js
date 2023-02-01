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

router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
  
    Property.find({})
       
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        
        .then(properties => { 
           
            res.render('properties/index', { properties, username, loggedIn, userId })
        })

        .catch(err => {
            console.log(err)

            res.redirect(`/error?error=${err}`)
        })
})

// GET for the new page

router.get('/new', (req, res) => {
    res.render('properties/new', { ...req.session })
})

// CREATE route

router.post('/', (req, res) => {
   
    req.body.owner = req.session.userId

  
    req.body.forSale = req.body.forSale === 'on' ? true : false
    const newProperty = req.body
    console.log('this is req.body aka newFruit, after owner\n', newProperty)
    Property.create(newProperty)
        
        .then(property => {
            
            res.redirect(`/properties/${property.id}`)
        })
        
        .catch(err => {
            console.log(err)
            
            res.redirect(`/error?error=${err}`)
        })
})

// GET route
// Index -> This is a user specific index route

router.get('/mine', (req, res) => {
    
    Property.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(property => {
           
            res.render('properties/index', { property, ...req.session })
        })
        .catch(err => {
         
            console.log(err)
          
            res.redirect(`/error?error=${err}`)
        })
})


// Index -> This is a user specific index route

router.get('/json', (req, res) => {
  
    Property.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(property => {
            
            res.status(200).json({ property: property })
          
        })
        .catch(err => {
           
            console.log(err)
            res.status(400).json(err)
        })
})

// GET request -> edit route

router.get('/edit/:id', (req, res) => {
   
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

router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.forSale = req.body.forSale === 'on' ? true : false
    Property.findById(id)
        .then(property => {
       
            if (property.owner == req.session.userId) {
              
                return property.updateOne(req.body)
            } else {
                
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20fruit`)
            }
        })
        .then(() => {
            
            res.redirect(`/properties/mine`)
        })
        .catch(err => {
            console.log(err)
            
            res.redirect(`/error?error=${err}`)
        })
})

// DELETE route

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Property.findById(id)
        .then(property => {
         
            if (property.owner == req.session.userId) {
               
                return property.deleteOne()
            } else {
              
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20fruit`)
            }
        })
        .then(() => {
            res.redirect('/properties/mine')
        })
        .catch(err => {
            console.log(err)
           
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW route

router.get('/:id', (req, res) => {
   
    const id = req.params.id
    
    Property.findById(id)
        .populate('comments.author', 'username')
     
        .then(property => {
       
            res.render('properties/show.liquid', {property, ...req.session})
        })
        
        .catch(err => {
            console.log(err)
           
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router