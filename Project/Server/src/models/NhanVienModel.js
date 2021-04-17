const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let NhanVienSchema = new mongoose.Schema({
    Nhan_vien_id: String,
    Ma_so: String,
    Ho_ten: String,
    Ngay_sinh: Date,
    Dia_chi: [{
        Xa_Phuong: String,
        Huyen_Quan: String,
        Tinh_ThanhPho: String
    }],
    Gioi_tinh: String,
    So_dien_thoai: String,
    CMND_CCCD: String,
    Mat_khau: String,
    Email: String,
    Quyen_su_dung: String,
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});

const NhanVienModel = mongoose.model('nhan_viens', NhanVienSchema);
module.exports = NhanVienModel;