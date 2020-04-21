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
    const tzInput = document.getElementById('tzInput')
    const d = new Date()
    const day = dateInput ? dateInput.value : lib.getDate(d)
    const tzCode = tzInput ? tzInput.value : lib.getTZCode(d)
    if (!day) {
      window.alert('Please enter a valid date.')
      return
    }
    if (!tzCode) {
      window.alert('Please enter a valid time zone.')
      return
    }
    e.results.innerHTML = ''
    e.resultsContainer.style.display = 'none'
    const array = []
    const inputs = ids.querySelectorAll('input')
    inputs.forEach((input) => {
      array.push(input.value)
    })
    lib.permuteIDs(array, day, tzCode).then((result) => {
      result.forEach((item) => {
        const li = document.createElement('li')
        li.innerText = item
        e.results.appendChild(li)
      })
      e.resultsContainer.style.display = 'block'
      if (e.date) {
        e.date.innerHTML = `Results generated on: <br> <b>${d.toString()}</b>. <p style="color:red"><b>For verification purposes, this date and time zone MUST match the time and place at which the lottery was run.</b></p>`
        generatePDF(day)
      }
    }).catch((e) => {
      console.log(e)
      alert('Error getting results.')
    })
  }

  e.addRow.onclick = () => {
    const li = document.createElement('li')
    const input = document.createElement('input')
    input.type = 'text'
    li.appendChild(input)
    e.ids.appendChild(li)
  }
}
