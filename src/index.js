window.onload = () => {
  // remove and replace initGraphState once graph state function fully developed
  GraphStateCtrl.initGraphState(0);
  UICtrl.renderGraph()
}

//// HOLDS THE CURRENT STATE INFORMATION REGARDING THE GRAPH
const GraphStateCtrl = (function() {
  let _graphState = {};

  // TO DO:
  // ON PAGE LOAD - (function() {if(localStorage.graphState = something) {load from local} else {init at 0}})
  // function renderGraphStateFromUsername(GithubUsername) {update state as graph from username}

  let initGraphState = (val) => {
    for(i=1; i<=52; i++) {
      _graphState[`week${i}`] = [val, val, val, val, val, val, val];
    };
  };

  let updateGraphState = (week, day, newVal) => {
    _graphState[week][day] = newVal;
  }

  return {
    graphState: _graphState,
    initGraphState: initGraphState,
    updateGraphState: updateGraphState
  }
})();


//// RESPONSIBLE FOR WATCHING AND RENDERING ELEMENTS IN THE UI
const UICtrl = (function() {
  const contributionGraph = document.getElementById("year");
  const textForm = document.getElementById("text-form");
  const textField = document.getElementById("text-field");

  const clearGraphButton = document.getElementById("clear-button");
  const fillGraphButton = document.getElementById("fill-button");
  const logGraphStateButton = document.getElementById("log-graphState");

  const normalRadioOption = document.getElementById("normal-option");
  const eraseRadioOption = document.getElementById("erase-option");
  const darkRadioOption = document.getElementById("dark-option");


  // TO DO:
  // (function() {clear/init empty schedule})();
  // function renderSchedule (Schedule) {render schedule}
  // userNameInput.addeventlistener('submit', function(e){console.log(e.target.value); e.target.value = '';})
  // scheduleRequest.addeventlistener('submit', renderSchedule(Schedule))

  let renderGraph = () => {
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

  let clearGraph = (event) => {
    event.preventDefault()
    GraphStateCtrl.initGraphState(0);
    renderGraph();
  }

  let fillGraph = (event) => {
    event.preventDefault()
    GraphStateCtrl.initGraphState(4);
    renderGraph();
  }

  // update to include change in color over time held
  const NORMAL = "normal", ERASE = "erase", DARK = "dark";
  let drawMode = NORMAL;
  let drawModeSwitch = (newDrawMode) => {
    drawMode = newDrawMode;
  }

  let isDrawing = false;
  let isDrawingSwitch = () => isDrawing = !isDrawing

  let mouseDownUpDraw = (event) => {
    isDrawingSwitch();
    draw(event);
  }
  let mouseOverDraw = (event) => {
    draw(event);
  }
  let leftDrawArea = () => {
    isDrawing = false;
  }
  let enteredDrawArea = (event) => {
    // if statement required to check if left-mouse is being clicked
    if(event.buttons === 1) {
      isDrawing = true;
    }
  }

  let draw = (event) => {
    let currentCommitValue = parseInt(event.target.className.charAt(7));
    if(isDrawing && drawMode === NORMAL) {
      if(currentCommitValue === "4" && event.type === "mousedown") {
        event.target.className = "commit-0";
        updateGraphState(event);
      } else if (event.target.className.includes("commit-")) {
        if(currentCommitValue < 4) {
          event.target.className = `commit-${currentCommitValue + 1}`;
          updateGraphState(event);
        }
      };
    } else if(isDrawing && drawMode === ERASE) {
      if(currentCommitValue > 0) {
        event.target.className = "commit-0";
        updateGraphState(event);
      }
    } else if(isDrawing && drawMode === DARK) {
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
    GraphStateCtrl.updateGraphState(weekToUpdate, dayToUpdate, updatedVal);
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
  contributionGraph.addEventListener("mouseleave", leftDrawArea);
  contributionGraph.addEventListener("mouseenter", enteredDrawArea);

  clearGraphButton.addEventListener("click", clearGraph);
  fillGraphButton.addEventListener("click", fillGraph);
  logGraphStateButton.addEventListener("click", () => console.log(GraphStateCtrl.graphState));
  
  normalRadioOption.addEventListener("click", () => drawModeSwitch(NORMAL));
  eraseRadioOption.addEventListener("click", () => drawModeSwitch(ERASE));
  darkRadioOption.addEventListener("click", () => drawModeSwitch(DARK));

  return {
    renderGraph: renderGraph
  }
})();


//// RESPONSIBLE FOR GENERATING THE SCHEDULE UPON REQUEST
const ScheduleCtrl = (function() {
  // TO DO:
  // function createSchedule(graphState) {creates schedule}
})();