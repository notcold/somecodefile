 const fs = require('fs');
 fs.readFile('./long_text_2018-05-02(2).txt','utf-8',(err,data)=>{
        console.log(err,data)
    })