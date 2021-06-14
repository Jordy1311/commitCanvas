const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const server = express();
const port = 3000;
server.use(cors({ origin: "http://localhost:8080" }));
server.use(express.json({ extended: false }));

server.post("/", (request, response) => {
  // SEND RESPONSE TO CLIENT
  // response.send("Thanks!! We received your graph state (^̮^)");

  // FUNCTIONS
  let getCommittedDays = (graphState) => {
    let committedDaysTempArray = {
      commitsRequired: false,
    };

    for (let Week in graphState) {
      let currentlyEvaluatedWeek = graphState[Week];
      currentlyEvaluatedWeek.forEach((dayValue) => {
        if (dayValue > 0) {
          committedDaysTempArray.commitsRequired = true;
          committedDaysTempArray[Week] = currentlyEvaluatedWeek;
        }
      });
    }

    return committedDaysTempArray;
  };

  let createProjectDirectory = () => {
    // delete existing directory
    if (path.join(__dirname, "/art-project")) {
      fs.rmdirSync(path.join(__dirname, "/art-project"), {
        recursive: true,
      });
    }
    // make new directory
    fs.mkdirSync(path.join(__dirname, "/art-project"), {}, (error) => {
      if (error) console.log("ERROR with making project directory:", error);
      console.log("Folder created!");
    });
    // copy project readme.md
    fs.copyFileSync(
      path.join(__dirname, "/templateREADME.md"),
      path.join(__dirname, "/art-project", "README.md")
    );
    // create project art-file
    fs.writeFileSync(
      path.join(__dirname, "/art-project", "art-file.txt"),
      "These are your commits:\n",
      (error) => {
        if (error) console.log("ERROR creating the project art-file:", error);
      }
    );

    // init git repo
    // commit all files -m "initial project files"
  };

  let createProjectArtFile = (committedDays) => {
    // loop through committed days and write/commit when dayvalue > 0
    for (const [week, days] of Object.entries(committedDays)) {
      if (week.includes("week")) {
        days.forEach((dayValue) => {
          if (dayValue > 0) {
            fs.appendFileSync(
              path.join(__dirname, "/art-project", "art-file.txt"),
              `\n${week} day${
                days.indexOf(dayValue) + 1
              } = ${dayValue}`,
              (error) => {
                if (error)
                  console.log(
                    "ERROR while cycling data/adding to file:",
                    error
                  );
              }
            );
          }
        });
      }
    }
  };

  // STEP 1 - PROCESS REQUEST BODY INTO VARIABLE
  let committedDays = getCommittedDays(request.body);

  // STEP 2 - PROCESSES COMMITTEDDAYS INTO PROJECT DIRECTORY/FILES
  if (committedDays.commitsRequired) {
    response.send("Thanks!! We received your graph state (^̮^)");

    createProjectDirectory();
    createProjectArtFile(committedDays);

    console.log("Requested project created!!")
  } else {
    response.send("Oops!! Looks like you didn't submit anything (^̮^)");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
