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
    const salesCollection= client.db('nbcMotors').collection('sales');
    const inquiryCollection= client.db('nbcMotors').collection('inquiry');

    try {

        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikeCollection.find(query);
            const result = await cursor.toArray();
            res.send({success: 'Find Succesfully', data: result});
        });
        app.get('/sales', async (req, res) => {
            const query = {};
            const cursor = salesCollection.find(query);
            const result = await cursor.toArray();
            res.send({success: 'Find Succesfully', data: result});
        });

        app.get('/bikes/:id', async(req, res)=>{
            const id= req.params.id;
            const query={_id: ObjectId(id)}
            const result= await bikeCollection.findOne(query);;
            res.send({success: 'Find One Successfully', data: result})
        });

        app.put('/bikes/:id', async(req, res)=>{
            const id= req.params.id;
            const data= req.body;
            console.log(data);
            const filter={_id:ObjectId(id)};
            const options = {upsert: true };
            const updateDoc = {
                $set: {
                 quantity: data.quantity,
                },
              };
            const result= await bikeCollection.updateOne(filter, updateDoc, options);
            res.send(result);
            
        });

        app.delete('/bikes/:id', async(req, res)=>{
            const id= req.params.id;
            const filter= {_id: ObjectId(id)};
            const result= await bikeCollection.deleteOne(filter)
            res.send(result);
        });

        app.post('/bikes', async(req, res)=>{
            const newBikes= req.body;
            const result= await bikeCollection.insertOne(newBikes);
            console.log(result);
            res.send(result)
        })
        app.post('/sales', async(req, res)=>{
            const newSales= req.body;
            const result= await salesCollection.insertOne(newSales);
            console.log(result);
            res.send(result)
        })
        app.post('/inquiry', async(req, res)=>{
            const newInquiry= req.body;
            const result= await inquiryCollection.insertOne(newInquiry);
            console.log(result);
            res.send(result)
        })


    } catch (error) {

    }
}

run();


app.get('/', (req, res) => {
    res.send('NBC Server is Running')
})

app.listen(port, () => {
    console.log('Listening to Port', port);
})