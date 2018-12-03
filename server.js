const express = require('express')
const app = express()
const port = 4000;
const Twig = require("twig");
const path = require('path');

app.set('views', path.join(__dirname, '/resources/views/'));
app.use(express.static('public'));

app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.get('/', function(req, res){
    res.render('pages/index.twig', {
        message : "Hello World"
    });
});

app.get('/signup', function(req, res) {
    res.render('pages/signup.twig');
});

app.get('/tos', function(req, res) {
    res.render('pages/tos.twig');
});

app.get('/signin', function(req, res) {
    res.render('pages/login.twig');
});

app.get('/password/start-reset', (req, res) => {
    res.render('pages/start-password-reset.twig');
});

app.get('/password/reset/:token', (req, res) => {
    let token = req.params.token;
    res.render('pages/password-reset.twig', {token});
});

app.get('/expeditions', (req, res) => {
    res.render('pages/expeditions-landing.twig');
});

app.get('/expeditions/create', (req, res) => {
    res.render('pages/expeditions-create.twig');
});

app.get('/user/logs/upload', (req, res) => {
    res.render('pages/user-upload-logs.twig');
});

app.get('/expeditions/:id', (req, res) => {
    let id = req.params.id;
    res.render('pages/expedition-single.twig', {id});
});



app.listen(port, function () {
    console.log('Raxxla Research Program WEB UI is listening on port ' + port);
});

