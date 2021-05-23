// THIS MODULE HOLDS THE CURRENT STATE INFORMATION REGARDING THE GRAPH
const GraphStateCtrl = (function() {
  let _graphState = {};

  // METHODS
  // ON PAGE LOAD - (function() {if(localStorage.graphState = something) {load from local} else {init at 0}})
  let initGraph = (val) => {
    for(i=1; i<=52; i++) {
      _graphState[`week${i}`] = [val, val, val, val, val, val, val];
    };
    console.log(`graph initiated at ${val}:`, _graphState);
  };

  

  // INIT function updateGraphState(target) {update the target cube value in GraphState to new value}
  // INIT function drawGraphStateFromUsername(GithubUsername) {update state as graph from username}

  return {
    graphState: _graphState,
    initGraph: initGraph
  }
})();

GraphStateCtrl.initGraph(0);


// THIS MODULE IS RESPONSIBLE FOR WATCHING AND RENDERING ELEMENTS IN THE UI
const UICtrl = (function() {
  const contributionGraph = document.getElementById("year");
  const textForm = document.getElementById("text-form");
  const textField = document.getElementById("text-field");

  // inits graph
  window.onload = () => {
    for(let currentWeek in GraphStateCtrl.graphState) {
      let currentlyEvaluatedWeek = GraphStateCtrl.graphState[currentWeek];
      // create week div
      const createdWeek = document.createElement("div");

      currentlyEvaluatedWeek.forEach(dayValue => {
        console.log(`day has the value of ${dayValue}`);
        // create day div
        const createdDay = document.createElement("div");
        // asign classname
        createdDay.className = `commit-${dayValue}`;
        // attach day div to week
        createdWeek.appendChild(createdDay);
      });
      // attach week to contributionGraph
      contributionGraph.appendChild(createdWeek);
    };
  }

  let weekClick = (event) => {
    className = event.target.className;
    if (event.target.id.includes("day")) {
      className = "commit-2";
      if(className == "commit-6") {
        className = "commit-0";
      }
    }
  }

  let customTextSubmitted = (event) => {
    console.log(textField.value);
    textField.value = "";
    event.preventDefault();
  }

  // METHODS
  // ON PAGE LOAD - (function() {clear/init empty schedule})();
  // INIT function renderGraph (GraphState) {render graph}
  // INIT function renderSchedule (Schedule) {render schedule}

  // EVENT LISTENERS
  textForm.addEventListener("submit", customTextSubmitted);
  // dayCube event listener
  // document.getElementById(`week-${week}`).addEventListener("click", weekClick);
  // userNameInput.addeventlistener('submit', function(e){console.log(e.target.value); e.target.value = '';})
  // scheduleRequest.addeventlistener('submit', renderSchedule(Schedule))
})();


// THIS MODULE IS RESPONSIBLE FOR GENERATING THE SCHEDULE UPON REQUEST
const ScheduleCtrl = (function() {
  // METHODS
  // INIT function createSchedule(graphState) {creates schedule}
})();



// OLD STUFF - MIGRATE TO MODULES AND MAKE BETTER
// let dayOfYear = 1;
// let commitGraphState = {};

// window.onload = function () {

//     for (day = 1; day < 8; day++) {
//       if (dayOfYear < 367) {
//         // CREATE DAYS * 366 (discussion point/required development) AND ID
//         const createdDay = document.createElement("div");
//         createdDay.className = "commit-0";


//         // RECORDING COMMITGRAPHSTATE
//         if (commitGraphState[`week-${week}`] === undefined) {
//           switch (createdDay.className) {
//             case "commit-0":
//               commitGraphState[`week-${week}`] = [0];
//               break;
//             case "commit-1":
//               commitGraphState[`week-${week}`] = [1];
//               break;
//             case "commit-2":
//               commitGraphState[`week-${week}`] = [2];
//               break;
//             case "commit-3":
//               commitGraphState[`week-${week}`] = [3];
//               break;
//             case "commit-4":
//               commitGraphState[`week-${week}`] = [4];
//               break;
//           }
//         } else {
//           switch (createdDay.className) {
//             case "commit-0":
//               commitGraphState[`week-${week}`].push(0);
//               break;
//             case "commit-1":
//               commitGraphState[`week-${week}`].push(1);
//               break;
//             case "commit-2":
//               commitGraphState[`week-${week}`].push(2);
//               break;
//             case "commit-3":
//               commitGraphState[`week-${week}`].push(3);
//               break;
//             case "commit-4":
//               commitGraphState[`week-${week}`].push(4);
//               break;
//           }
//         }

//         // APPEND DAY TO WEEK
//         createdWeek.appendChild(createdDay);

//         // INCREASE COUNT OF YEAR FOR ID-ING DAYS
//         dayOfYear++;
//       } else {
//       }
//     }
//     // APPEND WEEK TO GRAPH
//     