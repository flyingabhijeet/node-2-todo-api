const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
var {mongoose} = require('./db/mongoose');
var {TodoModel} = require('./modals/todoModal');
var {UserModel} = require('./modals/userModal');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./../middleware/authenticate.js');
var _ = require('lodash');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',authenticate,(request,response)=>{

    console.log(request.body);
    var newTodo = new TodoModel({
        text: request.body.text,
        creator:request.user._id
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

app.get('/todos',authenticate,(request,response)=>{
    TodoModel.findOne({creator:request.user._id}).then((Todos)=>{
        response.send({Todos});
    },(error)=>{
        response.status(400).send("Cannot Fetch Data!");
    })
});

app.get('/todos/:id',authenticate,(request,response)=>{
    var id = request.params.id;
    TodoModel.fineOne({_id:id,creator:request.user._id}).then((doc)=>{
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

    TodoModel.findOneAndRemove({_id:id,creator:request.user._id}).then((doc)=>{
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

TodoModel.findOneAndUpdate({_id:id,creator:request.user._id},{$set:body}).then((doc)=>{
        if(!doc){
            return response.status(404).send('No Todo with such id');
        }
        response.status(200).send({doc});
    },(error)=>{
        response.send(400).send('Error Updating Todo!');
    });
    console.log(body);
});

app.post('/users',(request,response)=>{
    // var body = _.pick(request.body,['email','password']);
    // var newUser = new UserModel(body);
    var newUser = new UserModel({
        email:request.body.email,
        password:request.body.password
    })
    newUser.save().then(()=>{
        // console.log('User Registerd!');
        // response.send(user)
        return newUser.generateAuthToken();
    }).then((token_recieved)=>{
        response.header('x-auth',token_recieved).send(newUser);
        console.log('token is',token_recieved);
    }).catch((error)=>{
        console.log('Error registering user!',error);
        response.status(400).send(error);
    });
});

// app.post('/users/login',(request,response)=>{
//     // var getUser = new UserModel({

//     // })
//     var entered_mail = request.body.email;
//     var entered_password = request.body.password;
//     var hashedpwd;
//     var userFetched;
//     // console.log(entered_mail);
//     UserModel.findOne({email:entered_mail}).then((user)=>{
//         hashedpwd = user.password;
//         bcrypt.compare(entered_password,hashedpwd,(error,result)=>{
//             console.log(result);
//             if(!result){
//               return  response.status(400).send()
//             }
//             response.status(200).send(user);
       
//         });
//     }).catch((e)=>{
//         hashedpwd = null;
//     });

// });

app.post('/users/login',(request,response)=>{
    var body = _.pick(request.body,['email','password']);
    UserModel.findByCredentials(body.email,body.password).then((user)=>{
        if(!user){
            return response.status(400).send();
        }
        console.log(`User found is ---> ${user}`);
        user.generateAuthToken().then((token_recieved)=>{
            response.header('x-auth',token_recieved).send(user);
        });
    }).catch((e)=>{
        response.status(400).send();
        console.log(e);
    })
});

app.delete('/users/me/token',authenticate,(request,response)=>{
    (request.user).removeToken(request.token).then(()=>{
        response.status(200).send('Sucessfully Logged Out!')
    },()=>{
        response.status(404).send();
    }).catch((e)=>{
        response.status(400).send(e);
    })
});

app.get('/users/me',authenticate,(request,response)=>{
    response.send(request.user);
});

app.listen(port,()=>{
    console.log(`Server on on the port ${port}`);
});