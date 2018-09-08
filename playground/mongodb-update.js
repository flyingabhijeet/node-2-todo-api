const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
    if(error){
        return console.log('Unable to connect to database');
    }
    console.log('Connected to database!')

    db.collection('Users').findOneAndUpdate(
        {Name:'Arushi'},
        {$set:{Name:'Abhijeet'},$inc:{Age:1}},
        {returnOrignal:false, upsert:true},
        (error,result)=> {
            console.log('Data Updated!', result)
        }
    )
    
    db.close();
})