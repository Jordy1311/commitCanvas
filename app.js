const contributionGraph = document.getElementById('year')
const textForm = document.getElementById('text-form')
const textField = document.getElementById('text-field')

let dayOfYear = 1

window.onload = function() {
    for(week=1; week<54; week++) {
        const createdWeek = document.createElement('div')
        createdWeek.className = `week`
        createdWeek.id = `week-${week}`
        for(day=1; day<8; day++) {
            if(dayOfYear < 367) {
                const createdDay = document.createElement('div')
                createdDay.className = 'commit-1'
                createdDay.id = `day-${dayOfYear}`
                createdWeek.appendChild(createdDay)
                dayOfYear++
            } else {}
        }
        contributionGraph.appendChild(createdWeek)
    }}

textForm.addEventListener('submit', function(e) {
    console.log(textField.value)
    e.preventDefault()
})