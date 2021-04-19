const contributionGraph = document.getElementById('year')
const textForm = document.getElementById('text-form')
const textField = document.getElementById('text-field')

let dayOfYear = 1
let commitGraphState = {}

window.onload = function() {
    for(week=1; week<54; week++) {
        // create week div and id
        const createdWeek = document.createElement('div')
        createdWeek.className = `week`
        createdWeek.id = `week-${week}`

        for(day=1; day<8; day++) {
            if(dayOfYear < 367) {
                // create days * 366 (discussion point/required development) and id
                const createdDay = document.createElement('div')
                createdDay.className = 'commit-0'
                createdDay.id = `day-${dayOfYear}`

                // recording commitGraphState
                if(commitGraphState[`week-${week}`] === undefined) {
                    switch(createdDay.className){
                        case 'commit-0': commitGraphState[`week-${week}`] = [0];
                        break;
                        case 'commit-1': commitGraphState[`week-${week}`] = [1];
                        break;
                        case 'commit-2': commitGraphState[`week-${week}`] = [2];
                        break;
                        case 'commit-3': commitGraphState[`week-${week}`] = [3];
                        break;
                        case 'commit-4': commitGraphState[`week-${week}`] = [4];
                        break;
                    }} else {
                        switch(createdDay.className){
                            case 'commit-0': commitGraphState[`week-${week}`].push(0);
                            break;
                            case 'commit-1': commitGraphState[`week-${week}`].push(1);
                            break;
                            case 'commit-2': commitGraphState[`week-${week}`].push(2);
                            break;
                            case 'commit-3': commitGraphState[`week-${week}`].push(3);
                            break;
                            case 'commit-4': commitGraphState[`week-${week}`].push(4);
                            break;
                    }}

                // append day to week
                createdWeek.appendChild(createdDay)
                
                // increase count of year for id-ing days
                dayOfYear++
            } else {}
        }
        // append week to graph
        contributionGraph.appendChild(createdWeek)

        // create week event listener
        document.getElementById(`week-${week}`).addEventListener('click', weekClick)
    }}

textForm.addEventListener('submit', function(e) {
    console.log(textField.value)
    e.preventDefault()
})

function weekClick(e) {
    if(e.target.id.includes('day')) {
        e.target.className = 'commit-2'
    }
}