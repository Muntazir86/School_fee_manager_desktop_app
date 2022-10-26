const {ipcRenderer}  = require('electron');
const db = require('./../manageDB')


const name = document.getElementById('name'),
      fname = document.getElementById('fname'),
      sCNIC = document.getElementById('sCNIC'),
      fCNIC = document.getElementById('fCNIC'),
      scontact = document.getElementById('sContact'),
      fcontact = document.getElementById('fContact'),
      s_class = document.getElementById('class'),

      saveBtn = document.getElementById('saveBtn'),
      printBtn = document.getElementById('printBtn'),
      deleteBtn = document.getElementById('deleteBtn'),
      editBtn = document.getElementById('editBtn'),
      backBtn = document.getElementById('backBtn'),
      
      school_fee = document.getElementById('school_fee'),
      books_dues = document.getElementById('books_dues'),
      uniform_dues = document.getElementById('uniform_dues'),
      total_dues = document.getElementById('total_dues'),
      paid_dues = document.getElementById('paid_dues'),
      unpaid_dues = document.getElementById('remaining_dues');


let date_obj = new Date()
let current_date = date_obj.getDate() + '-' + (parseInt(date_obj.getMonth()) + 1) + '-' + date_obj.getFullYear()      
let fee_date = current_date;

let total, paid, picture, id;

function getTotal(school_fee, books_dues, uniform_dues) {
    total_dues.value = parseInt(school_fee) + parseInt(books_dues) + parseInt(uniform_dues)
}

ipcRenderer.invoke('get-student-data').then(res =>{
    let item = res[0]
    console.log(item)

    if (res[1]) {
        saveBtn.style.display = 'none'
        printBtn.style.display = 'none'
        editBtn.style.display = 'none'
        deleteBtn.style.display = 'none'

        school_fee.disabled = true
        books_dues.disabled = true
        uniform_dues.disabled = true
        paid_dues.disabled = true
        backBtn.parentNode.href = 'history.html'

        ipcRenderer.send('set-var-false')
    }

    name.innerText = item.name
    fname.innerText = item.fname
    sCNIC.innerText = item.sCNIC
    fCNIC.innerText = item.fCNIC
    scontact.innerText = item.scontact
    fcontact.innerText = item.fcontact
    s_class.innerText = item.s_class

    school_fee.value = item.school_fee
    books_dues.value = item.books_dues
    uniform_dues.value = item.uniform_dues

    getTotal(item.school_fee, item.books_dues, item.uniform_dues)
    paid_dues.value = item.paid_dues
    unpaid_dues.value = total_dues.value - item.paid_dues

    total = item.total_dues
    paid = item.paid_dues
    
    fee_date = item.date
    picture = item.picture
    id = item.id
})


function isChanged() {
    if(total === total_dues.value || paid === paid_dues.value){
        if (total === total_dues
.value && paid === paid_dues.value) return false
        return true
    }
    else{
        return true
    } 
}


school_fee.addEventListener('keyup', e=>{
    getTotal(school_fee.value, books_dues.value, uniform_dues.value)
})

books_dues.addEventListener('keyup', e=>{
    getTotal(school_fee.value, books_dues.value, uniform_dues.value)
})

uniform_dues.addEventListener('keyup', e=>{
    getTotal(school_fee.value, books_dues.value, uniform_dues.value)
})

paid_dues.addEventListener('keyup', e=>{
    unpaid_dues.value = total_dues.value - paid_dues.value
    if (isChanged()){
        saveBtn.disabled = false
    }
    else{
        saveBtn.disabled = true
        console.log('not changed')
    }
})

saveBtn.addEventListener('click', e=>{
    if(total_dues.value != 0){
        let date_obj = new Date()
        let current_date = date_obj.getDate() + '-' + (parseInt(date_obj.getMonth()) + 1)  + '-' + date_obj.getFullYear()

        db.update('student_data', name.innerText, fCNIC.innerText, parseInt(school_fee.value), parseInt(books_dues.value),
        parseInt(uniform_dues.value), total_dues.value, paid_dues.value, current_date)
        
        db.insertDB('history', name.innerText, fname.innerText, s_class.innerText, sCNIC.innerText, fCNIC.innerText,
        scontact.innerText, fcontact.innerText, picture, parseInt(school_fee.value), parseInt(books_dues.value),
         parseInt(uniform_dues.value), total_dues.value, paid_dues.value, current_date)

        saveBtn.disabled = true;
        fee_date = current_date;
    }    
})

printBtn.addEventListener('click', e=>{

    console.log('printing...')

    fee_date = fee_date == null ? current_date : fee_date;
    console.log(fee_date)
    
    const data = [
        {
            type: 'text',       
            value: 'ND Fast Learning School System',
            style: `text-align:center;`,
            css: {"font-weight": "700", "font-size": "18px", "margin-bottom": "10px"}
        },
        {
            type: 'text',       
            value: 'E-block Gulshan-e-Ali Housing Scheem, Sahiwal',
            style: `text-align:center;`,
            css: {"font-weight": "600", "font-size": "14px", "margin-bottom": "5px", "font-style": "italic"}
        },
        {
            type: 'text',       
            value: 'Contact No. : 0345-7122764, 0301-6523071',
            style: `text-align:center;`,
            css: {"font-weight": "600", "font-size": "14px", "margin-bottom": "20px", "font-style": "italic"}
        },
        {
            type: 'table',
            // style the table
            style: 'border: 1px solid #ddd',
            // multi dimensional array depicting the rows and columns of the table body
            tableBody: [
                ['Name', name.innerText],
                ['Father Name', fname.innerText],
                ['Class', s_class.innerText],
                ['School Fee', school_fee.value],
                ['Books Dues', books_dues.value],
                ['Uniform Dues', uniform_dues.value],
                ['Total Dues', total_dues.value],
                ['Paid Dues', paid_dues.value],
                ['Remaining Dues', unpaid_dues.value],
                ['Date', fee_date],

            ],
            
            // custom style for the table body
            tableBodyStyle: 'border: 0.5px solid #ddd',
        },
        {
            type: 'text',       
            value: 'Note: Please pay fee before 5th of every month.',
            // style: `text-align:left;`,
            css: {"font-weight": "545", "font-size": "14px", "margin-top": "10px"}
        },
        // {
        //     type: 'text',       
        //     value: 'Regards: Principal M. Nadeem',
        //     style: `text-align:center;`,
        //     css: {"font-weight": "500", "font-size": "14px", "margin-bottom": "20px"}
        // }
    ]

    const options = {
        preview: false,               // Preview in window or print
        width: '298px',               //  width of content body
        margin: '0 0 0 0',            // margin of content body
        copies: 1,                    // Number of copies to print
        // printerName: 'Adobe PDF',        // printerName: string, check with webContent.getPrinters()
        timeOutPerLine: 5000,
        pageSize: { height: 119000, width: 80000 }
    }

    ipcRenderer.send('print-details', data, options)

})

deleteBtn.addEventListener('click', e=>{
    console.log('delete clicked')
    ipcRenderer.send('show-delete-message-dialog', false)
    //                 db.deleteRecord('student_data', item.name, item.fCNIC)
})

ipcRenderer.on('delete-dialog-response', (e,res)=>{
    // console.log(res)
    if(res){
        db.deleteRecord('student_data', id)
        backBtn.click()
    }
})


editBtn.addEventListener('click', e=>{
    ipcRenderer.send('edit-info')
})

