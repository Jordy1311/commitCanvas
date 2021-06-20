const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const express = require("express");
const cors = require("cors");
const simpleGit = require("simple-git");
const moment = require("moment");

const server = express();
const port = 3000;
server.use(cors({ origin: "http://localhost:8080" }));
server.use(express.json({ extended: false }));

// TODO: later on we will investigate /tmp/ path
// solves issue commits on the commit canvas itself
const PROJECT_PATH = path.join("/tmp", "/art-project");

server.post("/", (request, response) => {
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
    };
    return committedDaysTempArray
  };

  let createProjectDirectory = () => {
    // delete existing directory
    if (PROJECT_PATH) {
      fs.rmdirSync(PROJECT_PATH, {
        recursive: true, 
        force: true
      });
    }
    // make new directory
    fs.mkdirSync(PROJECT_PATH, {}, error => {
      throw `ERROR with making project directory: ${error}`;
    });
    // copy project readme.md
    fs.copyFileSync(
      path.join(__dirname, "/templateREADME.md"),
      path.join(PROJECT_PATH, "README.md")
    );
    // create project art-file
    fs.writeFileSync(
      path.join(PROJECT_PATH, "art-file.txt"),
      "These are your commits:\n",
      error => {
        throw `ERROR creating the project art-file: ${error}`;
      }
    );
  };

  let createProjectArtFile = (committedDays, gitClient) => {
    // loop through committed days and write/commit when dayvalue > 0
    for (const [week, days] of Object.entries(committedDays)) {
      let commitDate = moment(); // TODO: initially set it to Jan 1 2017

      if (week.includes("week")) {
        // TODO: need to find what week we're in
        // commitDate.add some sort offset equivalent to that week

        days.forEach((amountCommitted, theDay) => {
          // TODO: now we have theDay
          // commitDate.add some sort offset equivalent to that day

          // at this point you'll have the final date stamp of the commits to follow
          for (i = 1; i < amountCommitted + 1; i++) {
            fs.appendFileSync(
              `${PROJECT_PATH}/art-file.txt`,
              `\n${week} day${days.indexOf(amountCommitted) + 1} commit: ${i}`,
              error => {
                throw `ERROR creating the project art-file: ${error}`;
              }
            );
            gitClient.performCommit(
              `\n${week} day${days.indexOf(amountCommitted) + 1} commit: ${i}`,
              commitDate.toString()
            );
          }
        });
      }
    }

    // so each time it writes it also commits to the correct date in the past
    // TALK TO FLO ABOUT RELATIVE DATES (dates not lining up with what GitHub shows
    // (the first cube is for day and the next for tomorrow and so on but GitHub is a glance to the past))
    //
    // Might I almost need to different graphState generation functions that puts the dates of the cubes
    // in the future if the user is requesting a schedule but in the past, somehow, if they request a repo
    // requesting a repo also brings in the complication of whether or not something will overlap something
    // but also the darkness of the cubes seems if someone does a lot of work usually, the commitCanvas
    // will need to submit more than 1,2,3,4 times

    /*
     * NOTE:
     * first approach can be simpler
     * 1. introduce choosing of year? default 2017 (far enough back)
     * 2. loop day value to simulate commit * times
     */
  };

  let zipDirectory = () => {
    let output = fs.createWriteStream(path.join(PROJECT_PATH, "target.zip"));
    let archive = archiver("zip");

    archive.directory(PROJECT_PATH, true);

    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    archive.on("error", error => {
      throw `failed to archive project: ${error}`;
    });

    archive.pipe(output);

    archive.finalize();
  };

  //// STEP 1 - PROCESS REQUEST BODY INTO VARIABLES
  let committedDays = getCommittedDays(request.body);
  let userEmail = request.body.email[0];
  let userUsername = request.body.username[0];

  let git = new GitClient(userEmail, userUsername);

  //// STEP 2 - PROCESSES COMMITTEDDAYS INTO PROJECT DIRECTORY/FILES
  if (committedDays.commitsRequired) {
    createProjectDirectory();
    git.init();

    createProjectArtFile(committedDays, git);

    zipDirectory();
    
    response.sendFile(path.join(PROJECT_PATH, "target.zip"), error => {
      console.log(`ERROR sending zip-file: ${error}`);
    });
    console.log("Requested project created!!");
  } else {
    response.send("Oops!! Looks like you didn't submit anything (^̮^)");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

class GitClient {
  constructor(email, username) {
    this.email = email;
    this.username = username;

    const options = { 
      baseDir: PROJECT_PATH,
      binary: 'git',
    };

    this.gitClient = simpleGit(options);
    this.gitClient.addConfig("user.email", this.email).addConfig("user.name", this.username);
  }
  
  async init() {
    await this.gitClient.init();
  };

  async performCommit(message, date) {
    await this.gitClient
      .add(`${PROJECT_PATH}/./*`)
      .commit(message, { "--date": date });
    };
  };

// TODO: investigate why I couldn't just do `GitClient.performCommit()`
