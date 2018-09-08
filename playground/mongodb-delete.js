const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
    if(error){
        return console.log('Unable to connect to database');
    }
    console.log('Connected to database!');

    //All methods:-
    //deleteMany()
    //deleteOne()
    //findOneAndDelete

    db.collection('Todo').findOneAndDelete({completed:true},(error,result)=>{
        if(error){
            return console.log('Cannot Delete data!')
        }
        console.log('Deleted!!!')
        console.log(result);
    })
    db.close();
})