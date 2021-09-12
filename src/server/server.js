const dotenv = require('dotenv');
dotenv.config();
var path = require('path');
const fetch = require('node-fetch');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');

const app = express()
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.get('/test', function (req, res) {
    console.log('test');
    res.send(mockAPIResponse);
})

const API_URL = 'https://api.meaningcloud.com/sentiment-2.1?'
const API_KEY = process.env.API_KEY
console.log(`Your API Key is ${process.env.API_KEY}`);

app.post('/nlp', async function (req, res) {
    let urlFromPost = '';

    req.on('data', function (data) {
        urlFromPost += data;
    });

    req.on('end', function () {
        urlFromPost = JSON.parse(urlFromPost);
        urlFromPost = urlFromPost.url;
        console.log(`urlFromPost: ${urlFromPost}`);

        const urlAPI = `${API_URL}key=${API_KEY}&url=${urlFromPost}&lang=en`
        console.log(`urlAPI: ${urlAPI}`);

        fetch(urlAPI)
        .then(async function (resOfAPI){
            const mcRes = await resOfAPI.json()
            console.log(`MC res`)
            console.log(mcRes)
            res.send(mcRes)
            console.log(`MC res sent`)
        })
    });
})

let port = 8081;
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
})
