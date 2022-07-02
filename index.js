'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {check, validationResult} = require('express-validator/check');
const mongojs = require('mongojs');

const app = express();
const db = mongojs('customerapp', ['users']);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Global Variable for error
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});


let users = [
    {
        id: 66,
        first_name: "trent",
        last_name: "Arnoold",
        email: "trent66@gmail.com"
    },
    {
        id: 23,
        first_name: "robo",
        last_name: "robertson",
        email: "Andrew66@gmail.com"
    },
];

let team = 'Liverpool';
app.get('/', (req, res)=>{
    db.users.find(function (err, docs) {
        //console.log(docs);
        res.render('index', {
            team: team,

            // data from object
            //users: users

            // data from mongodb
            users: docs
        });
    });

});

app.post('/users/add', [
    check('first_name').not().isEmpty().withMessage('First Name is Reqiured'),
    check('last_name', 'Last Name is Reqiured').not().isEmpty(),
    check('email', 'email.....').optional(),
    ],
    function(req, res){
        const errors = validationResult(req);
        //console.log(req.body);
        if (!errors.isEmpty()) {
            //console.log(errors.errors);
            res.render('index', {
                team: team,
                users: users,
                errors: errors.errors
            });
          } else {
            let newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }

            // use mongodb to rander data from body and show it in frontend
            db.users.insert(newUser, (err, result)=>{
                if(err){
                    console.log(err);
                }
                res.redirect('/');
            });
          }
    }
);

app.delete('/users/delete/:id', (req, res)=>{
    db.users.remove({_id: mongojs.ObjectId(req.params.id)}, (err, result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, ()=>{
    console.log('Server started on port 3000...');
});

