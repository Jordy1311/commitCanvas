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

server.post("/", async (request, response) => {
  let generateDate = offset => {
    let date = moment("2020-01-05T09").utc();
    if (offset > 0) {
      date.add(offset, "days");
    }
    return date.toString()
  };

  let getCommittedDays = graphState => {
    let dayOffset = 0;
    let committedDaysTempArray = {
      commitsRequired: false,
    };

    for ([weekName, daysArray] of Object.entries(graphState))  {
      daysArray.forEach(dayValue => {
        dayOffset++;
        if (dayValue > 0) {
          committedDaysTempArray.commitsRequired = true;
          if (committedDaysTempArray[weekName]) {
            // for loop at dayValue.length
            for (i=0; i<dayValue; i++) {
              committedDaysTempArray[weekName].push(generateDate(dayOffset));
            }
          } else {
            committedDaysTempArray[weekName] = [];
            for (i=0; i<dayValue; i++) {
              committedDaysTempArray[weekName].push(generateDate(dayOffset));
            }
          }
        }
      });
    }

    // please remove me once all done
    console.log(committedDaysTempArray);
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

  let commitProjectArtFile = async (committedDays, gitClient) => {
    for ([weekName, datesArray] of Object.entries(committedDays)) {
      if (weekName.includes("week")) {

        for (i=0; i<datesArray.length; i++) {
          fs.appendFileSync(
            `${PROJECT_PATH}/art-file.txt`,
            `${datesArray[i]}\n`,
            error => {
              throw `ERROR creating the project art-file: ${error}`;
            }
          );
          await gitClient.performCommit(
            "Brush stroke!",
            datesArray[i]
          );
        }
      }
    }
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

  
  //// STEP 2 - PROCESSES COMMITTEDDAYS INTO PROJECT DIRECTORY/FILES
  
  if (committedDays.commitsRequired) {
    createProjectDirectory();
    
    let git = new GitClient(userEmail, userUsername);

    await git.init();

    await commitProjectArtFile(committedDays, git);

    // zipDirectory();
    
    // response.sendFile(path.join(PROJECT_PATH, "target.zip"), error => {
    //   console.log(`ERROR sending zip-file: ${error}`);
    // });
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
