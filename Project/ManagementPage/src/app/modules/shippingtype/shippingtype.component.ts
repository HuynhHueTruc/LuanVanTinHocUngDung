import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HinhthucvanchuyenService } from './../../../services/HinhThucVanChuyen/hinhthucvanchuyen.service';
import { HinhThucVanChuyenModel } from './../../../models/HinhThucVanChuyen/hinhthucvanchuyen';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shippingtype',
  templateUrl: './shippingtype.component.html',
  styleUrls: ['./shippingtype.component.scss']
})
export class ShippingtypeComponent implements OnInit {

  hinhthucvanchuyen: HinhThucVanChuyenModel;
  keyword: string;
  dshinhthucvanchuyen: HinhThucVanChuyenModel[] = [];
  dshinhthucvanchuyensearch: HinhThucVanChuyenModel[] = [];
  lengthdshinhthucvanchuyen = 0;
  checked = [];
  checkAll = false;
  hinhthucvanchuyenID: string;
  flag = false;
  KiemTraThongTin = false;
  arrHTVC_ID = [];
  arrTen_HTVC = [];
  lengthchecked = 0;
  constructor(private HTVCService: HinhthucvanchuyenService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getdshinhthucvanchuyen();
  }

    // Hàm lấy danh sách nhân viên
    getdshinhthucvanchuyen(){
      this.HTVCService.getListHinhThucVanChuyen().subscribe((res: any) => {
        this.dshinhthucvanchuyen = res.hinhthucvanchuyens;
        // hỗ trợ searchbykeywword và searchbysex
        this.dshinhthucvanchuyensearch = res.hinhthucvanchuyens;
        // Lưu độ dài của danh sách  để làm checkbox
        this.lengthdshinhthucvanchuyen = this.dshinhthucvanchuyen.length;

        // Thiết lập mảng giá trị checked = false cho các đối tượng
        for (const length in this.dshinhthucvanchuyen){
          if (this.dshinhthucvanchuyen.hasOwnProperty(length)){
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
  this.dshinhthucvanchuyen = this.dshinhthucvanchuyensearch;
  const text = this.removeAccents(this.keyword);
  if (text === ''){
    this.getdshinhthucvanchuyen();
  }else{
    this.dshinhthucvanchuyen = this.dshinhthucvanchuyen.filter( res => {
      const hoten = this.removeAccents(res.Ten_hinh_thuc);
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
  this.dshinhthucvanchuyen = this.dshinhthucvanchuyensearch;
  value.preventDefault();
  const target = value.target.value;
  if (target === 'Cũ nhất'){
    this.getdshinhthucvanchuyen();
  }else{
    if (target === 'Mới nhất'){
      this.dshinhthucvanchuyen.reverse();
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
    for (let i = 0; i < this.lengthdshinhthucvanchuyen; i++){
      this.checked.push(false);
      document.getElementById('divbutton').style.display = 'none';
   }
  } else{
    this.checkAll = true;
    this.checked = [];
    for (let i = 0; i < this.lengthdshinhthucvanchuyen; i++){
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
    this.hinhthucvanchuyen = new HinhThucVanChuyenModel();
    // Gán giá trị rỗng ban đầu cho giới tính
  }

    // Hàm mở Dialog Xác nhận xóa tài khoản
    open_delete(content_delete, _id?){
      if (_id != null){
        this.UnChecked();
        this.hinhthucvanchuyenID = _id;
        this.flag = false;
      }else{
        this.flag = true;
      }
      this.modalService.open(content_delete, {ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

    }

        // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, hinhthucvanchuyenUpdate) {
    this.UnChecked();
    this.modalService.open(content_update, {ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.hinhthucvanchuyen = new HinhThucVanChuyenModel();
    this.hinhthucvanchuyen = hinhthucvanchuyenUpdate;

  }
// Đóng dialog
DongModal(){
  this.modalService.dismissAll();
  location.reload();
}
    // Hàm kiểm tra thông tin
    KTNull(hinhthuc: HinhThucVanChuyenModel){
      const Gia = hinhthuc.Gia;
      const Ten_hinh_thuc = hinhthuc.Ten_hinh_thuc;
      const thongtinhinhthuc = [];
      thongtinhinhthuc.push(Gia, Ten_hinh_thuc);
      for (const i in thongtinhinhthuc){
        if (thongtinhinhthuc.hasOwnProperty(i)){
          if (thongtinhinhthuc[i] === undefined || thongtinhinhthuc[i] === '' || thongtinhinhthuc[i] === null){
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
    ThemHinhThucVanChuyen(){
      // console.log(this.hinhthucvanchuyen)
      this.KTNull(this.hinhthucvanchuyen);

      if (this.KiemTraThongTin){
        this.HTVCService.ThemHinhThucVanChuyen(this.hinhthucvanchuyen).subscribe(data_them => {
          console.log(data_them)
          if (JSON.stringify(data_them) === '"Tạo hình thức vận chuyển thành công!"'){
            this.DongModal();
          }
          else {
              window.alert(data_them);
            }
          });
      }
    }

    // Hàm thực hiện cập nhật thông tin nhân viên
    CapNhatHinhThucVanChuyen(){

    this.KTNull(this.hinhthucvanchuyen);
    if (this.KiemTraThongTin){
      this.HTVCService.CapNhatHinhThucVanChuyen(this.hinhthucvanchuyen).subscribe(data_capnhat => {
        if (JSON.stringify(data_capnhat) === '"Cập nhật hình thức vận chuyển thành công!"'){
          this.DongModal();
        } else {
            window.alert(data_capnhat);
          }
        });
    }
  }

  // Mãng  được check
  HinhThucVanChuyenChecked(){
    this.arrHTVC_ID = [];
    this.arrTen_HTVC = [];
    for (const kt in this.checked){
      if (this.checked.hasOwnProperty(kt)){
        if (this.checked[kt] === true){
          this.arrHTVC_ID.push(this.dshinhthucvanchuyen[kt]._id);
          this.arrTen_HTVC.push(this.dshinhthucvanchuyen[kt].Ten_hinh_thuc);
        }
      }
    }
  }
   // Hàm xóa nhiều nhân viên
   XoaNhieuHinhThucVanChuyen(){
    this.HinhThucVanChuyenChecked();
    this.HTVCService.XoaNhieuHinhThucVanChuyen(this.arrHTVC_ID).subscribe(data_xoanhieunv => {
      if (JSON.stringify(data_xoanhieunv) === '"Xóa hình thức vận chuyển thành công!"'){
        this.DongModal();
        // location.reload();
        // this.modalService.dismissAll();
    } else {
        window.alert(data_xoanhieunv);
      }
    });
  }

   // Hàm thực hiện xóa nhân viên
   XoaNhanVien(_id: string){
    this.HTVCService.XoaHinhThucVanChuyen(_id).subscribe(data_xoa => {
      window.alert(data_xoa);
      location.reload();
    });
  }

   // Thực hiện xóa sau khi xác nhận Dialog
   XacNhan(){
    if (this.flag === true){
      this.XoaNhieuHinhThucVanChuyen();
    }else {
      this.XoaNhanVien(this.hinhthucvanchuyenID);
    }
    this.modalService.dismissAll();
  }
}
