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
        const bookedCollection = client.db('mediSphere').collection('booked');


        //get service data
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        });

        //get popular service data
        app.get('/popularServices', async (req, res) => {
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

        //service details
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

        //get a service data from db using email
        app.get('/serviceJob/:providerEmail', async (req, res) => {
            const providerEmail = req.params.providerEmail;
            const cursor = serviceCollection.find({ providerEmail });
            const result = await cursor.toArray();
            res.send(result);
        });

        //Delete service data
        app.delete('/serviceDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })

        // update a job in db
        app.put('/serviceUpdate/:id', async (req, res) => {
            const id = req.params.id
            const serviceData = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    ...serviceData,
                },
            }
            const result = await serviceCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        /**
        * ..............................................
        *                    BOOKED SERVICE
        * ..............................................
        */
        //add service book in db
        app.post("/serviceBook", async (req, res) => {
            const serviceBook = req.body
            const result = await bookedCollection.insertOne(serviceBook);
            res.send(result)
        })

        // get data  using user email in db
        app.get('/booked/:userEmail', async (req, res) => {
            const userEmail = req.params.userEmail
            const cursor = bookedCollection.find({ userEmail });
            const result = await cursor.toArray();
            res.send(result);
        });

        //get data in provider email
        app.get('/bookRequest/:providerEmail', async (req, res) => {
            const providerEmail = req.params.providerEmail
            const cursor = bookedCollection.find({ providerEmail });
            const result = await cursor.toArray();
            res.send(result);
        });

         //update bid status
         app.patch('/book/:id', async (req, res) => {
            const id = req.params.id
            const status = req.body
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: status,
            }
            const result = await bookedCollection.updateOne(query, updateDoc)
            res.send(result)
        })



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