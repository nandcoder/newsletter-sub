// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_KEY);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
}

const schema = new mongoose.Schema({
    _id: Number,
    fname: {
        type: String,
        required: [true, "Add your first name"],
    },
    lname: {
        type: String,
        required: [true, "Add your last name"],
    },
    email: {
        type: String,
        required: [true, "Add your e-mail id"],
    }
});

const person = new mongoose.model("Newsletter", schema);
let collectionSize;
const getId = () => {
    person.find((err, val) => {
        if (err) {
            console.log(err);
            collectionSize = -1;
        }
        else {
            console.log(val.length);
            collectionSize = val.length;
        }
    });
}

app.get('/', (req, res) => {
    console.log('Root Get Route');
    getId();
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const eMail = req.body.email;

    const id = collectionSize + 1;

    if (id === 0 || collectionSize === undefined) {
        console.log("DB Error");
        res.sendFile(__dirname + '/failure.html');
    }
    else {
        const data = new person({
            _id: id,
            fname: firstName,
            lname: lastName,
            email: eMail
        });

        data.save((err) => {
            if (err) {
                console.log(err);
                res.sendFile(__dirname + '/failure.html');
            }
            else {
                console.log("Subscription added to database");
                res.sendFile(__dirname + '/success.html');
            }
        });
    }
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running @3000");
    })
})