const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const server = express();
const port = 3000;

server.use(cors({origin: 'http://localhost:8080'}))
server.use(express.json({extended: false}));

server.post('/', (request, response) => {
    // SENDS RESPONSE TO CLIENT
    response.send("Thanks!! We received your graph state (^̮^)");

    // PROCESSES REQUEST BODY (graphState) INTO VARIABLE "committedWeeks"
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

    // PROCESSES COMMITTEDWEEKS INTO PROJECT DIRECTORY/FILES
    if (committedWeeks.commitsRequired) {
        // delete existing directory
        if(path.join(__dirname, '/your-art-project')) {
            fs.rmdirSync(path.join(__dirname, '/your-art-project'), { recursive: true });
            console.log("Old directory deleted!!!");
        }
        
        // make new directory
        fs.mkdir(path.join(__dirname, '/your-art-project'), {}, error => {
            if(error) console.log("ERROR with making your project directory:", error);
            console.log("Folder created!")
        });

        // create and write to file (will over-write if file already exists)
        fs.writeFile(path.join(__dirname, '/your-art-project', "harry-potter-and-the-prisoner-of-your-mum.txt"), "So this is how the story goes...\n\n", error => {
            if(error) console.log("ERROR creating your project files:", error);
            console.log("File created!")
        });

        for (const [week, days] of Object.entries(committedWeeks)) {
            let currentlyEvaluatedCommittedWeek = committedWeeks[week];

            if(week.includes("week")) {
                currentlyEvaluatedCommittedWeek.forEach((dayValue) => {
                    if (dayValue > 0) {
                        fs.appendFile(path.join(__dirname, '/your-art-project', "harry-potter-and-the-prisoner-of-your-mum.txt"), `${week} day${currentlyEvaluatedCommittedWeek.indexOf(dayValue) + 1} = ${dayValue}\n`, error => {
                            if(error) console.log("ERROR while cycling data/adding to file:", error);
                        });
                    }
                })
                console.log("Dates added to file!!");
            }
        }
        
        // for (let Week in committedWeeks) {
        //     let currentlyEvaluatedCommittedWeek = committedWeeks[Week];
            
        //     console.log(currentlyEvaluatedCommittedWeek)

        //     // console.log(`Week = ${Week}`, `committedWeeks = ${committedWeeks}`);
            
        //     currentlyEvaluatedCommittedWeek.forEach((dayValue) => {
        //         if (dayValue > 0) {
        //             fs.appendFile(path.join(__dirname, '/your-art-project', "harry-potter-and-the-prisoner-of-your-mum.txt"), `Heelllooo\n`, error => {
        //                 if(error) console.log("ERROR while cycling data/adding to file:", error);
        //             });
        //         }
        //     })
        //     console.log("Dates added to file!!")
        // }

        // // add to file
        // fs.appendFile(path.join(__dirname, '/test', "your-art-project.txt"), " This is the next commit of the project TESTING TESTING 1 2 3...", error => {
        //     if(error) console.log("There was an creating your project files:", error);
        //     console.log("Added to file!")
        // });

    } else {
        console.log("There is nothing to commit for this graph state");
        
        if(path.join(__dirname, '/your-art-project')) {
            console.log("Old directory deleted!!")
            fs.rmdirSync(path.join(__dirname, '/your-art-project'), { recursive: true });
        }
    }
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})