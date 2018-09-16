const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {TodoModel} = require('./modals/todoModal');
var {UserModel} = require('./modals/userModal');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(request,response)=>{
    console.log(request.body);
    var newTodo = new TodoModel({
        text: request.body.text
        //passing json via bodyParser and putting it in body
    });
    newTodo.save().then((docs)=>{
        console.log('Saved Data!',docs);
        response.status(200).send(docs);
        console.log('BodyParser check:',request.body.completed);
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

app.delete('/todos/:id',(request,response)=>{
    var id = request.params.id;

    if(!ObjectID.isValid(id)){
        return response.status(400).send('Invalid Id');
    }

    TodoModel.findByIdAndRemove(id).then((doc)=>{
        if(!doc)
        return response.status(404).send('No Doc Found with such id!');

        response.send(doc);
    },(error)=>{
        response.status(404).send('Bad Request, No Such Todo present')
    })
});

app.patch('/todos/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(400).send('Invalid ObjectId');
    }
    var body = _.pick(request.body,['text','completed']);
    console.log(body);
    if( _.isBoolean(body.completed) && body.completed ){
        body.completedAt = Date.now();
    }else{
        response.status(400).send('Pass Valid Data');
        body.completed = false;
        body.completedAt = null;
    }

TodoModel.findByIdAndUpdate(id,{$set:body}).then((doc)=>{
        if(!doc){
            return response.status(404).send('No Todo with such id');
        }
        response.status(200).send({doc});
    },(error)=>{
        response.send(400).send('Error Updating Todo!');
    });
    console.log(body);
});

app.listen(port,()=>{
    console.log(`Server on on the port ${port}`);
});