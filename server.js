const express = require('express');
const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
    url : `redis://${process.env.REDIS_SERVER_IP}:${process.env.REDIS_SERVER_PORT}`,
    password: process.env.REDIS_SERVER_PWD,
    legacyMode:true,
});

client.connect()
.catch(err => {
    console.log(err);
})

client.on("error", function (err) {
    console.log("Error " + err);
});
 

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Create
app.post('/', (req,res) => {
    let params = req.body;
    console.log(params);
    const item = JSON.stringify(params);
    client.set('user', item, (err) => {
        console.log(err);
        
    })
    res.end(item);
})

// Update
app.get('/', (req,res) => {
    client.get("user", (err, result) => {
        console.log(result);
        const item = JSON.parse(result);
        console.log(item);
        res.json(item);
        res.end();
    });
})


// Read
app.get('/', (req,res) => {
    client.get("user", (err, result) => {
        console.log(result);
        const item = JSON.parse(result);
        console.log(item);
        res.json(item);
        res.end();
    });
})

// Delete
app.delete('/', (req,res) => {
    client.del("user", (err, deletedCount) => {
        console.log(deletedCount);
        res.end(deletedCount);
    });
})

app.listen(process.env.WEBSERVER_PORT, () => {
    console.log(process.env.WEBSERVER_PORT, "is Listening!!")
})