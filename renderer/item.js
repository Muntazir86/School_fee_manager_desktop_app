const {ipcRenderer } = require("electron");
const {getCurrentWindow} = require('electron').remote
const db = require('./../manageDB')

const items = document.getElementById('items'),
      no_items = document.getElementById('no-item');


exports.item_local;
// Add item 
exports.addItem = (item) => {
    this.item_local = item;
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
    </div>`

    items.appendChild(itemNode)

    itemNode.addEventListener('click', e=>{
        ipcRenderer.send('change-file', item, false)
    })

    // itemNode.addEventListener('mouseup', e=>{
    //     console.log()
    // })

    itemNode.addEventListener('contextmenu', e=>{
        ipcRenderer.send('show-context-menu', item)
    })

}

ipcRenderer.on('context-menu-open', e=>{
    ipcRenderer.send('change-file', '', false)
})

ipcRenderer.on('context-menu-delete', e=>{
    ipcRenderer.send('show-delete-message-dialog', true)
})

ipcRenderer.on('refresh-page', e=>{
    getCurrentWindow().reload()
})