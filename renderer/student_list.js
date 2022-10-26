const { ipcRenderer } = require('electron')
const db = require('electron-db');
const itemJS = require('./item')

const no_item = document.getElementById('no-items')

ipcRenderer.invoke('get-card-clicked').then(card=>{

  if (card === 'total_card') {
    
    db.getAll('student_data', (succ, data) => {
      // console.log('getting all data...')
      if(succ){
        if(data.length != 0) no_item.style.display = 'none'
        // console.log(data)
        // console.log('success ...')
        for (const i in data) {
            itemJS.addItem(data[i])
        }
      }
      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    })  
  }
  else if (card === 'paid_card') {
    
    db.search('student_data', 'status', true, (succ, data) => {
      
      if (succ) {
        if(data.length != 0) no_item.style.display = 'none'
        for (const i in data) {
          itemJS.addItem(data[i])
      }
      }
    });
  }
  else if (card === 'unpaid_card') {
    // console.log('unpaid card clicked')
    db.search('student_data', 'status', false, (succ, data) => {
      
      if (succ) {
        if(data.length != 0) no_item.style.display = 'none'
        for (const i in data) {
          itemJS.addItem(data[i])
      }
      }
    });
  }

})


// search items
search.addEventListener('keyup', e=>{
    Array.from( document.getElementsByClassName('list-item')).forEach( item=>{
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
    document.getElementById('no-items').style.display = 'none'
})

