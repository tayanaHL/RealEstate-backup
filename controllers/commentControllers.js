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

router.post('/:propertyId', (req, res) => {
    
    const propertyId = req.params.propertyId
    
    console.log('this is the session\n', req.session)
    if (req.session.loggedIn) {
        
        req.body.author = req.session.userId
        
        const theComment = req.body
    
        Property.findById(propertyId)
            .then(property => {
               
                property.comments.push(theComment)
             
                return property.save()
            })
            
            .then(property => {
                
                res.redirect(`/properties/${property.id}`)
            })
   
            .catch(err => {
                console.log(err)
               
                res.redirect(`/error?error=${err}`)
            })
    } else {

        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20fruit`)
    }
})


router.delete('/delete/:propertyId/:commId', (req, res) => {
   
    const { propertyId, commId } = req.params
  
    Property.findById(propertyId)
        .then(property => {
            
            const theComment = property.comments.id(commId)
            console.log('this is the comment to be deleted: \n', theComment)

            if (req.session.loggedIn) {
            
                if (theComment.author == req.session.userId) {
                   
                    theComment.remove()
                    property.save()
                   
                    res.redirect(`/properties/${property.id}`)
                } else {
                    
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
                }
            } else {
             
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
            }
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