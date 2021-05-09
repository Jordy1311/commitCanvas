/* 
MODULES:
UICONTROLLER (expose f that change UI):
	Initialise methods:
    clear schedule
	Event Listening:
    get customText input and clear field on submission
    get username input and clear field on submission
    listen for graph clicks
    listen for schedule request click
	Rendering methods:
    render schedule based on GenSchedule
    render graph based on graph state
GRAPHSTATECONTROLLER:
	pull state from storage
	init at 0
	draw state down from username GHAPI
SCHEDULECONTROLLER:
	take graphState and create schedule that creates graph 	on GH
*/

/* BASIC STRUCTURE
  (function() {
    // Declear private vars & functions
    return {
      // Declear public vars & functions
    }
  })();
*/

const UIController = (function() {
  console.log('UIController loaded!');
})();

const GraphStateController = (function() {
  console.log('GraphStateController loaded!');
})();

const ScheduleController = (function() {
  console.log('ScheduleController loaded!');
})();

// const contributionGraph = document.getElementById("year");
// const textForm = document.getElementById("text-form");
// const textField = document.getElementById("text-field");

// let dayOfYear = 1;
// let commitGraphState = {};

// window.onload = function () {
//   for (week = 1; week < 54; week++) {
//     // CREATE WEEK DIV AND ID
//     const createdWeek = document.createElement("div");
//     createdWeek.className = `week`;
//     createdWeek.id = `week-${week}`;

//     for (day = 1; day < 8; day++) {
//       if (dayOfYear < 367) {
//         // CREATE DAYS * 366 (discussion point/required development) AND ID
//         const createdDay = document.createElement("div");
//         createdDay.className = "commit-0";
//         createdDay.id = `day-${dayOfYear}`;

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
//     contributionGraph.appendChild(createdWeek);

//     // CREATE WEEK EVENT LISTENER
//     document
//       .getElementById(`week-${week}`)
//       .addEventListener("click", weekClick);
//   }
// };

// textForm.addEventListener("submit", function (e) {
//   console.log(textField.value);
//   e.target.children[0].children[1].value = "";
//   // input - function that takes letter and inputs it to the commitGraphState and the cubes
//   // input - function that creates the schedule output
//   e.preventDefault();
// });

// function weekClick(e) {
//   if (e.target.id.includes("day")) {
//     e.target.className = "commit-2";
//   } else {
//   }
// }