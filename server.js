const path = require('path')
const http = require('http')
const fs = require('fs')
const uuid = require('uuid')
const formidable = require('formidable')
const url = require('url');

const Mongo = require('./db')
const Email = require('./email')

const mongo = new Mongo('admin')


const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
    'Content-type' : 'application/json'
  };

const server = http.createServer((req,res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');


	if(req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}

    if(req.url === '/'){
        console.log('Home')
        fs.readFile(path.join(__dirname, 'public','index.html'),(err, content)=>{
            if(err) throw err
            res.writeHead(200,{'Content-type':'text/html'})
            
            res.end(content)
        })
    }
    if(req.url === '/api/items'){
        mongo.findAll('stuffs',(i)=>{
            res.writeHead(200, headers)
            res.end(JSON.stringify(i))
        })
    }
    if(req.url === '/api/items/insert'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', () => {
            console.log(body)
            let obj = JSON.parse(body);
            let x = {_id:uuid.v1(),name:obj.name,surname:obj.surname,img:obj.img}
            console.log(x)
            mongo.insertOne("stuffs",x)
            res.writeHead(200)
            res.end();
        });
    }
    if(req.url === '/api/items/delete'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', () => {
            let obj = body;
            console.log(obj)
            mongo.deleteOne('stuffs',obj)
            res.writeHead(200)
            res.end()
        });
    }
    if(req.url === '/api/items/update'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', () => {
            let obj = JSON.parse(body);
            console.log(obj)
            mongo.updateOne('stuffs',obj.id,obj.name,obj.surname)
            res.writeHead(200)
            res.end()
        });
    }
    if(req.url === '/email'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', () => {

            let o = JSON.parse(body);
            let email = new Email()
            console.log("Sending email...",o)

            try {  
                email.send(o)
                res.writeHead(200, headers)
                res.end(JSON.stringify({res:0, outcome:"Your message has been sent!"}))

            } catch (error) {
                console.log(error)
                res.writeHead(200, headers)
                res.end(JSON.stringify({res:-1, outcome:"Something went wrong... Please retry"}))
            }
          
        });
    }
    if(req.url === '/api/items/file'){
        var form = new formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
            if(err) console.log(err)
            let tempPath = files.file._writeStream.path
            let originalFilename = files.file.originalFilename
            let newFileName = files.file.newFilename+'.png'
          
            fs.rename(tempPath,path.join(__dirname,'public','assets',newFileName),(err)=>{
                console.log('file received: ',originalFilename)
                res.writeHead(200,{'Content-type':'application/json'});
                res.end(JSON.stringify({__filename:newFileName}));
            })
        })
    }
    if(req.url.includes('/api/item/single-item/')){
     let u = url.parse(req.url)
     let q = u.query
      mongo.findOne('stuffs',q, (i)=>{
        res.writeHead(200,headers)
        res.end(JSON.stringify(i))
      })
    
      
    }

    if(req.url.includes('/api/images/')){
        // HANDLE 404 ERROR
        res.writeHead(200,{'content-type':'image/png'});
        fs.createReadStream(path.join(__dirname,'public','assets',req.url.substring(12))).pipe(res)
    }

})

module.exports = server