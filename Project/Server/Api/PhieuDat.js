const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

const nodemailer = require('nodemailer')
const details = require('../src/models/GmailModel')

var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
const { ObjectID } = require('bson');

// Dùng cho phương thức posts
var bodyParser = require('body-parser');
const PhieuDatModel = require('../src/models/PhieuDatModel');
const SanPhamModel = require('../src/models/SanPhamModel');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())

// route.use(cors({origin: "*"}))

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/phieudat/thongtin', async(req, res) => {
    PhieuDatModel.find({}).select({
        _id: 1,
        San_Pham: [{
            SanPham_id: 1,
            So_luong: 1,
            Gia_ban: 1
        }],
        KhachHang_id: 1,
        Ho_ten: 1,
        So_dien_thoai: 1,
        Dia_chi: [{
            Xa_Phuong: 1,
            Huyen_Quan: 1,
            Tinh_ThanhPho: 1
        }],
        VanChuyen_id: 1,
        ThanhToan_id: 1,
        Tong_tien: 1,
        Ngay_nhan: 1,
        Ngay_cap_nhat: 1,
        Trang_thai: 1
    }).exec((err, phieudats) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({phieudats})
        }
    })
})


route.post('/phieudat/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var KhachHang_id = req.body.KhachHang_id;
    var Ho_ten = req.body.Ho_ten;
    var So_dien_thoai = req.body.So_dien_thoai;
    var Dia_chi = req.body.Dia_chi;
    var VanChuyen_id = req.body.VanChuyen_id;
    var ThanhToan_id = req.body.ThanhToan_id;
    var Trang_thai = req.body.Trang_thai;
    var San_Pham = req.body.San_Pham;
    var Tong_tien = req.body.Tong_tien;
    var Ngay_nhan = dateFormat();
    var Ngay_cap_nhat = dateFormat();

        // Kiểm tra email đã tồn tại chưa
       return PhieuDatModel.create({
            _id: _id,
            KhachHang_id: KhachHang_id,
            Ho_ten: Ho_ten,
            So_dien_thoai: So_dien_thoai,
            Dia_chi: Dia_chi,
            VanChuyen_id: VanChuyen_id, 
            ThanhToan_id: ThanhToan_id,
            Trang_thai: Trang_thai, 
            San_Pham: San_Pham,
            Tong_tien: Tong_tien,
            Ngay_nhan: Ngay_nhan,
            Ngay_cap_nhat: Ngay_cap_nhat
        }).then(dt => {
            res.json('Tạo phiếu đặt thành công!')
        }).catch (err =>{
            res.json(err)
        })
})



// Hàm cập nhật
route.put('/phieudat/capnhatphieudat/:_id', async(req, res) => {
    // console.log(req.body)
    const _id = req.params._id;
    const {KhachHang_id, Ho_ten, So_dien_thoai, Dia_chi, VanChuyen_id, ThanhToan_id, Trang_thai, Tong_tien, San_Pham} = req.body;
    const Ngay_cap_nhat = dateFormat();
  
    PhieuDatModel.findOne({
        _id: _id
    }).then(data => {
          return PhieuDatModel.updateOne({
                _id: _id
            }, {
                KhachHang_id: KhachHang_id,
                Ho_ten: Ho_ten,
                So_dien_thoai: So_dien_thoai,
                Dia_chi: Dia_chi,
                VanChuyen_id: VanChuyen_id,
                ThanhToan_id: ThanhToan_id,
                Trang_thai: Trang_thai, Tong_tien: Tong_tien,
                San_Pham: San_Pham,
                Ngay_cap_nhat : Ngay_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật phiếu đặt thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy phiếu đặt này!')

    })
})


// Hàm xóa một đối tượng 
route.delete('/phieudat/xoaphieudat/:_id', async(req, res) => {
    const _id = req.params._id;
    PhieuDatModel.deleteOne({
        _id: _id
    }).then(data => {
        // if (data.deletedCount === 0){
        //      res.json('Phiếu đặt này không tồn tại!');
        // }
        // else{
            res.json('Xóa phiếu đặt thành công!');
        // }
    }).catch(err => {
        res.json({message: err});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/phieudat/xoanhieuphieudat', async(req, res) => {
    const arrPhieuDat = req.body;
    let length = arrPhieuDat.length;
    for (let i = 0; i < length; i++){
        PhieuDatModel.deleteOne({
        _id: arrPhieuDat[i]
        }).then(data => {
        // if (data.deletedCount === 0){
        //      res.json('Phiếu đặt này không tồn tại!');
        // }
        // else{
            res.json('Xóa phiếu đặt thành công!');
        // }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})

// Hàm gửi email phiếu đặt
route.post('/phieudat/guiemailphieudat', async(req, res) => {
    const _id = req.body._id
    const dsSanPham = req.body.dsSanPham;
    const KhachHang = req.body.KhachHang;
    const arrgiatrikhuyenmai = req.body.arrgiatrikhuyenmai

    findResult(dsSanPham, arrgiatrikhuyenmai).then(function(result){ 
        sendMail(_id, dsSanPham, KhachHang, result, info => {
                    console.log(`Email đã được gửi!`)
                }).then(data =>{
                    res.json(data)
                }).catch(err =>{
                    res.json(err)
                })
      })
})

async function findResult(dsSanPham, arrgiatrikhuyenmai) {
    const arrTenSP = []
    let source = [{src: ''}]
    for (let i = 0; i < dsSanPham.length; i++){
        result = await SanPhamModel.findOne({
            _id: dsSanPham[i].SanPham_id
        }).then(data => {
            arrTenSP.push(data.Ten_san_pham)
            source[0].src += `<tr><td>${i + 1}</td><td>${arrTenSP[i]}</td><td>${dsSanPham[i].So_luong}</td><td>${dsSanPham[i].Gia_ban}</td><td>${arrgiatrikhuyenmai[i]}</td><td>${(dsSanPham[i].Gia_ban - (dsSanPham[i].Gia_ban*arrgiatrikhuyenmai[i]))*dsSanPham[i].So_luong}</td></tr>`
        })
    }

    return {arrTenSP, source}
  }

async function sendMail(_id, dsSanPham, KhachHang, result, callback){
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
            to: KhachHang.Email,
            subject: "Chào mừng bạn đến với GreenLife Shop!",
            html: `<h1>Xin chào ${KhachHang.Ho_ten}</h1>
            <h4>Cảm ơn bạn đã tin tưởng GreenLife Shop.</h4>
            <h4>Đây là đơn hàng bạn vừa đặt, hãy kiểm tra lại thông tin nhé!</h4>
            <h4>Mã đơn hàng của bạn: ${_id}</h4>
            <table border="1">
            <tbody>
            <tr bgcolor="#b9c9fe">
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Số lượng </th>
            <th>Giá</th>
            <th>Khuyến mãi</th>
            <th>Giá thành tiền</th>
            </tr>
            ${result.source[0].src}
            </tbody>
            </table>
            <h4>Shop sẽ xác nhận đơn hàng của bạn trong vòng 24 giờ</h4>
            <h4>Chúc bạn có những trãi nghiệm thật tốt với GreenLife!</h4><br>
            <h3>GreenLife Shop!</h3>`
          
        }   
        let info = await transporter.sendMail(mailOption);
        callback(info);   
}
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;