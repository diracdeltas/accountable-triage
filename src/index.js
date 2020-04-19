'use strict'
const lib = require('./lib')
const { jsPDF } = require('jspdf')

window.onload = () => {
  const e = {
    ids: document.getElementById('ids'),
    submit: document.getElementById('submit'),
    addRow: document.getElementById('addRow'),
    date: document.getElementById('date'),
    resultsContainer: document.getElementById('resultsContainer'),
    results: document.getElementById('results')
  }

  const generatePDF = (day) => {
    var pdf = new jsPDF('p', 'pt', 'a4')
    pdf.html(e.resultsContainer, {
      html2canvas: {
        scale: 0.9
      },
      callback: (doc) => {
        doc.save(`lottery-${day}.pdf`)
      }
    })
  }

  e.submit.onclick = () => {
    const dateInput = document.getElementById('dateInput')
    const d = new Date()
    const day = dateInput ? dateInput.value : lib.getDate(d)
    if (!day) {
      window.alert('Please enter a valid date.')
      return
    }
    e.results.innerHTML = ''
    e.resultsContainer.style.display = 'none'
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
    e.resultsContainer.style.display = 'block'
    if (e.date) {
      e.date.innerText = `Results generated on: ${d.toString()}`
      generatePDF(day)
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
