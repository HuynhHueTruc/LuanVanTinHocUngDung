//Expressjs hỗ trợ các method HTTP và midleware tạo ra API vô cùng mạnh mẽ và dễ sử dụng
  const express = require('express')
  const app = express()

  //const mongoose = require('mongoose')
  //Khai báo để sử dụng async connectDB
  const connectDB = require('./models/Connection')
  connectDB()

  // parse request body as JSON
  app.use(express.json({ extended: true }))

 // const db = mongoose.connection;
  //Khai báo cổng 3000
  const Port = process.env.Port || 3000
    //Chạy server
    app.listen(Port, () => {
      console.log('Web started')
  })

  app.set('view engine', 'ejs')
  app.set('views', './views')
  app.use(express.static('./public'))

  
  const DanhMuc = require('../Api/DanhMuc.js')
  const SanPham = require('../Api/SanPham.js')
  const KhachHang = require('../Api/KhachHang.js')
  const NhanVien = require('../Api/NhanVien.js')
  const LoaiCay = require('../Api/LoaiCay')
  const ThongTinCuaHang = require('../Api/ThongTinCuaHang.js')
  const HinhThucVanChuyen = require('../Api/HinhThucVanChuyen.js')
  const PhuongThucThanhToan = require('../Api/PhuongThucThanhToan.js')
  const GioHang = require('../Api/GioHang.js')
  const HoaDonBanHang = require('../Api/HoaDonBanHang')
  const HoaDonNhapHang = require('../Api/HoaDonNhapHang.js')
  const KhuyenMai = require('../Api/KhuyenMai.js')
  const PhieuDat = require('../Api/PhieuDat.js')
  const TinTuc = require('../Api/TinTuc.js')
  const NhaCungCap = require('../Api/NhaCungCap')


  const CKEditor = require('../Api/CKEditor')
 // let bodyParser = require('body-parser')


  //Cho phép Client truy cập đến
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  //Thực thi các api 
  app.use(DanhMuc)
  app.use(SanPham)
  app.use(KhachHang)
  app.use(NhanVien)
  app.use(LoaiCay)
  app.use(ThongTinCuaHang)
  app.use(HinhThucVanChuyen)
  app.use(PhuongThucThanhToan)
  app.use(GioHang)
  app.use(HoaDonBanHang)
  app.use(HoaDonNhapHang)
  app.use(KhuyenMai)
  app.use(PhieuDat)
  app.use(TinTuc)
  app.use(NhaCungCap)
  // app.use(CKEditor)

