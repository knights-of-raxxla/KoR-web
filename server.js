const express = require('express')
const app = express()
var Twig = require("twig"),

/ This section is optional and used to configure twig.
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.get('/', function(req, res){
    res.render('index.twig', {
        message : "Hello World"
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

