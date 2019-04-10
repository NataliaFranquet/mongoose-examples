//db backup 
// mongodump --host localhost --port 27017 --db catsdb
// as per https://stackoverflow.com/questions/11041614/how-do-i-export-dump-mongodb-database
const express = require("express")
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()

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

app.listen(process.env.PORT)