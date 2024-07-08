const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 3000

function getMongoClient(){
    const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
    const password = '' // get the passoword from env variable
    const uri = `mongodb+srv://Sam109:${password}@mongo101.8im1r2y.mongodb.net/?appName=Mongo101`;
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    return client
}

app.get('/get-list', async (req, res) => {
    const client = getMongoClient()
      try {
        await client.connect();
        const list = await client.db("task").collection("task_list").find().toArray()
        res.status(200).send(list);
      }
      catch(error){
        if (error instanceof MongoClient.NetworkError) {
            res.status(503).send({ error: 'Service Unavailable', message: 'Failed to connect to the database' });
        } else {
            res.status(500).send({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
        }
        console.error(error)
      }
       finally {
        await client.close();
      }
})

app.post('/add-task', async(req, res)=>{
    const client = getMongoClient()
    try{
        await client.connect()
        const res1 = await client.db("task").collection("task_list").insertOne(req.body)
        res.status(201).send()
    }
    catch(error){
        if (error instanceof MongoClient.NetworkError) {
            res.status(503).send({ error: 'Service Unavailable', message: 'Failed to connect to the database' });
        } else {
            res.status(500).send({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
        }
      }
    finally{
        await client.close()
    }
})

app.delete('/delete-task/:id', async(req, res)=>{
    const client = getMongoClient()
    try{
        const {ObjectId} = require('mongodb')
        await client.connect()
        console.log(req.params, req.query)
        const res1 = await client.db("task").collection("task_list").deleteOne({_id: new ObjectId(req.params.id)})
        res.status(200).send()
    }
    catch(error){
       console.error(error)
      }
    finally{
        await client.close()
    }
})



app.post('/update-task', async(req, res, next)=>{
    console.log(req.body)
    const client = getMongoClient()
    try{
        await client.connect()
        if(req.body && req.body._id){
            const res11 = await client.db("task").collection("task_list").replaceOne({ _id: req.body.id }, req.body)
            res.status(200).send()
        }
        else{
            res.status(400).send()
        }
    }
    catch(error){
        console.error(error)
      }
    finally{
        await client.close()
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
