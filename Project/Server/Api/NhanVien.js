const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const details = require('../src/models/GmailModel')
// Lưu hình ảnh
const fs = require('fs')
const request = require('request')
 
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

sha256 = require('crypto-js/sha256');

var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "paddedShortDate");

// Dùng cho phương thức posts, nhận yêu cầu gửi lên
var bodyParser = require('body-parser');
const NhanVienModel = require('../src/models/NhanVienModel');
const { ObjectID } = require('mongodb');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())
route.use(cors({origin: "*"}))

{
// // Tạo mã OTP
// const qrcode = require('qrcode')
// const otplib = require('otplib')

// // Sử dụng đối tượng 'authenticator' của otplib
// const {authenticator} = otplib

// // Tạo secret key ứng với từng user để phục vụ cho việc tạo otp token
// const generateUniqueSecret = () => {
//     return authenticator.generateSecret()
// }
//  // Tạo mã OTP Token
//  const generateOTPToken = (username, serviceName, secret) =>{
//      return authenticator.keyuri(username, serviceName, secret)
//  }

//  // Kiểm tra mã OTP Token có hợp lệ hay không
//  const verifyOTPToken = (token, secret) => {
//      return authenticator.verify({token, secret})
//  }

// // Tạo QR code từ mã OTP để gửi cho user sử dụng app quét mã
// const generateQRCode = async (otpAuth) => {
//     try {
//       const QRCodeImageUrl = await qrcode.toDataURL( otpAuth)
//       return `<img id="QRCode" src='${QRCodeImageUrl}' />`
//     } catch (error) {
//       console.log('Could not generate QR code', error)
//       return
//     }
//   }

//   var download = function(uri, filename, callback){
//     request.head(uri, function(err, res, body){
//       console.log('content-type:', res.headers['content-type']);
//       console.log('content-length:', res.headers['content-length']);
   
//       request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//     });
//   };
 
  
//   // Kiểm tra mã token người dùng truyền lên có hợp lệ hay không?
//   const postVerify2FA = async (req, res) => {
//     try {
//       const { otpToken } = req.body
//       // Kiểm tra mã token người dùng truyền lên có hợp lệ hay không?
//       const isValid = verifyOTPToken(otpToken, secret)
//       /** Sau bước này nếu verify thành công thì thực tế chúng ta sẽ redirect qua trang đăng nhập thành công,
//       còn hiện tại demo thì mình sẽ trả về client là đã verify success hoặc fail */
//       return res.status(200).json({ isValid })
//     } catch (error) {
//       return res.status(500).json(error)
//     }
//   }
}

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/nhanvien', async(req, res) => {
    NhanVienModel.find({}).select({
        Nhan_vien_id: 1,
        Ho_ten: 1,
        Ngay_sinh: 1,
        Dia_chi: [{
            Xa_Phuong: 1,
            Huyen_Quan: 1,
            Tinh_ThanhPho: 1
        }],
        Gioi_tinh: 1,
        So_dien_thoai: 1,
        CMND_CCCD: 1,
        Mat_khau: 1,
        Email: 1,
        Quyen_su_dung: 1,
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, nhanviens) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({nhanviens})
        }
    })
})

//Hàm đăng ký tài khoản
route.post('/nhanvien/dangky', async(req, res) => {

    const Nhan_vien_id = req.body.Nhan_vien_id;
    // const Secret_Key = generateUniqueSecret();
    const Ho_ten = req.body.Ho_ten;
    const Ngay_sinh = req.body.Ngay_sinh;
    const Ma_so = getRndInteger(100001, 999999);
    // console.log(Ma_so)
    const Dia_chi = req.body.Dia_chi;
    const Gioi_tinh = req.body.Gioi_tinh;
    const So_dien_thoai = req.body.So_dien_thoai;
    const CMND_CCCD = req.body.CMND_CCCD;
    const Mat_khau = req.body.Mat_khau;
    const Email = req.body.Email;
    const Thoi_gian_tao = dateFormat();
    const Thoi_gian_cap_nhat = dateFormat();
    const Quyen_su_dung = req.body.Quyen_su_dung;
   
// Kiểm tra mã khách hàng có tồn tại chưa
NhanVienModel.findOne({
    Nhan_vien_id: Nhan_vien_id
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Mã nhân viên này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
        NhanVienModel.findOne({
            Email: Email
        })
        .then(data => { 
           // console.log(data);
            if(data){ //Nếu có dữ liệu về email này thì thông báo email đã tồn tại
                res.json('Email nhân viên này đã tồn tại!');
            }else{
                // 2 điều kiện trên đều thỏa sẽ tạo ra và return về một đối tượng Khách hàng mới và lưu vào DB
                return NhanVienModel.create({
                    Nhan_vien_id : Nhan_vien_id,
                    Ma_so: Ma_so,
                    Ho_ten : Ho_ten,
                    Ngay_sinh: Ngay_sinh,
                    Dia_chi : Dia_chi,
                    Gioi_tinh : Gioi_tinh,
                    So_dien_thoai : So_dien_thoai,
                    CMND_CCCD : CMND_CCCD,
                    Mat_khau : Mat_khau,
                    Email : Email,
                    Quyen_su_dung : Quyen_su_dung,
                    Thoi_gian_tao : Thoi_gian_tao,
                    Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                })
            }
        })
        .then(data => { // ĐỐi tượng nếu tạo thành công sẽ được return về và lưu trong data, sau đó thông báo thành công
            res.json('Tạo tài khoản thành công!');
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

// Hàm đăng nhập
route.post('/nhanvien/dangnhap', async(req, res) => {
    const Nhan_vien_id = req.body.Nhan_vien_id;
    const Mat_khau = req.body.Mat_khau;

    NhanVienModel.findOne({
        Nhan_vien_id: Nhan_vien_id,
        Mat_khau: Mat_khau,
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
route.delete('/nhanvien/xoanhanvien/:Nhan_vien_id', async(req, res) => {
    const Nhan_vien_id = req.params.Nhan_vien_id;
    NhanVienModel.deleteOne({
        Nhan_vien_id: Nhan_vien_id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Tài khoản nhân viên này không tồn tại!');
        }
        else{
            res.json('Xóa tài khoản nhân viên thành công!');
        }
    }).catch(err => {
        // res.status(500).json('Lỗi server!')
        res.json({message: error});
    })
})

// Hàm cập nhật
route.put('/nhanvien/capnhatnhanvien/:Nhan_vien_id', async(req, res) => {
    const Nhan_vien_id = req.params.Nhan_vien_id;
    const {Ho_ten, Ngay_sinh, Dia_chi, Gioi_tinh, So_dien_thoai, CMND_CCCD, Mat_khau, Email, Quyen_su_dung} = req.body;
    const Ma_so = getRndInteger(100001, 999999);
    const Thoi_gian_cap_nhat = dateFormat();
  
    NhanVienModel.findOne({
        Nhan_vien_id: Nhan_vien_id
    }).then(data => {
        if (data.Nhan_vien_id === Nhan_vien_id){
            NhanVienModel.findOne({
                Email: Email
            }).then(data => {
                if (data === null || data.Nhan_vien_id === Nhan_vien_id){
                // res.json(data)
                     NhanVienModel.updateOne({
                         Nhan_vien_id: Nhan_vien_id
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
                        Quyen_su_dung : Quyen_su_dung,
                        Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                    }).then(data => {
                        res.json('Cập nhật nhân viên thành công!')
                    })
                } else {
                    res.json('Email này đã tồn tại!')
                }
            })
        }else {
            res.json('Không tồn tại nhân viên này!')
        }
    })
})

//Tìm kiếm nhân viên
route.post('/nhanvien/timkiemnhanvien', async(req, res) =>{
    const Nhan_vien_id = req.body.Nhan_vien_id
    NhanVienModel.findOne({
        Nhan_vien_id: Nhan_vien_id,
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
route.post('/nhanvien/xoanhanvien', async(req, res) => {
    const arrNhanVien = req.body;
    let length = arrNhanVien.length;
    for (let i = 0; i < length; i++){
        NhanVienModel.deleteOne({
        Nhan_vien_id: arrNhanVien[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Tài khoản nhân viên này không tồn tại!');
        }
        else{
            res.json('Xóa tài khoản nhân viên thành công!');
        }
        }).catch(err => {
        // res.status(500).json('Lỗi server!')
        res.json({message: err});
        })
    }
    // res.json(length)
    
})

// Hàm gửi email tài khoản nhân viên mới tạo 
route.post('/nhanvien/guiemailtaikhoan', async(req, res) => {
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
            <h4>Tên đăng nhập: ${arruser[i].Nhan_vien_id}</h4>
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
route.post('/nhanvien/guiemail', async(req, res) => {
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
    console.log(noi_dung)
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
route.post('/nhanvien/guiOTP', async(req, res) => {
    try {
        const arrThongTin = req.body;
        let a =  setInterval(function(){
            const key = getRndInteger(100001, 999999)
            arrThongTin.Ma_so = key
            NhanVienModel.updateOne({
                Nhan_vien_id: arrThongTin.Nhan_vien_id
            }, {
             Ma_so : key
           }).then (d =>{
               console.log(arrThongTin.Ma_so)
           })
        }, 60000)
        
        // const secret_key = generateUniqueSecret();
        // const otpAuth = generateOTPToken(arrThongTin.Nhan_vien_id, 'GreenLifeShop.com', secret_key);
        // const QRCodeImage = await generateQRCode(otpAuth)
        
        // arrThongTin.Secret_Key = secret_key
        // await qrcode.toFile('images/qrcode.png', otpAuth)
        const key = getRndInteger(100001, 999999)
        arrThongTin.Ma_so = key
        NhanVienModel.updateOne({
            Nhan_vien_id: arrThongTin.Nhan_vien_id
        }, {
         Ma_so : key
       }).then (dt => {
        sendOTP(arrThongTin, info => {
            console.log(`Email đã được gửi!`)
        })
     return res.json(arrThongTin)
           
       })
       
    //     NhanVienModel.updateOne({
    //         Nhan_vien_id: arrThongTin.Nhan_vien_id
    //     }, {
    //      Ma_so : key
    //    }).then(data => {
    //        sendOTP(arrThongTin, info => {
    //            console.log(`Email đã được gửi!`)
    //        })
    //     return res.json(arrThongTin)

    //    })
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
