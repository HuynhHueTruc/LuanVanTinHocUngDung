const mongoose = require('mongoose')

let PhuongThucThanhToanSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Ten_phuong_thuc: String,
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});

const PhuongThucThanhToanModel = mongoose.model('phuong_thuc_thanh_toans', PhuongThucThanhToanSchema);

module.exports = PhuongThucThanhToanModel