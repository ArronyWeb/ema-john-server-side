const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { parse } = require('dotenv');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmzsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    console.log("DB connect")
    // client.close();
});



async function run() {
    try {
        await client.connect()
        const productCollection = client.db("emajohn").collection("product");
        app.get('/products', async (req, res) => {
            const query = {}
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const cursor = productCollection.find(query)
            let result;
            if (page || size) {
                result = await cursor.skip(page * size).limit(size).toArray();
            } else {
                result = await cursor.toArray()
            }
            res.send(result)
        })

        // get the count 
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.countDocuments();
            res.json({ count })
        })
        // send the product using keys 
        app.post('/productBykeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
            console.log(keys)
        })
    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("Running server ")
})

app.listen(port, () => {
    console.log("running server", port)
})