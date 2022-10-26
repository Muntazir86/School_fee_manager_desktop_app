const db = require('electron-db')
const no_item = document.getElementById('no-items')
const {ipcRenderer} = require('electron')



function addItem(item) {
    // create a new DOM
    let itemNode = document.createElement('div')
    
    // Assign list-item class
    itemNode.setAttribute('class', 'list-item')

    // add inner HTML
    itemNode.innerHTML = `<img src = "${item.picture}">
    <div id="student_info">
    <b>${item.name}</b>
    <h4>Class: ${item.s_class}</h4>
    </div>
    <div id="fee">
    <b>Total: ${item.total_dues}</b>
    <h4> Paid: ${item.paid_dues}</h4>
    </div>
    <div class="date">
    <b>Date</b>
    <h4>${item.date}</h4>
    </div>`

    items.appendChild(itemNode)

    itemNode.addEventListener('click', e=>{
      ipcRenderer.send('change-file', item, true)
  })

}


db.getAll('history', (succ, data) => {
    // console.log('getting history data...')
    if(succ){
      if (data.length != 0) no_item.style.display = 'none'  
      data.reverse()
      for (const i in data) {
          addItem(data[i])
      }
    }
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  })