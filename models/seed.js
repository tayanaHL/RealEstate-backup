/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Property = require('./properties')

// Here, we'll add our seed script
// this will seed our database for us, just like our seed route did
// the difference is, only an 'administrative' type of user can run this script
// this script will eventually be run with the command `npm run seed`

// This is our old seed route (for reference)
// There are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices
// router.get('/seed', (req, res) => {
//     // array of starter resources(fruits)
//     const startFruits = [
//         { name: 'Orange', color: 'orange', readyToEat: true },
//         { name: 'Grape', color: 'purple', readyToEat: true },
//         { name: 'Banana', color: 'green', readyToEat: false },
//         { name: 'Strawberry', color: 'red', readyToEat: false },
//         { name: 'Coconut', color: 'brown', readyToEat: true }
//     ]
//     // then we delete every fruit in the database(all instances of this resource)
//     Fruit.deleteMany({})
//         .then(() => {
//             // then we'll seed(create) our starter fruits
//             Fruit.create(startFruits)
//                 // tell our db what to do with success and failures
//                 .then(data => {
//                     res.json(data)
//                 })
//                 .catch(err => console.log('The following error occurred: \n', err))
//         })
// })

/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
    // array of starter resources(fruits)
    const startProperty = [
        { id:1, location: 'Toronto', forSale: true, images:  "https://www.ctvnews.ca/content/dam/ctvnews/en/images/2021/7/3/housing-1-5495521-1627408456209.jpg", price: 1250000 },
        { id:2, location: 'Oakville', forSale: true, images:  "http://midtownappraisalgroup.com/wp-content/uploads/2021/01/2storey1.jpg", price: 750000 },
        { id:3, location: 'Burlington', forSale: true, images: "http://midtownappraisalgroup.com/wp-content/uploads/2021/01/3storey1-1024x683.jpg", price: 700000 },
        { id:4, location: 'London', forSale: true, images: "http://midtownappraisalgroup.com/wp-content/uploads/2021/01/3storey1-1024x683.jpg", price: 590000 },
        { id:5, location: 'Hamilton', forSale: true, images: "https://media.blogto.com/articles/20210505-affordablehomesontariolead.jpg?w=2048&cmd=resize_then_crop&height=1365&quality=70", price: 670000 },
		{ id:6, location: 'Toronto', forSale: true, images: "https://findlayrealestate.ca/wp-content/uploads/2022/02/trafalgarmeadows_essencehomes_rendering_interior-townhomes-townhouse-for-sale-georgetown-burlington-oakville-stoneycreek-8.jpeg", price: 900000 },
        { id:7, location: 'Oakville', forSale: true, images: "https://www.engelvoelkers.com/images/3ddfb2c7-c210-4197-ae0a-04d1b3d5dbc9/apartment-in-oakville-ontario", price: 800000 },
        { id:8, location: 'Toronto', forSale: true, images: "https://media.istockphoto.com/id/108220043/photo/row-of-suburban-townhouses-on-summer-day.jpg?s=612x612&w=0&k=20&c=JsgZj2lP1OavojeafCQNanTbVZzFO4qygnQhgdmx-aw=", price: 920000 },
        { id:9, location: 'London', forSale: false, images: "https://st2.depositphotos.com/1658611/10598/i/600/depositphotos_105989652-stock-photo-suburban-apartment-building.jpg", price: 1650 },
        { id:10, location: 'Hamilton', forSale: false, images: "https://media.istockphoto.com/id/1273552068/photo/exterior-view-of-modern-apartment-building.jpg?s=612x612&w=0&k=20&c=Gk9XeJIBPJvbWzY4MrW7E3eeJJmy-iggBwMBcjewrLg=", price: 1900 },
		{ id:11, location: 'Toronto', forSale: false, images: "https://thumbs.dreamstime.com/b/luxury-inviting-view-toronto-down-town-area-residential-condo-stylish-modern-buildings-ontario-canada-june-beautiful-tower-98403313.jpg", price: 3500 },
        { id:12, location: 'Oakville', forSale: false, images: "https://media.istockphoto.com/id/1361546459/photo/new-aprtment-building-in-a-housing-deveopment-on-a-sunny-autumn-day.jpg?b=1&s=170667a&w=0&k=20&c=6G9vvT-Hm011u9enMbIEwoKMOpLSsnXEuonORiBOENo=", price: 3000 },
        { id:13, location: 'Burlington', forSale: false, images: "https://media.istockphoto.com/id/949087660/photo/fountain-at-complex-of-apartment-residential-buildings-quarter.jpg?s=612x612&w=0&k=20&c=PZRDszGRmGaM8YR-4GUGoYnYjpplLvKb6TSENjrRuwQ=", price: 2800 },
        { id:14, location: 'Toronto', forSale: false, images: "https://media.istockphoto.com/id/1361546459/photo/new-aprtment-building-in-a-housing-deveopment-on-a-sunny-autumn-day.jpg?b=1&s=170667a&w=0&k=20&c=6G9vvT-Hm011u9enMbIEwoKMOpLSsnXEuonORiBOENo=", price: 3300 },
        { id:15, location: 'Hamilton', forSale: false, images: "https://thumbs.dreamstime.com/b/apartment-building-modern-richmond-british-columbia-canada-32036648.jpg", price: 2400 }
    ]
    // then we delete every fruit in the database(all instances of this resource)
    // this will delete any fruits that are not owned by a user
    Property.deleteMany({ owner: null })
        .then(() => {
            // then we'll seed(create) our starter fruits
            Property.create(startProperty)
                // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the created properties: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // always close the connection
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})