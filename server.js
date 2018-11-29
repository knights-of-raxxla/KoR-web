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

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
})

