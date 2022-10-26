const { ipcRenderer,} = require("electron")
var WebCamera = require("webcamjs");
const imageDataURI = require('image-data-uri')
const db = require('../manageDB')

const browseBtn = document.getElementById('browseBtn'),
      captureBtn = document.getElementById('captureBtn'),
      profile_pic = document.getElementById('pic'),
      webcam = document.getElementById('webcam_id');

let isedit = false, id      

ipcRenderer.invoke('get-edit-info').then(res=>{
  if (res[0]) {
    isedit = true
    var elements = document.forms['form'] .elements;
    let items = res[1]
    console.log(items)
    console.log(elements)
    elements.item(1).value = items.name
    elements.item(2).value = items.fname
    elements.item(3).value = items.sCNIC
    elements.item(4).value = items.fCNIC
    elements.item(5).value = items.scontact
    elements.item(6).value = items.fcontact
    elements.item(7).value = items.s_class
    profile_pic.src = items.picture
    id = items.id

    ipcRenderer.send('set-var-false')
  }
})


browseBtn.addEventListener('click', ()=>{
    ipcRenderer.send('get-img-path')
    console.log('clicked')
})

ipcRenderer.on('img-path', (e, results)=>{
    imgPath = results[0]
    imageDataURI.encodeFromFile(imgPath).then(uri=>{
      profile_pic.src = uri
    })

    // console.log(imgPath)
    
})


captureBtn.addEventListener('click', ()=>{
  console.log('capture btn clicked')
  webcam.style.visibility = "visible";
  WebCamera.attach('#cam');
})



document.getElementById('saveCamBtn').addEventListener('click', ()=>{
  WebCamera.snap(function (data_uri) {
    profile_pic.src = data_uri
    console.log(data_uri)
  })
  WebCamera.reset();
  webcam.style.visibility = "hidden";
})

function capitalize(str){
  let str1 = str.split(" ");
    let returnStr = "";

    for (let i = 0; i < str1.length; i++) {
      let lowerStr = str1[i].toLowerCase();
      returnStr =
        returnStr + str1[i].charAt(0).toUpperCase() + lowerStr.slice(1) + " ";
    }
    return returnStr.trim();
}

function formDataSave() {
  
  var elements = document.forms['form'] .elements;
    var map = new Map(); 
    console.log(elements)
    for(var i = 1 ; i < elements.length-1 ; i++){
        var item = elements.item(i);
        map.set(item.name, capitalize(item.value))
    }
    map.set('picture', profile_pic.src)
    console.log(map)

    if (isedit){
      db.updateProfile('student_data',
                        id,
                        map.get('student_name'),
                        map.get('father_name'),
                        map.get('class'),
                        map.get('scnic'),
                        map.get('fcnic'), 
                        map.get('scontact'),
                        map.get('fcontact'),
                        map.get('picture'))                  
    }
    else{
      db.insertDB('student_data',
                 map.get('student_name'),
                 map.get('father_name'),
                 map.get('class'),
                 map.get('scnic'),
                 map.get('fcnic'), 
                 map.get('scontact'),
                 map.get('fcontact'),
                 map.get('picture'))
      profile_pic.src = profile_pic.src;
    } 
  }