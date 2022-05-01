const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

// Middleware

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khoup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    await client.connect();
    const bikeCollection = client.db('nbcMotors').collection('bikes');

    try {

        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikeCollection.find(query);
            const result = await cursor.toArray();
            res.send({success: 'Find Succesfully', data: result});
        });

        app.get('/bikes/:id', async(req, res)=>{
            const id= req.params.id;
            const query={_id: ObjectId(id)}
            const result= await bikeCollection.findOne(query);;
            res.send({success: 'Find One Successfully', data: result})
        })


    } catch (error) {

    }
}

run();

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.get('/', (req, res) => {
    res.send('NBC Server is Running')
})

app.listen(port, () => {
    console.log('Listening to Port', port);
})