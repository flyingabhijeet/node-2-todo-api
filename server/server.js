const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {TodoModel} = require('./modals/todoModal');
var {UserModel} = require('./modals/userModal');

var app = express();

// app.use(bodyParser.json());

app.post('/todos',(request,response)=>{
    console.log(request.body);
    var newTodo = new TodoModel({
        text: request.body.text
    });
    newTodo.save().then((docs)=>{
        console.log('Saved Data!',docs);
        response.status(200).send(docs);
    },(error)=>{
        console.log('Error Occured!!',error);
        response.status(400).send(error);
        //sending status code 400 - badrequest if params are improper
    })
});

app.get('/todos',(request,response)=>{
    TodoModel.find().then((docs)=>{
        response.send({docs});
    },(error)=>{
        response.status(400).send("Cannot Fetch Data!");
    })
});

app.get('/todos/:id',(request,response)=>{
    var id = request.params.id;
    TodoModel.findById(id).then((doc)=>{
        if(!doc){
            return response.status(404).send('No Such Todo!');
        }
        response.send(doc);
    },(error)=>{
        response.status(400).send(error);
        console.log(error);
        
    }).catch((e)=>{reponse.send(e)})
});

app.listen(3000,()=>{
    console.log('Server Up!');
});