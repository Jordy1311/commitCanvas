//// HOLDS THE CURRENT STATE INFORMATION REGARDING THE GRAPH
const GraphStateCtrl = (function() {
  let _graphState = {};

  // METHODS TO DO
  // ON PAGE LOAD - (function() {if(localStorage.graphState = something) {load from local} else {init at 0}})
  // function drawGraphStateFromUsername(GithubUsername) {update state as graph from username}

  let initGraph = (val) => {
    for(i=1; i<=52; i++) {
      _graphState[`week${i}`] = [val, val, val, val, val, val, val];
    };
  };

  let updateState = (week, day, newVal) => {
    _graphState[week][day] = newVal;
  }

  return {
    graphState: _graphState,
    initGraph: initGraph,
    updateState: updateState
  }
})();

// remove and replace once graph state function fully developed
GraphStateCtrl.initGraph(0);

//// RESPONSIBLE FOR WATCHING AND RENDERING ELEMENTS IN THE UI
const UICtrl = (function() {
  const contributionGraph = document.getElementById("year");
  const textForm = document.getElementById("text-form");
  const textField = document.getElementById("text-field");

  const graphClearButton = document.getElementById("clear-button");
  const logGraphStateButton = document.getElementById("log-graphState");
  const drawRadioOption = document.getElementById("draw-option");
  const eraseRadioOption = document.getElementById("erase-option");
  const fullRadioOption = document.getElementById("full-option");

  // METHODS TO DO
  // (function() {clear/init empty schedule})();
  // function renderSchedule (Schedule) {render schedule}

  // inits graph
  window.onload = () => {
    drawGraph()
  }

  let drawGraph = () => {
    // deletes graph if already present
    if(contributionGraph.hasChildNodes()) {
      while(contributionGraph.firstChild) {
        contributionGraph.firstChild.remove();
      }
    }
    // draws graph in UI based off current graphState
    for(let Week in GraphStateCtrl.graphState) {
      let currentlyEvaluatedWeek = GraphStateCtrl.graphState[Week];
      const createdWeek = document.createElement("div");
      createdWeek.id = Week;
      let day = 0;
      currentlyEvaluatedWeek.forEach(dayValue => {
        const createdDay = document.createElement("div");
        createdDay.id = day;
        createdDay.className = `commit-${dayValue}`;
        createdWeek.appendChild(createdDay);
        day++
      });
      contributionGraph.appendChild(createdWeek);
    };
  }

  let graphClear = (event) => {
    event.preventDefault()
    GraphStateCtrl.initGraph(0);
    drawGraph();
  }

  // update to include change in color over time held

  let drawSwitch = true;
  let eraseSwitch = false;
  let fullSwitch = false;
  let drawOptionSwitcher = (event) => {
    let optionToTurnOn = event.target.id.replace('-option', 'Switch');
    if(optionToTurnOn === "eraseSwitch") {
      eraseSwitch = true;
      fullSwitch = false;
      drawSwitch = false;
    } else if(optionToTurnOn === "fullSwitch") {
      fullSwitch = true;
      eraseSwitch = false;
      drawSwitch = false;
    } else if(optionToTurnOn === "drawSwitch") {
      drawSwitch = true;
      eraseSwitch = false;
      fullSwitch = false;
    }
  }
  // not very nice code due to repetition but I think it is clearer in proceeding code compared to an object holding these values

  let mouseDownUpDraw = () => {
    drawHandler();
    drawEraseFull(event);
  }

  let mouseOverDraw = (event) => {
    drawEraseFull(event);
  }

  let draw = false;
  let drawHandler = () => draw = !draw;

  let drawEraseFull = (event) => {
    let currentCommitValue = parseInt(event.target.className.charAt(7));
    if(drawSwitch === true && draw === true) {
      if(event.target.className === "commit-4" && event.type === "mousedown") {
        event.target.className = "commit-0";
        updateGraphState(event);
      } else if (event.target.className.includes("commit-")) {
        if(currentCommitValue < 4) {
          event.target.className = `commit-${currentCommitValue + 1}`;
          updateGraphState(event);
        }
      };
    } else if(eraseSwitch === true && draw === true) {
      if(currentCommitValue > 0) {
        event.target.className = "commit-0";
        updateGraphState(event);
      }
    } else if(fullSwitch === true && draw === true) {
      if(currentCommitValue < 4) {
        event.target.className = "commit-4";
        updateGraphState(event);
      }
    }
  }

  let updateGraphState = (event) => {
    let weekToUpdate = event.target.parentNode.id;
    let dayToUpdate = event.target.id;
    let updatedVal = parseInt(event.target.className.charAt(7));
    GraphStateCtrl.updateState(weekToUpdate, dayToUpdate, updatedVal);
  }

  let customTextSubmitted = (event) => {
    console.log(textField.value);
    textField.value = "";
    event.preventDefault();
  };

  // EVENT LISTENERS
  textForm.addEventListener("submit", customTextSubmitted);

  contributionGraph.addEventListener("mouseup", mouseDownUpDraw);
  contributionGraph.addEventListener("mousedown", mouseDownUpDraw);
  contributionGraph.addEventListener("mouseover", mouseOverDraw);

  graphClearButton.addEventListener("click", graphClear);
  logGraphStateButton.addEventListener("click", () => console.log(GraphStateCtrl.graphState));

  drawRadioOption.addEventListener("mouseup", drawOptionSwitcher);
  eraseRadioOption.addEventListener("mouseup", drawOptionSwitcher);
  fullRadioOption.addEventListener("mouseup", drawOptionSwitcher);
  // userNameInput.addeventlistener('submit', function(e){console.log(e.target.value); e.target.value = '';})
  // scheduleRequest.addeventlistener('submit', renderSchedule(Schedule))
})();


//// RESPONSIBLE FOR GENERATING THE SCHEDULE UPON REQUEST
const ScheduleCtrl = (function() {
  // METHODS TO DO
  // function createSchedule(graphState) {creates schedule}
})();