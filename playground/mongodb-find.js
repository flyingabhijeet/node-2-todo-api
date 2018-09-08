const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
    if(error){
        return console.log('Unable to connect to database');
    }
    console.log('Connected to database!')

    db.collection('Todo').find({_id:new ObjectID('5b93b2e41732b9730643a3cc')}).toArray((error,results)=>{
        if(error){
            return console.log('Cannot find result!');
        }
        console.log(JSON.stringify(results,undefined,2));
    });
    db.close();
})