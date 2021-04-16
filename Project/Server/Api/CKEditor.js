
const express = require('express')
const mongoose = require('mongoose')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const fs = require('fs')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

// Dùng cho phương thức posts
var bodyParser = require('body-parser');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())


route.get('/admin/dashboard', (req, res)=>{
    // res.render('index')
    res.json(res.render('index'))
})

route.post('/admin/dashboard/upload', multipartMiddleware, (req, res)=>{
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            var newPath = __dirname + '/public/images/' + req.files.upload.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    console.log(req.files.upload.originalFilename);
                //     imgl = '/images/req.files.upload.originalFilename';
                //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
                //    res.status(201).send(img);
                 
                    let fileName = req.files.upload.name;
                    let url = '/images/'+fileName;                    
                    let msg = 'Upload successfully';
                    let funcNum = req.query.CKEditorFuncNum;
                    console.log({url,msg,funcNum});
                   
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                }
            });
        });
       } catch (error) {
           console.log(error.message);
       }
})

module.exports = route;