const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;




//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lfxjcnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const serviceCollection = client.db('mediSphere').collection('services');
       // const bookedCollection = client.db('mediSphere').collection('booked');


        //get service data
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        });

        // Get a single service data from db using service id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        });

        //add service in db
        app.post("/service", async (req, res) => {
            const serviceData = req.body
            const result = await serviceCollection.insertOne(serviceData);
            res.send(result)
        })



        // booked service






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('mediSphere is Running')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})