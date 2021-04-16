const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let HoaDonNhapHangSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
   NhanVien_id: String,
   San_Pham: [{
       SanPham_id: String,
       So_luong: Number,
       Gia_nhap: Number
   }],
   Chu_thich: String,
   Tong_tien: String,
   Ngay_nhap: Date
});

const HoaDonNhapHangModel = mongoose.model('hoa_don_nhap_hangs', HoaDonNhapHangSchema);
module.exports = HoaDonNhapHangModel;