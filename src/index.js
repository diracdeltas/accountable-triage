'use strict'
const lib = require('./lib')

window.onload = () => {
  const e = {
    ids: document.getElementById('ids'),
    submit: document.getElementById('submit'),
    addRow: document.getElementById('addRow'),
    date: document.getElementById('date'),
    results: document.getElementById('results')
  }

  e.submit.onclick = () => {
    const dateInput = document.getElementById('dateInput')
    const day = dateInput ? dateInput.value : lib.getDate()
    if (!day) {
      window.alert('Please enter a valid date.')
      return
    }
    e.results.innerHTML = ''
    e.results.style.display = 'none'
    const array = []
    const inputs = ids.querySelectorAll('input')
    inputs.forEach((input) => {
      array.push(input.value)
    })
    const result = lib.permuteIDs(array, day)
    result.forEach((item) => {
      const li = document.createElement('li')
      li.innerText = item
      e.results.appendChild(li)
    })
    e.results.style.display = 'block'
    if (e.date) {
      e.date.innerText = `Results generated on: ${day} UTC`
    }
  }

  e.addRow.onclick = () => {
    const li = document.createElement('li')
    const input = document.createElement('input')
    input.type = 'text'
    li.appendChild(input)
    e.ids.appendChild(li)
  }
}
