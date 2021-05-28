
const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

const nodemailer = require('nodemailer')
const details = require('../src/models/GmailModel')
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

// Dùng cho phương thức posts
var bodyParser = require('body-parser');
const KhachHangModel = require('../src/models/KhachHangModel');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())
// route.use(cors({origin: "*"}))

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/khachhang', async(req, res) => {
    KhachHangModel.find({}).select({
        Khach_hang_id: 1,
        Ho_ten: 1,
        Ngay_sinh: 1,
        CMND_CCCD: 1,
        Dia_chi: [{
            Xa_Phuong: 1,
            Huyen_Quan: 1,
            Tinh_ThanhPho: 1
        }],
        Gioi_tinh: 1,
        So_dien_thoai: 1,
        Mat_khau: 1,
        Email: 1,
        So_thich: [{
            Loai_cay: 1
        }],
        Tich_diem: 1,
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, khachhangs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({khachhangs})
        }
    })
})


route.post('/khachhang/dangky', async(req, res) => {
console.log(req.body.So_thich)
    var Khach_hang_id = req.body.Khach_hang_id;
    var Ho_ten = req.body.Ho_ten;
    var Ngay_sinh = req.body.Ngay_sinh
    var CMND_CCCD = req.body.CMND_CCCD;
    var Dia_chi = req.body.Dia_chi;
    var Gioi_tinh = req.body.Gioi_tinh;
    var So_dien_thoai = req.body.So_dien_thoai;
    var Mat_khau = req.body.Mat_khau;
    var So_thich = req.body.So_thich;
    var Email = req.body.Email;
    var Thoi_gian_tao = dateFormat();
    var Thoi_gian_cap_nhat = dateFormat();
    var Ma_so = getRndInteger(100001, 999999);
    var Tich_diem = 0;
   
KhachHangModel.findOne({
    Khach_hang_id: Khach_hang_id
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Mã khách hàng này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
        KhachHangModel.findOne({
            Email: Email
        })
        .then(data => { 
            // console.log(data);
            if(data){ //Nếu có dữ liệu về email này thì thông báo email đã tồn tại
                res.json('Email khách hàng này đã tồn tại!');
            }else{
                // 2 điều kiện trên đều thỏa sẽ tạo ra và return về một đối tượng Khách hàng mới và lưu vào DB
                return KhachHangModel.create({
                    Khach_hang_id : Khach_hang_id,
                    Ho_ten : Ho_ten,
                    Ngay_sinh: Ngay_sinh,
                    Dia_chi : Dia_chi,
                    Gioi_tinh : Gioi_tinh,
                    CMND_CCCD: CMND_CCCD,
                    So_dien_thoai : So_dien_thoai,
                    Ma_so : Ma_so,
                    So_thich: So_thich,
                    Mat_khau : Mat_khau,
                    Email : Email,
                    Tich_diem : Tich_diem,
                    Thoi_gian_tao : Thoi_gian_tao,
                    Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                })
                .then(data => { // ĐỐi tượng nếu tạo thành công sẽ được return về và lưu trong data, sau đó thông báo thành công
                    res.json('Tạo tài khoản thành công!');
                })
            }
        })
        .catch(err => { //Ngược lại sẽ thông báo thất bại
            res.status(500).json('Không tạo được tài khoản!')
        });
    }
})

})

// Hàm random tạo mã OTP
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

route.post('/khachhang/dangnhap', async(req, res) => {
    var Khach_hang_id = req.body.Khach_hang_id;
    var Mat_khau = req.body.Mat_khau;

    KhachHangModel.findOne({
        Khach_hang_id: Khach_hang_id,
        Mat_khau: Mat_khau
    })
    .then(data => {
        if(data){
        res.json(data);
        }else{
            res.json(false);

        }
    })
    .catch(err => {
        res.status(500).json('Lỗi server!')

    })
})

// Hàm xóa một đối tượng 
route.delete('/khachhang/xoakhachhang/:Khach_hang_id', async(req, res) => {
    const Khach_hang_id = req.params.Khach_hang_id;
    KhachHangModel.deleteOne({
        Khach_hang_id: Khach_hang_id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Tài khoản khách hàng này không tồn tại!');
        }
        else{
            res.json('Xóa tài khoản khách hàng thành công!');
        }
    }).catch(err => {
        // res.status(500).json('Lỗi server!')
        res.json({message: error});
    })
})

// Hàm cập nhật
route.put('/khachhang/capnhatkhachhang/:Khach_hang_id', async(req, res) => {
    const Khach_hang_id = req.params.Khach_hang_id;
    const {Ho_ten, Ngay_sinh, Dia_chi, Gioi_tinh, So_dien_thoai, CMND_CCCD, Mat_khau, Email, Tich_diem} = req.body;
    const Ma_so = getRndInteger(100001, 999999);
    const Thoi_gian_cap_nhat = dateFormat();
  
    KhachHangModel.findOne({
        Khach_hang_id: Khach_hang_id
    }).then(data => {
        if (data.Khach_hang_id === Khach_hang_id){
            KhachHangModel.findOne({
                Email: Email
            }).then(data => {

                if (data === null || data.Khach_hang_id === Khach_hang_id){
                     KhachHangModel.updateOne({
                         Khach_hang_id: Khach_hang_id
                     }, {
                        Ho_ten : Ho_ten,
                        Ngay_sinh: Ngay_sinh,
                        Dia_chi : Dia_chi,
                        Gioi_tinh : Gioi_tinh,
                        So_dien_thoai : So_dien_thoai,
                        CMND_CCCD : CMND_CCCD,
                        Ma_so : Ma_so,
                        Mat_khau : Mat_khau,
                        Email : Email,
                        Tich_diem: Tich_diem,
                        Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                    }).then(data => {
                        res.json('Cập nhật khách hàng thành công!')
                    })
                } else {
                    res.json('Email này đã tồn tại!')
                }
            })
        }else {
            res.json('Không tồn tại khách hàng này!')
        }
    })
})

//Tìm kiếm 
route.post('/khachhang/timkiemkhachhang', async(req, res) =>{
    const Khach_hang_id = req.body.Khach_hang_id
    KhachHangModel.findOne({
        Khach_hang_id: Khach_hang_id,
    })
    .then(data => {
        if(data){
            res.json(data.Ma_so);
        }else{
            res.json(false);
        }
    })
    .catch(err => {
        res.status(500).json('Lỗi server!')

    })
})


// Hàm xóa nhiều đối tượng 
route.post('/khachhang/xoakhachhang', async(req, res) => {
    const arrKhachHang = req.body;
    let length = arrKhachHang.length;
    for (let i = 0; i < length; i++){
        KhachHangModel.deleteOne({
        Khach_hang_id: arrKhachHang[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Tài khoản khách hàng này không tồn tại!');
        }
        else{
            res.json('Xóa tài khoản khách hàng thành công!');
        }
        }).catch(err => {
        // res.status(500).json('Lỗi server!')
        res.json({message: err});
        })
    }
    // res.json(length)
    
})

// Hàm gửi email tài khoản khách hàng mới tạo 
route.post('/khachhang/guiemailtaikhoan', async(req, res) => {
    const arrThongTin = req.body;
    let length = arrThongTin.length;
    sendTaiKhoanMail(arrThongTin, info => {
        console.log(`Email đã được gửi!`)
        // res.json(info)
    }).then(data =>{
        res.json(data)
    }).catch(err =>{
        res.json(err)
    })
    // res.json(arrThongTin);
})

async function sendTaiKhoanMail(arruser, callback){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", //pop.gmail.com, port 110
        port: 587, //143, 587, 25
        secure: false,
        auth: {
            user: details.Tai_khoan,
            pass: details.Mat_khau
        }
    })
    for (let i = 0; i < arruser.length; i++) {
        let mailOption = {
            from: '"GreenLife Shop"',
            to: arruser[i].Email,
            subject: "Chào mừng bạn đến với GreenLife Shop!",
            html: `<h1>Xin chào ${arruser[i].Ho_ten}</h1>
            <h4>Cảm ơn bạn đã tin tưởng GreenLife Shop.</h4>
            <h4>Đây là tài khoản của bạn: </h4>
            <h4>Tên đăng nhập: ${arruser[i].Khach_hang_id}</h4>
            <h4>Mật khẩu: ${arruser[i].Mat_khau}</h4>
            <h4>Hãy thay đổi mật khẩu trước khi sử dụng nhé!</h4>
            <h4>Bây giờ hãy bắt đầu trãi nghiệm nào http://localhost:5000/login</h4><br>
            <h4>Chúc bạn có những trãi nghiệm thật tốt với GreenLife!</h4><br>
            <h3>GreenLife Shop!</h3>`
        }   
        let info = await transporter.sendMail(mailOption);
        callback(info);     
    }
    
   
}

// Hàm gửi email theo nội dung tự tạo
route.post('/khachhang/guiemail', async(req, res) => {
    const arrThongTin = req.body.thongtinemail;
    const noi_dung = req.body.noidung;
    const chu_de = req.body.chude;
    let length = arrThongTin.length;

    sendMail(arrThongTin, noi_dung, chu_de, info => {
        console.log(`Email đã được gửi!`)
        // res.json(info)
    }).then(data =>{
        res.json(data)
    }).catch(err =>{
        res.json(err)
    })
})

async function sendMail(arruser, noi_dung, chu_de, callback){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", //pop.gmail.com, port 110
        port: 587, //143, 587, 25
        secure: false,
        auth: {
            user: details.Tai_khoan,
            pass: details.Mat_khau
        }
    })
    for (let i = 0; i < arruser.length; i++) {
        let mailOption = {
            from: '"GreenLife Shop"',
            to: arruser[i].Email,
            subject: chu_de,
            html: ` <h5>Xin chào ${arruser[i].Ho_ten}</h5>
            ${noi_dung}`
        }   
        let info = await transporter.sendMail(mailOption);
        callback(info);   
    }
}

// Hàm gửi mã code qua email lấy lại mật khẩu
route.post('/khachhang/guiOTP', async(req, res) => {
    try {
        const arrThongTin = req.body;
        let a =  setInterval(function(){
            const key = getRndInteger(100001, 999999)
            arrThongTin.Ma_so = key
            KhachHangModel.updateOne({
                Khach_hang_id: arrThongTin.Khach_hang_id
            }, {
             Ma_so : key
           }).then (d =>{
               console.log(arrThongTin.Ma_so)
           })
        }, 60000)
        
        const key = getRndInteger(100001, 999999)
        arrThongTin.Ma_so = key
        KhachHangModel.updateOne({
            Khach_hang_id: arrThongTin.Khach_hang_id
        }, {
         Ma_so : key
       }).then (dt => {
        sendOTP(arrThongTin, info => {
            console.log(`Email đã được gửi!`)
        })
     return res.json(arrThongTin)
           
       })
    } catch (error) {
    return res.status(500).json(error)
    }
})


async function sendOTP(arruser, callback){
   
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", //pop.gmail.com, port 110
        port: 587, //143, 587, 25
        secure: false,
        auth: {
            user: details.Tai_khoan,
            pass: details.Mat_khau
        }
    })
        let mailOption = {
            from: '"GreenLife Shop"',
            to: arruser.Email,
            subject: "[GREEN LIFE] MÃ XÁC NHẬN",
            html: `<h1>Xin chào ${arruser.Ho_ten}</h1>
            <h1>Mã số là: ${arruser.Ma_so}</h1> <br> 
            <h2> Lưu ý: Mã có hiệu lực trong vòng 60 giây. Không được chia sẻ mã với người khác.
            <br>
            <h3>GreenLife Shop!</h3>`
        }   
        let info = await transporter.sendMail(mailOption);
        callback(info);     
}

//Export biến route để server.js có thể gọi các api được viết
module.exports = route;