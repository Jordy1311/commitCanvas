const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const simpleGit = require("simple-git");
const archiver = require("archiver");

const server = express();
const port = 3000;
server.use(cors({ origin: "http://localhost:8080" }));
server.use(express.json({ extended: false }));

server.post("/", (request, response) => {
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
    let directoryPath = path.join(__dirname, "/art-project");
    // delete existing directory
    if (directoryPath) {
      fs.rmdirSync(path.join(__dirname, "/art-project"), {
        recursive: true,
      });
    }
    // make new directory
    fs.mkdirSync(directoryPath, {}, (error) => {
      if (error) console.log("ERROR with making project directory:", error);
      git.init(bare);
      console.log("Folder created!");
    });
    // copy project readme.md
    fs.copyFileSync(
      path.join(__dirname, "/templateREADME.md"),
      path.join(directoryPath, "README.md")
    );
    // create project art-file
    fs.writeFileSync(
      path.join(directoryPath, "art-file.txt"),
      "These are your commits:\n",
      (error) => {
        if (error) console.log("ERROR creating the project art-file:", error);
      }
    );
    // init git & first commit
    const git = simpleGit(directoryPath, undefined);
    git.init();
    git.cwd({ path: directoryPath, root: true });
    git.add(["./"]);
    git.commit("first commit!!");

    // inits .git, but commits to commitCanvas repo rather than the newly made one
    // need to change working directory with .cwd but can't seem to figure out how to make it work
    // even with the examples given
  };

  let createProjectArtFile = (committedDays) => {
    let directoryPath = path.join(__dirname, "/art-project");
    // loop through committed days and write/commit when dayvalue > 0
    for (const [week, days] of Object.entries(committedDays)) {
      if (week.includes("week")) {
        days.forEach((dayValue) => {
          if (dayValue > 0) {
            fs.appendFileSync(
              directoryPath, "art-file.txt",
              `\n${week} day${
                days.indexOf(dayValue) + 1
              } : ${dayValue}`,
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

    // need to change this function so that it writes to the file what I want
    // and so that each time it writes it also commits to the correct date in the past
    // TALK TO FLO ABOUT RELATIVE DATES (dates not lining up with what GitHub shows
    // (the first cube is for day and the next for tomorrow and so on but GitHub is a glance to the past))
    // Might I almost need to different graphState generation functions that puts the dates of the cubes
    // in the future if the user is requesting a schedule but in the past, somehow, if they request a repo
    // requesting a repo also brings in the complication of whether or not something will overlap something
    // but also the darkness of the cubes seems if someone does a lot of work usually, the commitCanvas
    // will need to submit more than 1,2,3,4 times
  };

  let zipDirectory = () => {
    let output = fs.createWriteStream('target.zip');
    let archive = archiver('zip');

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', err => {
      throw err;
    });

    archive.pipe(output);

    archive.directory(path.join(__dirname, "/art-project"), true);
  
    archive.finalize();

      // TypeError [ERR_INVALID_ARG_VALUE]: The argument '
      // week1 day1 : 1' is invalid encoding. Received 'encoding'
      //     at new NodeError (node:internal/errors:329:5)
      //     at assertEncoding (node:internal/fs/utils:136:11)
      //     at getOptions (node:internal/fs/utils:311:5)
      //     at Object.appendFileSync (node:fs:1565:13)
      //     at /Users/jordan/Documents/web-dev/commitCanvas/back-end/index.js:75:16
      //     at Array.forEach (<anonymous>)
      //     at createProjectArtFile (/Users/jordan/Documents/web-dev/commitCanvas/back-end/index.js:73:14)
      //     at /Users/jordan/Documents/web-dev/commitCanvas/back-end/index.js:122:5
      //     at Layer.handle [as handle_request] (/Users/jordan/Documents/web-dev/commitCanvas/back-end/node_modules/express/lib/router/layer.js:95:5)
      //     at next (/Users/jordan/Documents/web-dev/commitCanvas/back-end/node_modules/express/lib/router/route.js:137:13)
  }

  // STEP 1 - PROCESS REQUEST BODY INTO VARIABLES
  let committedDays = getCommittedDays(request.body);
  let userEmail = request.body.email[0];
  let userUsername = request.body.username[0];

  // STEP 2 - PROCESSES COMMITTEDDAYS INTO PROJECT DIRECTORY/FILES
  if (committedDays.commitsRequired) {
    createProjectDirectory();
    createProjectArtFile(committedDays);
    zipDirectory();

    response.send("Thanks!! We received your graph state (^̮^)");
    console.log("Requested project created!!")
  } else {
    response.send("Oops!! Looks like you didn't submit anything (^̮^)");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
