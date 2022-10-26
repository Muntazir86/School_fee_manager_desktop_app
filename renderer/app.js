const{ ipcRenderer }= require('electron')
const db = require('./../manageDB')

const total_card = document.getElementById('total_card'),
      paid_card = document.getElementById('paid_card'),
      unpaid_card = document.getElementById('unpaid_card');  


// update status when month changed      

let date_obj = new Date()
let month = date_obj.getMonth() + 1
if (month != localStorage.getItem('month-data')) {
    db.updateStatus('student_data')
    localStorage.setItem('month-data', month) 
    console.log('month changed')   
}



total_card.addEventListener('click', e=>{
    ipcRenderer.send('clicked-card', 'total_card')
})

paid_card.addEventListener('click', e=>{
    ipcRenderer.send('clicked-card', 'paid_card')
})

unpaid_card.addEventListener('click', e=>{
    ipcRenderer.send('clicked-card', 'unpaid_card')
})

ipcRenderer.invoke('get-userdata-path').then(userPath =>{
    // console.log(userPath)
    db.count('student_data', userPath)
    document.getElementById('total').innerText = db.total_student 
    document.getElementById('paid').innerText = db.paid_student
    document.getElementById('unpaid').innerText = db.total_student - db.paid_student
})

