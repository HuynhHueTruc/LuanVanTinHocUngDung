const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let TinTucSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Tieu_de: String,
    NhanVien_id: String,
    Noi_dung: String,
    Anh_dai_dien: String,
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});

const TinTucModel = mongoose.model('tin_tucs', TinTucSchema);
module.exports = TinTucModel;