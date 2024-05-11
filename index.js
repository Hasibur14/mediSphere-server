const express = require('express'); 
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());








app.get('/', (req, res) => {
    res.send('mediSphere is Running')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})