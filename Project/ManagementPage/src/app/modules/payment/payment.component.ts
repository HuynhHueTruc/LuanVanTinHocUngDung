import { PhuongThucThanhToanModel } from './../../../models/PhuongThucThanhToan/phuongthucthanhtoan';
import { PhuongthucthanhtoanService } from './../../../services/PhuongThucThanhToan/phuongthucthanhtoan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  phuongthucthanhtoan: PhuongThucThanhToanModel;
  keyword: string;
  dsphuongthucthanhtoan: PhuongThucThanhToanModel[] = [];
  dsphuongthucthanhtoansearch: PhuongThucThanhToanModel[] = [];
  lengthdsphuongthucthanhtoan = 0;
  checked = [];
  checkAll = false;
  phuongthucthanhtoanID: string;
  flag = false;
  KiemTraThongTin = false;
  arrPTTT_ID = [];
  arrTen_PTTT = [];
  lengthchecked = 0;
  constructor(private modalService: NgbModal, private PTTTService: PhuongthucthanhtoanService) { }

  ngOnInit(): void {
    this.getdsphuongthucthanhtoan();
  }


    // Hàm lấy danh sách
    getdsphuongthucthanhtoan(){
      this.PTTTService.getListPhuongThucThanhToan().subscribe((res: any) => {
        this.dsphuongthucthanhtoan = res.phuongthucthanhtoans;
        // hỗ trợ searchbykeywword và searchbysex
        this.dsphuongthucthanhtoansearch = res.phuongthucthanhtoans;
        // Lưu độ dài của danh sách  để làm checkbox
        this.lengthdsphuongthucthanhtoan = this.dsphuongthucthanhtoan.length;

        // Thiết lập mảng giá trị checked = false cho các đối tượng
        for (const length in this.dsphuongthucthanhtoan){
          if (this.dsphuongthucthanhtoan.hasOwnProperty(length)){
           this.checked.push(false);
          }
       }
        // console.log(this.checked);
      });
    }

    // Hàm chuyển đổi tiếng Việt sang tiếng Anh
removeAccents(str) {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            ;
}

   // Hàm tìm kiếm theo tên hoặc id
 SearchByKeyWord(){
  this.dsphuongthucthanhtoan = this.dsphuongthucthanhtoansearch;
  const text = this.removeAccents(this.keyword);
  if (text === ''){
    this.getdsphuongthucthanhtoan();
  }else{
    this.dsphuongthucthanhtoan = this.dsphuongthucthanhtoan.filter( res => {
      const hoten = this.removeAccents(res.Ten_phuong_thuc);
      const maso = this.removeAccents(res._id);
      const tmp2 = text.replace(/·/g, '');
      if (hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())){
        return hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
      }else {
        if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())){
          return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        }
      }
    });
  }
}


SearchByOption(value){
  this.dsphuongthucthanhtoan = this.dsphuongthucthanhtoansearch;
  value.preventDefault();
  const target = value.target.value;
  if ( target === 'Cũ nhất'){
    this.getdsphuongthucthanhtoan();
  }else{
    if (target === 'Mới nhất'){
      this.dsphuongthucthanhtoan.reverse();
    }
  }
}

 // Bỏ chọn tất cả checkbox
 UnChecked(){
  this.checkAll = true
  this.KTCheckedAll()
}

 // Hàm kiểm tra checked tại các item
 KTChecked(i: string){
  this.lengthchecked = 0;
  this.checked[i] = !this.checked[i];
  if (this.checkAll){
    this.checkAll = false;
  }

  // Kiểm tra có checkbox nào được check hay không, nếu có thì hiển thị divbutton
  for (const kt in this.checked){
    if (this.checked.hasOwnProperty(kt)){
      if (this.checked[kt]){
        this.lengthchecked += 1;
        document.getElementById('divbutton').style.display = 'block';
        // break;
      } else {
        document.getElementById('divbutton').style.display = 'none';
      }
    }
 }
// Nếu các checkbox đều được check thì checbox chechkAll cũng được check
  if (this.lengthchecked === this.checked.length){
    this.checkAll = true;
  }
  // Mở divbutton khi có checkbox được check
  if (this.lengthchecked > 0){
    document.getElementById('divbutton').style.display = 'block';

  }
}

 // Hàm xử lý sự kiện checked tại ô checkbox tổng
 KTCheckedAll(){
  if (this.checkAll) {
    this.checkAll = false;
    this.checked = [];
    for (let i = 0; i < this.lengthdsphuongthucthanhtoan; i++){
      this.checked.push(false);
      document.getElementById('divbutton').style.display = 'none';
   }
  } else{
    this.checkAll = true;
    this.checked = [];
    for (let i = 0; i < this.lengthdsphuongthucthanhtoan; i++){
      this.checked.push(true);
      document.getElementById('divbutton').style.display = 'block';
    }
  }
}

  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.UnChecked();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.phuongthucthanhtoan = new PhuongThucThanhToanModel();
    // Gán giá trị rỗng ban đầu cho giới tính
  }

    // Hàm mở Dialog Xác nhận xóa tài khoản
    open_delete(content_delete, _id?){
      if (_id != null){
        this.UnChecked();
        this.phuongthucthanhtoanID = _id;
        this.flag = false;
      }else{
        this.flag = true;
      }
      this.modalService.open(content_delete, {ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

    }

        // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, phuongthucthanhtoanUpdate) {
    this.UnChecked();
    this.modalService.open(content_update, {ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.phuongthucthanhtoan = new PhuongThucThanhToanModel();
    this.phuongthucthanhtoan = phuongthucthanhtoanUpdate;

  }
// Đóng dialog
DongModal(){
  this.modalService.dismissAll();
  location.reload();
}
    // Hàm kiểm tra thông tin
    KTNull(phuongthuc: PhuongThucThanhToanModel){
      const Ten_phuong_thuc = phuongthuc.Ten_phuong_thuc;
      const thongtinphuongthuc= [];
      thongtinphuongthuc.push(Ten_phuong_thuc);
      for (const i in thongtinphuongthuc){
        if (thongtinphuongthuc.hasOwnProperty(i)){
          if (thongtinphuongthuc[i] === undefined || thongtinphuongthuc[i] === '' || thongtinphuongthuc[i] === null){
            window.alert('Hãy nhập đầy đủ thông tin!');
            this.KiemTraThongTin = false;
            break;
          } else {
           this.KiemTraThongTin = true;
          }
        }
      }
    }

    // Hàm thực hiện thêm tài khoản nhân viên
    ThemPhuongThucThanhToan(){
      this.KTNull(this.phuongthucthanhtoan);

      if (this.KiemTraThongTin){
        this.PTTTService.ThemPhuongThucThanhToan(this.phuongthucthanhtoan).subscribe(data_them => {
          // console.log(data_them)
          if (JSON.stringify(data_them) === '"Tạo phương thức thanh toán thành công!"'){
            this.DongModal();
          }
          else {
              window.alert(data_them);
            }
          });
      }
    }

    // Hàm thực hiện cập nhật thông tin nhân viên
    CapNhatPhuongThucThanhToan(){
    this.KTNull(this.phuongthucthanhtoan);
    if (this.KiemTraThongTin){
      this.PTTTService.CapNhatPhuongThucThanhToan(this.phuongthucthanhtoan).subscribe(data_capnhat => {
        if (JSON.stringify(data_capnhat) === '"Cập nhật phương thức thanh toán thành công!"'){
          this.DongModal();
        } else {
            window.alert(data_capnhat);
          }
        });
    }
  }

  // Mãng  được check
  PhuongThucThanhToanChecked(){
    this.arrPTTT_ID = [];
    this.arrTen_PTTT = [];
    for (const kt in this.checked){
      if (this.checked.hasOwnProperty(kt)){
        if (this.checked[kt] === true){
          this.arrPTTT_ID.push(this.dsphuongthucthanhtoan[kt]._id);
          this.arrTen_PTTT.push(this.dsphuongthucthanhtoan[kt].Ten_phuong_thuc);
        }
      }
    }
  }
   // Hàm xóa nhiều
   XoaNhieuPhuongThucThanhToan(){
    this.PhuongThucThanhToanChecked();
    this.PTTTService.XoaNhieuPhuongThucThanhToan(this.arrPTTT_ID).subscribe(data_xoanhieu => {
      if (JSON.stringify(data_xoanhieu) === '"Xóa phương thức thanh toán thành công!"'){
        this.DongModal();
    } else {
        window.alert(data_xoanhieu);
      }
    });
  }

   // Hàm thực hiện xóa
   XoaPhuongThucThanhToan(_id: string){
    this.PTTTService.XoaPhuongThucThanhToan(_id).subscribe(data_xoa => {
      window.alert(data_xoa);
      location.reload();
    });
  }

   // Thực hiện xóa sau khi xác nhận Dialog
   XacNhan(){
    if (this.flag === true){
      this.XoaNhieuPhuongThucThanhToan();
    }else {
      this.XoaPhuongThucThanhToan(this.phuongthucthanhtoanID);
    }
    this.modalService.dismissAll();
  }
}
