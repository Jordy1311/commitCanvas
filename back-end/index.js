const express = require('express');
const cors = require('cors');
const fs = require('fs');

const server = express();
const port = 3000;

server.use(cors({origin: 'http://localhost:8080'}))
server.use(express.json({extended: false}));

server.post('/', (request, response) => {
    response.send("Thanks!! We received your graph state (^̮^)");
    let graphState = request.body;

    let committedWeeks = {
        commitsRequired: false
    };

    for (let Week in graphState) {
        let currentlyEvaluatedWeek = graphState[Week];
        currentlyEvaluatedWeek.forEach((dayValue) => {
            if (dayValue > 0) {
                committedWeeks.commitsRequired = true
                committedWeeks[Week] = currentlyEvaluatedWeek
            }
        })
    }

    if (committedWeeks.commitsRequired) {
        console.log(committedWeeks);
    } else {
        console.log("There is nothing to commit for this graph state");
    }
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})