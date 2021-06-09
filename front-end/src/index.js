let moment = require('moment');
const { format } = require('prettier');

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

  return {
    graphState: _graphState,
    initGraphState: initGraphState,
    updateGraphState: updateGraphState,
  };
})();

// RESPONSIBLE FOR MANAGING CONNECTIONS WITH SERVER
const ClientCtrl = (function () {
  let requestRepo = () => {
    fetch("http://localhost:3000/")
    .then(response => response.text())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.log(`There is an error my good friend!! || ${error}`))
  }

  return {
    requestRepo
  }
})();


//// RESPONSIBLE FOR WATCHING AND RENDERING ELEMENTS IN THE UI
const UICtrl = (function () {
  const contributionGraph = document.getElementById("year");
  const textFieldSubmitButton = document.getElementById("text-form");
  const textField = document.getElementById("text-field");
  const scheduleList = document.getElementById("schedule-list");

  const clearGraphButton = document.getElementById("clear-button");
  const fillGraphButton = document.getElementById("fill-button");
  const generateScheduleButton = document.getElementById("generate-schedule-button");

  const normalRadioOption = document.getElementById("normal-option");
  const eraseRadioOption = document.getElementById("erase-option");
  const darkRadioOption = document.getElementById("dark-option");

  const repoRequestButton = document.getElementById("repo-request");

  // TO DO:
  // (function() {clear/init empty schedule})();
  // function renderSchedule (Schedule) {render schedule}
  // userNameInput.addeventlistener('submit', function(e){console.log(e.target.value); e.target.value = '';})
  // scheduleRequest.addeventlistener('submit', renderSchedule(Schedule))

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
    // draws schedule in UI based off schedule
    for (let Line in schedule) {
      const createdLine = document.createElement("tr");
      const createdLineDate = document.createElement("td");
      const createdLineCommits = document.createElement("td");
      createdLineDate.innerHTML = Line;
      if(schedule[Line] == 1) {
        createdLineCommits.innerHTML = `${schedule[Line]} commit`;
      } else {
        createdLineCommits.innerHTML = `${schedule[Line]} commits`;
      }
      createdLine.appendChild(createdLineDate);
      createdLine.appendChild(createdLineCommits);
      scheduleList.appendChild(createdLine);
    }
  }

  // let customTextSubmitted = (event) => {
  //   event.preventDefault();
  //   if (textField.value) {
  //     console.log(textField.value);
  //     textField.value = "";
  //   }
  // };

  // EVENT LISTENERS
  // textFieldSubmitButton.addEventListener("submit", customTextSubmitted);

  contributionGraph.addEventListener("mouseup", mouseDownUpDraw);
  contributionGraph.addEventListener("mousedown", mouseDownUpDraw);
  contributionGraph.addEventListener("mouseover", mouseOverDraw);
  contributionGraph.addEventListener("mouseleave", leftDrawArea);
  contributionGraph.addEventListener("mouseenter", enteredDrawArea);

  clearGraphButton.addEventListener("click", clearGraph);
  fillGraphButton.addEventListener("click", fillGraph);

  generateScheduleButton.addEventListener("click", () => ScheduleCtrl.createSchedule(GraphStateCtrl.graphState));

  normalRadioOption.addEventListener("click", () => drawModeSwitch(NORMAL));
  eraseRadioOption.addEventListener("click", () => drawModeSwitch(ERASE));
  darkRadioOption.addEventListener("click", () => drawModeSwitch(DARK));

  repoRequestButton.addEventListener("click", () => ClientCtrl.requestRepo());

  return {
    renderGraph: renderGraph,
    renderSchedule: renderSchedule
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
      sameDay: '[Today: ] dddd',
      nextDay: '[Tomorrow: ] dddd',
      nextWeek: '[This coming] dddd',
      sameElse: 'Do MMM YYYY'
    });
  }
  
  let createSchedule = (graphState) => {
    let _schedule = {};
    let dayOffset = 0;

    // iterate through graphState (year)
    for (let WeekID in graphState) {
      let weekArray = graphState[WeekID];

      // iterate through week's values
      weekArray.forEach(dayValue => {
        if (dayValue > 0) {
          _schedule[generateDate(dayOffset)] = dayValue
        }
        dayOffset++;
      });
    }
    
    console.log(_schedule);
    
    // call function to render schedule in UI
    UICtrl.renderSchedule(_schedule);
  }

  return {
    createSchedule: createSchedule
  }
})();
