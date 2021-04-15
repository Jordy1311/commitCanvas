const contributionGraph = document.getElementById('year')
const textForm = document.getElementById('text-form')
const textField = document.getElementById('text-field')

window .onload = function() {
    for(i=0; i<53; i++) {
        const week = document.createElement('div')
        week.className = 'week'
        week.innerHTML = '<div class="commit-1"></div><div class="commit-1"></div><div class="commit-1"></div><div class="commit-1"></div><div class="commit-1"></div><div class="commit-1"></div><div class="commit-1"></div>'
        week.addEventListener('click', function() {console.log(`${week[i]} says: Ouch!!`)})
        contributionGraph.appendChild(week)
    }}

textForm.addEventListener('submit', function(e) {
    console.log(textField.value)
    e.preventDefault()
})