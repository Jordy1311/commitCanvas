let moment = require("moment");

window.onload = () => {
  // remove and replace initGraphState once graph state function fully developed
  GraphStateCtrl.initGraphState(0);
  UICtrl.renderGraph();
};

//// HOLDS THE CURRENT STATE INFORMATION REGARDING THE GRAPH
const GraphStateCtrl = (function () {
  let _graphState = {};

  // TO DO:
  // ON PAGE LOAD - (function() {if(localStorage.graphState = something) {load from local} else {init at 0}})
  // function renderGraphStateFromUsername(GithubUsername) {update state as graph from username}

  let initGraphState = (val) => {
    for (i = 1; i <= 52; i++) {
      _graphState[`week${i}`] = [val, val, val, val, val, val, val];
    }
  };

  let updateGraphState = (week, day, newVal) => {
    _graphState[week][day] = newVal;
  };

  let inputUserInfo = (email, username) => {
    _graphState["email"] = email;
    _graphState["username"] = username;
  }

  return {
    graphState: _graphState,
    initGraphState,
    updateGraphState,
    inputUserInfo
  };
})();

// RESPONSIBLE FOR MANAGING CONNECTIONS WITH SERVER
const ClientCtrl = (function () {
  let requestRepo = (data) => {
    fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Something went wrong!! ||", error);
      });
  };

  return {
    requestRepo,
  };
})();

//// RESPONSIBLE FOR WATCHING AND RENDERING ELEMENTS IN THE UI
const UICtrl = (function () {
  const helpButton = document.getElementById("help-button");
  const siteInstructions = document.getElementById("site-instructions-group");

  const contributionGraph = document.getElementById("year");
  
  const clearGraphButton = document.getElementById("clear-button");
  const normalRadioOption = document.getElementById("normal-option");
  const eraseRadioOption = document.getElementById("erase-option");
  const darkRadioOption = document.getElementById("dark-option");
  const fillGraphButton = document.getElementById("fill-button");
  
  const downloadGitButton = document.getElementById("repo-request");
  const generateScheduleButton = document.getElementById(
    "generate-schedule-button"
  );
  
  const scheduleTable = document.getElementById("schedule-table");
  const scheduleList = document.getElementById("schedule-list");
  const userInfoForm = document.getElementById("user-info-form");

  const confirmDownloadButton = document.getElementById("download-repo");

  const emailField = document.getElementById("user-email-field");
  const usernameField = document.getElementById("user-username-field");
    
  // FUNCTIONS:
  let hideShowHelp = () => {
    if (siteInstructions.style.display !== "flex") {
      siteInstructions.style.display = "flex";
    } else {
      siteInstructions.style.display = "none";
    };
  };

  let showElement = (element, value) => element.style.display = `${value}`
  let hideElement = element => element.style.display = "none"

  let renderGraph = () => {
    // deletes graph if already present
    if (contributionGraph.hasChildNodes()) {
      while (contributionGraph.firstChild) {
        contributionGraph.firstChild.remove();
      }
    }
    // draws graph in UI based off current graphState
    for (let Week in GraphStateCtrl.graphState) {
      let currentlyEvaluatedWeek = GraphStateCtrl.graphState[Week];
      const createdWeek = document.createElement("div");
      createdWeek.id = Week;
      let day = 0;
      currentlyEvaluatedWeek.forEach((dayValue) => {
        const createdDay = document.createElement("div");
        createdDay.id = day;
        createdDay.className = `commit-${dayValue}`;
        createdWeek.appendChild(createdDay);
        day++;
      });
      contributionGraph.appendChild(createdWeek);
    }
  };

  let clearGraph = (event) => {
    event.preventDefault();
    GraphStateCtrl.initGraphState(0);
    renderGraph();
  };

  let fillGraph = (event) => {
    event.preventDefault();
    GraphStateCtrl.initGraphState(4);
    renderGraph();
  };

  // drawMode switch
  const NORMAL = "normal",
    ERASE = "erase",
    DARK = "dark";
  let drawMode = NORMAL;
  let drawModeSwitch = (newDrawMode) => {
    drawMode = newDrawMode;
  };
  // isDrawing switch
  let isDrawing = false;
  let isDrawingSwitch = () => (isDrawing = !isDrawing);

  // draw behaviour functions
  let mouseDownUpDraw = (event) => {
    isDrawingSwitch();
    draw(event);
  };
  let mouseOverDraw = (event) => {
    draw(event);
  };
  let leftDrawArea = () => {
    isDrawing = false;
  };
  let enteredDrawArea = (event) => {
    // if statement required to check if left-mouse is being clicked
    if (event.buttons === 1) {
      isDrawing = true;
    }
  };

  let draw = (event) => {
    const cubeFillValue = parseInt(event.target.className.charAt(7));
    if (isDrawing && drawMode === NORMAL) {
      if (cubeFillValue === "4" && event.type === "mousedown") {
        event.target.className = "commit-0";
        updateGraphState(event);
      } else if (event.target.className.includes("commit-")) {
        if (cubeFillValue < 4) {
          event.target.className = `commit-${cubeFillValue + 1}`;
          updateGraphState(event);
        }
      }
    } else if (isDrawing && drawMode === ERASE) {
      if (cubeFillValue > 0) {
        event.target.className = "commit-0";
        updateGraphState(event);
      }
    } else if (isDrawing && drawMode === DARK) {
      if (cubeFillValue < 4) {
        event.target.className = "commit-4";
        updateGraphState(event);
      }
    }
  };

  let updateGraphState = (event) => {
    let weekToUpdate = event.target.parentNode.id;
    let dayToUpdate = event.target.id;
    let updatedVal = parseInt(event.target.className.charAt(7));
    GraphStateCtrl.updateGraphState(weekToUpdate, dayToUpdate, updatedVal);
  };

  let renderSchedule = (schedule) => {
    // deletes schedule if already present
    if (scheduleList.hasChildNodes()) {
      while (scheduleList.firstChild) {
        scheduleList.firstChild.remove();
      }
    }
    if (Object.keys(schedule).length === 0) {
      const createdLine = document.createElement("tr");
      const createdLineDate = document.createElement("td");
      const createdLineCommits = document.createElement("td");
      createdLineDate.innerHTML = "No dates!!";
      createdLineCommits.innerHTML = "No commits!!";
      createdLine.appendChild(createdLineDate);
      createdLine.appendChild(createdLineCommits);
      scheduleList.appendChild(createdLine);
    } else {
      // draws schedule in UI based off schedule
      for (let Line in schedule) {
        const createdLine = document.createElement("tr");
        const createdLineDate = document.createElement("td");
        const createdLineCommits = document.createElement("td");
        createdLineDate.innerHTML = Line;
        if (schedule[Line] == 1) {
          createdLineCommits.innerHTML = `${schedule[Line]} commit`;
        } else {
          createdLineCommits.innerHTML = `${schedule[Line]} commits`;
        }
        createdLine.appendChild(createdLineDate);
        createdLine.appendChild(createdLineCommits);
        scheduleList.appendChild(createdLine);
      };
    };
  };

  let downloadGitRepo = (event) => {
    event.preventDefault();

    let userEmail = emailField.value;
    let userUsername = usernameField.value;
    GraphStateCtrl.inputUserInfo(userEmail, userUsername);

    ClientCtrl.requestRepo(GraphStateCtrl.graphState)
  }

  // EVENT LISTENERS
  helpButton.addEventListener("click", hideShowHelp);

  contributionGraph.addEventListener("mouseup", mouseDownUpDraw);
  contributionGraph.addEventListener("mousedown", mouseDownUpDraw);
  contributionGraph.addEventListener("mouseover", mouseOverDraw);
  contributionGraph.addEventListener("mouseleave", leftDrawArea);
  contributionGraph.addEventListener("mouseenter", enteredDrawArea);
  
  clearGraphButton.addEventListener("click", clearGraph);
  normalRadioOption.addEventListener("click", () => drawModeSwitch(NORMAL));
  eraseRadioOption.addEventListener("click", () => drawModeSwitch(ERASE));
  darkRadioOption.addEventListener("click", () => drawModeSwitch(DARK));
  fillGraphButton.addEventListener("click", fillGraph);
  
  downloadGitButton.addEventListener("click", (event) => {
    event.preventDefault();
    hideElement(scheduleTable);
    showElement(userInfoForm, "block");
  });
  generateScheduleButton.addEventListener("click", (event) => {
    event.preventDefault();
    hideElement(userInfoForm);
    showElement(scheduleTable, "table");
    ScheduleCtrl.createSchedule(GraphStateCtrl.graphState);
  });

  confirmDownloadButton.addEventListener("click", downloadGitRepo);

  return {
    renderGraph,
    renderSchedule
  };
})();

//// RESPONSIBLE FOR GENERATING THE SCHEDULE UPON REQUEST
const ScheduleCtrl = (function () {
  let _schedule = {};

  let generateDate = (offset) => {
    let date = moment();
    if (offset > 0) {
      date.add(offset, "days");
    }
    return date.calendar(null, {
      sameDay: "[Today: ] dddd",
      nextDay: "[Tomorrow: ] dddd",
      nextWeek: "[This coming] dddd",
      sameElse: "Do MMM YYYY",
    });
  };

  let createSchedule = (graphState) => {
    let _schedule = {};
    let dayOffset = 0;

    // iterate through graphState (year)
    for (let WeekID in graphState) {
      let weekArray = graphState[WeekID];

      // iterate through week's values
      weekArray.forEach((dayValue) => {
        if (dayValue > 0) {
          _schedule[generateDate(dayOffset)] = dayValue;
        }
        dayOffset++;
      });
    }

    if (dayOffset !== 0) {
      UICtrl.renderSchedule(_schedule);
    } else {

    }
  };

  return {
    createSchedule
  };
})();
