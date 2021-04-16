// xử dụng module mongoose để kết nối 
const mongoose = require('mongoose')

const URI = `mongodb://localhost:27017/DB_GreenLife`
//Bất đồng bộ có nghĩa là sẽ hoàn thành sau, chứ không phải ngay lập tức và nó sẽ báo cho ta biết khi nó hoàn thành(hoặc bị lỗi).
//async giống như một lời hứa sẽ thực hiện yêu cầu sau await
const connectDB = async() => {
    await mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true})
    console.log('MongoDB connected...')
}
//Export ra connectDB
module.exports = connectDB