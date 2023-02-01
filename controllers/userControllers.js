/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////
// GET -> /users/signup

router.get('/signup', (req, res) => {
 
    res.render('users/signup')
})


// POST -> /users/signup

router.post('/signup', async (req, res) => {
    
    const newUser = req.body
    console.log('this is req.body', req.body)
  
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    )
   
    User.create(newUser)
        
        .then(user => {
          
            res.redirect('/users/login')
        })
       
        .catch(err => {
            console.log(err)
           
            res.redirect(`/error?error=username%20taken`)
        })
})

// GET -> /users/login

router.get('/login', (req, res) => {
    res.render('users/login')
})

// POST -> /users/login

router.post('/login', async (req, res) => {
    
    const { username, password } = req.body

  
    User.findOne({ username })
        .then(async (user) => {
           
            if (user) {
               
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                  
                    res.redirect('/')
                } else {
                   
                    res.redirect(`/error?error=username%20or%20password%20is%20incorrect`)
                }

            } else {
               
                res.redirect(`/error?error=user%20does%20not%20exist`)
            }

        })
        .catch(err => {
            console.log(err)
            // res.json(err)
            res.redirect(`/error?error=${err}`)
        })
})


// GET -> /users/logout

router.get('/logout', (req, res) => {
    res.render('users/logout')
})

// DELETE -> /users/logout

router.delete('/logout', (req, res) => {

    req.session.destroy(() => {
        console.log('this is req.session upon logout \n', req.session)
      
        res.redirect('/')
    })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router