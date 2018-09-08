const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {TodoModel} = require('./modals/todoModal');
var {UserModel} = require('./modals/userModal');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(request,response)=>{
    console.log(request.body);
    var newTodo = new TodoModel({
        text: request.body.text
    });
    newTodo.save().then((docs)=>{
        console.log('Saved Data!',docs);
        response.send(docs);
    },(error)=>{
        console.log('Error Occured!!',error);
        response.send(error);
    })
})

app.listen(3000,()=>{
    console.log('Server Up!');
});