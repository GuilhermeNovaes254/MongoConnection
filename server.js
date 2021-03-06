const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;



app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

// const uri = "mongodb+srv://crud-node:<password>@cluster0.kxcxw.mongodb.net/<namedb>?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/names"
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


client.connect(err => {

    if (err) return console.log(err)
    db = client.db('names')
    console.log("Creating Connection")
    app.listen(3000, function () {
        console.log("server running on port 3000");
    })
});

app.get('/', function (req, res) {
    res.render('index.ejs');
})

app.post('/show', function (req, res) {

    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err);

        console.log('Saved in the database.')
        res.redirect('/show')
        db.collection('data').find().toArray((err, results) => {
            console.log(results);
        })
    })

})

app.get('/show', (req, res) => {

    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)


        res.render('show.ejs', {
            data: results

        })

    })
})

app.get('/delete', (req, res) => {

    let {
        id
    } = req.query

    db.collection('data').deleteOne({
        _id: ObjectId(id)
    })

    res.redirect('/show')
})

app.get('/update/params', (req, res) => {

    let {
        id
    } = req.query

    db.collection('data').findOne({
        _id: ObjectId(id)
    }, (err, results) => {
        if (err) return console.log(err)

        res.render('params.ejs', {
            params: results
        })

    })

})

app.get('/update', (req, res) => {

    let {
        name,
        surname,
        id
    } = req.query
    // db.collection('data').findOne({_id: ObjectId(id)}, ((err, results) => {


    // console.log(typeof (name))
    if (name.length > 0 && surname.length == 0) {
        db.collection('data').updateOne({
            _id: ObjectId(id)
        }, {
            $set: {
                name: name
            }
        })

    } else {
        if (surname.length > 0 && name.length == 0) {
            db.collection('data').updateOne({
                _id: ObjectId(id)
            }, {
                $set: {
                    surname: surname
                }
            })

        } else {
            if (surname.length > 0 && name.length > 0) {
                db.collection('data').updateOne({
                    _id: ObjectId(id)
                }, {
                    $set: {
                        name: name,
                        surname: surname
                    }
                })

            }
        }
    }

    res.redirect('/show')
})