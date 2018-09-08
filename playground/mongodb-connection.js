const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
    if(error){
        return console.log('Cannot Establish Connection!');
    }
    console.log('Connection Established!');

    // db.collection('Todo').insertOne({
    //     text:'Something to do!',
    //     completed: false
    // },(error,result)=>{
    //     if(error){
    //        return console.log('Cannot insert data to TodoApp',error);
    //     }
    //     console.log('Successfuly! Added data to TodoApp');

    //     console.log(JSON.stringify(result.ops));
    // });

    db.collection('Users').insertOne({
        Name: 'Abhijeet',
        Age :20,
        Location:'Sikar Houese Jaipur Rajasthan'
    },(error,result) => {
        if(error){
            return console.log('Cannot insert data to TodoApp');
        }
            console.log('Successfuly! Added data to TodoApp!');
            console.log(JSON.stringify(result.ops));
    });

    db.close();
});