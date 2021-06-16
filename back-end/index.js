const express = require("express");
const cors = require("cors");
const simpleGit = require("simple-git");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

const server = express();
const port = 3000;
server.use(cors({ origin: "http://localhost:8080" }));
server.use(compression());
server.use(express.json({ extended: false }));

const git = simpleGit(path.join(__dirname, "/art-project"), undefined);

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
      git.init(bare);
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
    // init git repository location
    const git = simpleGit(path.join(__dirname, "/art-project/"), undefined);
    git.init();
    git.add(["./"]);
    git.commit("first commit!!");
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
  };

  console.log(request.body);
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
  let committedDays = getCommittedDays(request.body);

  // STEP 2 - PROCESSES COMMITTEDDAYS INTO PROJECT DIRECTORY/FILES
  if (committedDays.commitsRequired) {
    response.send("Thanks!! We received your graph state (^̮^)");

    createProjectDirectory();
    createProjectArtFile(committedDays);
    zipDirectory();

    console.log("Requested project created!!")
  } else {
    response.send("Oops!! Looks like you didn't submit anything (^̮^)");
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
