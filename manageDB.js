const db = require('electron-db');
const fs = require('fs')
const path = require('path')


exports.total_student = 0;
exports.paid_student = 0;


exports.hasTable = (tableName, loc) =>{

  let tablePath = path.join(loc, tableName +'.json')
  // console.log(tablePath)

  fs.access(tablePath, fs.F_OK, (err) => {
    if (err) {
      // console.error(err)
      db.createTable(tableName, (succ, msg) => {
        // succ - boolean, tells if the call is successful
        if(succ) {
          let obj = new Date()
          let month = obj.getMonth() + 1
          localStorage.setItem('month-data', month)
        }
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      })
    }
  
    //file exists
  })
}

exports.insertDB = (tableName, sname, fname, s_class, sCNIC = '', fCNIC, scontact = '', fcontact = '', picture, school_fee = 0, books_dues = 0, uniform_dues = 0, total_dues = 0, paid_dues = 0, date = null, status = false)=> {

  let obj = new Object();
 
  obj.name = sname;
  obj.fname = fname;
  obj.s_class = s_class;
  obj.sCNIC = sCNIC;
  obj.fCNIC = fCNIC;
  obj.scontact = scontact;
  obj.fcontact = fcontact;
  obj.picture = picture;

  obj.total_dues = total_dues;
  obj.paid_dues = paid_dues;
  obj.school_fee = school_fee;
  obj.books_dues = books_dues;
  obj.uniform_dues = uniform_dues;
  
  obj.date = date;
  obj.status = status;
 
  if (db.valid(tableName)) {
    db.insertTableContent(tableName, obj, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  })
  }
}

exports.getAll = (tableName) => {

  db.getAll(tableName, (succ, data) => {
    // console.log('getting all data...')
    if(succ){
      // console.log('from db success ...')
      console.log(data)
    }
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.
  })
}


exports.findByNameAndCNIC = (tableName, name, fCNIC) => {

  db.getRows(tableName, {
    name: name,
    fCNIC: fCNIC
  }, (succ, result) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log(result);
  })
}

exports.deleteRecord =(tableName, id) =>{

  db.deleteRow(tableName, {'id': id}, (succ, msg) => {
    console.log(msg);
  });
}

exports.update = (tableName, name, fCNIC, school_fee, books_dues, uniform_dues, total_dues, paid_dues, date) =>{

  let fstatus = false
  if (total_dues != 0){
    fstatus = total_dues === paid_dues
  }
  let where = {
    name: name,
    fCNIC: fCNIC
  };
   
  let set = {
    total_dues: total_dues,
    paid_dues: paid_dues,
    school_fee: school_fee,
    books_dues: books_dues,
    uniform_dues: uniform_dues,
    date: date,
    status: fstatus
  }

  db.updateRow(tableName, where, set, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  });
}

exports.clearAll = (tableName, loc) =>{
  db.clearTable(tableName, loc, (succ, msg) => {
    if (succ) {
        console.log(msg)
    }
})
}

exports.count = (tableName, loc)=>{
  db.count(tableName, loc, (succ, data) => {
    if (succ) {
        // console.log(data)
        this.total_student = data
    } else {
        console.log('An error has occured.')
        console.log(data)
    }
})

  this.search(tableName, true)

}

exports.search = (tableName, status) =>{

db.search(tableName, 'status', status, (succ, data) => {
  if (succ) {
    // console.log(data);
    this.paid_student = data.length
  }
});
}

exports.updateStatus = (tableName) =>{

  let where = {
    status: true
  }

  let set = {
    status: false,
    books_dues: 0,
    uniform_dues: 0,
    paid_dues: 0
  }

  db.search(tableName, 'status', true, (succ, data) => {
    if (succ) {
      for (let i in data){
        console.log(data[i].id)
     db.updateRow(tableName, {id: data[i].id}, set, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
      }
    }
  });
}

exports.updateProfile = (tableName, id, sname, fname, s_class, sCNIC, fCNIC, scontact, fcontact, picture)=>{

  let set = {
    name: sname,
    fname: fname,
    s_class: s_class,
    sCNIC: sCNIC,
    fCNIC: fCNIC,
    scontact: scontact,
    fcontact: fcontact,
    picture: picture
  }

  db.updateRow(tableName, {id: id}, set, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  });

}