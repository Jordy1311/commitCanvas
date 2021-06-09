const express = require('express');
const cors = require('cors');
const fs = require('fs');

const server = express();
const port = 3000;

server.use(cors({origin: 'http://localhost:8080'}))

server.get('/', (request, response) => {
    let greeting = "Hello";
    let name = "Jordan";
    
    response.send(`${greeting} ${name}!!`)
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})