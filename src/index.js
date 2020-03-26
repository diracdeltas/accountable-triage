'use strict'
const lib = require('./lib')

window.onload = () => {
  const elements = {
    ids: document.getElementById('ids'),
    submit: document.getElementById('submit'),
    addRow: document.getElementById('addRow'),
    results: document.getElementById('results')
  }

  elements.submit.onclick = () => {
    results.innerHTML = ''
    results.style.display = 'none'
    const array = []
    const inputs = ids.querySelectorAll('input')
    inputs.forEach((input) => {
      array.push(input.value)
    })
    const result = lib.permuteIDs(array)
    result.forEach((item) => {
      const li = document.createElement('li')
      li.innerText = item
      results.appendChild(li)
    })
    results.style.display = 'block'
  }

  elements.addRow.onclick = () => {
    const li = document.createElement('li')
    const input = document.createElement('input')
    input.type = 'text'
    li.appendChild(input)
    elements.ids.appendChild(li)
  }
}
