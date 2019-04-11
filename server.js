//db backup 
// mongodump --host localhost --port 27017 --db catsdb
// as per https://stackoverflow.com/questions/11041614/how-do-i-export-dump-mongodb-database
const express = require("express")
const app = express()
const mongoose = require('mongoose');
const hbs = require("hbs")
// this is used for POST data understanding! without this you cannot read post data
const bodyParser = require('body-parser')
require('dotenv').config()

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
// here you are activating a middleware
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.dbConnectionStr);

const schema = { 
    name: String,
    age: Number
}
//collection name is Cat
const CatBuilder = mongoose.model('Cat', schema);

// const cats = Array(100)
//     .fill(0)
//     .map((x, idx) => ({
//         name: "gato numero " + idx,
//         age: Math.round(Math.random() * 10)
//     }))

// CatBuilder.insertMany(cats)
// .then((success) => {
//     console.log(success);
// })
// .catch((err) => {
//     console.log(err);
// })

// const kitty = new CatBuilder({ name: 'Kitty3' });

// kitty.save((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('meow');
//     }
// })

app.post("/newCat", (req, res) => {
    let newCat = req.body
    newCat.age = parseInt(newCat.age)

    CatBuilder.create(newCat)
        .then((newCatData) => res.json({catCreated: true, newCatData}))
})

app.get("/allcats", (req, res) => {
    CatBuilder
    .find({age: {$gte: 5}})
    .sort({age: 1})
    .limit(3)
    .then(allCats => res.json(allCats))
    .catch(err => console.log(err))
})

//http://localhost:3001/oneCat/5cadd666c2a3cb698b640712
app.get("/oneCat/:catID", (req, res) => {
    CatBuilder
    .findById(req.params.catID)
    .then(theCat => res.json(theCat))
    .catch(err => console.log(err))
})

//http://localhost:3001/oneCat/5cadd666c2a3cb698b640712
app.get("/oneCat", (req, res) => {
    CatBuilder
    .findById(req.query.catID)
    .then(theCat => res.json(theCat))
    .catch(err => console.log(err))
})

//http://localhost:3001/oneCatUpdate/5cadd666c2a3cb698b640712
app.get("/oneCatUpdate/:catID", (req, res) => {
    CatBuilder
    .findByIdAndUpdate(req.params.catID, {age: Math.random(), name: 'federico'}, {new: true})
    .then(theCat => res.json(theCat))
    .catch(err => console.log(err))
})

//http://localhost:3001/oneCatUpdate/5cadd666c2a3cb698b640712
app.get("/oneCatDelete/:catID", (req, res) => {
    CatBuilder
    .findByIdAndRemove(req.params.catID)
    .then(theCat => res.json(theCat))
    .catch(err => console.log(err))
})

app.get("/allcats/:ncats", (req, res) => {
    let totalCats = +req.params.ncats

    console.log(totalCats)
    CatBuilder
    .find({age: {$gte: 5}})
    .sort({age: 1})
    .limit(totalCats)
    .then(allCats => res.json(allCats))
    .catch(err => console.log(err))
})

// localhost:3000/allcats/200/age/5
// app.get("/allcats/:ncats/age/:age", (req, res) => {



app.get("/allcats/:ncats/:sorting", (req, res) => {
    let totalCats = +req.params.ncats
    let sorting = +req.params.sorting

    console.log(totalCats)
    CatBuilder
    .find({age: {$gte: 5}})
    .sort({age: sorting})
    .limit(totalCats)
    .then(allCats => res.json(allCats))
    .catch(err => console.log(err))
})

// update
// app.put("/catAgeUpdate/:catID")

// create
// app.post("/newCat")

// delete
// app.delete("/cat/:catID")

// app.put("/cats")

app.get("/findCity", (req, res) => {
    res.render("layout")
})
app.get("/search", (request, response) => {
    // console.log(req.params.city)
    // response.json({city: request.params.city})

    // http://localhost:3001/search?city=london&country=uk
    response.json(
        {
            city: request.query.city,
            country: request.query.country
        }
    )

    // setTimeout(function () {
    //     response.json({city: request.params.city})    
    // }, 10000)
});

app.listen(process.env.PORT)