const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://myUserAdmin:abc123@127.0.0.1:27017'

class Mongo {

    constructor(name){
        this.name = name
    }

    updateOne(collectionName, id, uName, uSurname){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name)
                let collection = db.collection(collectionName)         
                var myquery = { _id: id};
                var newvalues = { $set: {name: uName, surname: uSurname } };
                collection.updateOne(myquery, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log(res)
                    console.log("1 item updated");
                    client.close();
                });
            })
        } catch(err){
            console.log(err)
        }
        
    }
    
    count(collectionName){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name)
                let collection = db.collection(collectionName)         
                collection.count((err,res)=>{
                    console.log(res)
                    client.close()
                })
            })
        } catch(err){
            console.log(err)
        }
    }

    createCollection(collectionName){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name    )         
                db.createCollection(collectionName, function(err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                });
            })
        } catch(err){
            console.log(err)
        }
    }

    dropCollection(collectionName){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name    )         
                db.dropCollection(collectionName, (ee,res)=>{
                    console.log(res)
                })
            })
        } catch(err){
            console.log(err)
        }
    }

    deleteOne(collectionName,id){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name)         
                let collection = db.collection(collectionName)
                collection.deleteOne({ _id: id}, function(err, obj) {
                if (err) throw err;
                console.log(obj);
                });
            })
        } catch(err){
            console.log(err)
        }
    }

    insertOne(collectionName, object){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name)         
                let collection = db.collection(collectionName)
                collection.insertOne(object,(err,res)=>{
                    if(err) throw err
                    console.log(res)
                    client.close()
                })
            })
        } catch(err){
            console.log(err)
        }
    }

    findOne(collectionName,id,callback){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name)         
                let collection = db.collection(collectionName)
                collection.findOne({_id:id}, (err, res)=> {
                    if (err) throw err;
                    client.close();
                    return callback(res)
                  });
            })
        } catch (err) {
            console.log(err)
            return callback(err)
        }
    }

    findAll(collectionName,callback){
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) return console.log(err)
                let db = client.db(this.name)         
                let collection = db.collection(collectionName)
                collection.find({}).toArray((err,res)=>{
                    if(err) throw err
                    client.close()
                    return callback(res)
                })
            })
        } catch (err) {
            console.log(err)
            return callback(err)
        }
    }
}

module.exports = Mongo