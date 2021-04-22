import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';

@Component({
  selector: 'app-typeoftree',
  templateUrl: './typeoftree.component.html',
  styleUrls: ['./typeoftree.component.scss']
})
export class TypeoftreeComponent implements OnInit {

  loaicay: LoaiCayModel;
  keyword: string;
  dsloaicay: LoaiCayModel[] = [];
  dsloaicaysearch: LoaiCayModel[] = [];
  lengthdsloaicay = 0;
  checked = [];
  checkAll = false;
  loaicayID: string;
  flag = false;
  KiemTraThongTin = false;
  arrLoaiCay_ID = [];
  arrTenLoaiCay = [];
  lengthchecked = 0;
  choosefile = false;
  url: any
  firebaseConfig = {
    apiKey: "AIzaSyB5XhGTH_qmY-E5SKq0x9xvvadjtqPeXQQ",
    authDomain: "managementimagesgreenlife.firebaseapp.com",
    projectId: "managementimagesgreenlife",
    storageBucket: "managementimagesgreenlife.appspot.com",
    messagingSenderId: "206299427924",
    appId: "1:206299427924:web:63b6f139ee2c4d059f69c1",
    measurementId: "G-QZHVZRPBCT"
  };

  constructor(private modalService: NgbModal, private loaicayService: LoaicayService) { }

  ngOnInit(): void {
    this.getdsloaicay();
      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(this.firebaseConfig);
        firebase.analytics();
      } else {
        firebase.app(); // if already initialized, use that one
      }

  }

    // Hàm lấy danh sách
    getdsloaicay(){
      this.loaicayService.getListLoaiCay().subscribe((res: any) => {
        this.dsloaicay = res.loaicays;
        // hỗ trợ searchbykeywword và searchbysex
        this.dsloaicaysearch = res.loaicays;
        // Lưu độ dài của danh sách  để làm checkbox
        this.lengthdsloaicay = this.dsloaicay.length;

        // Thiết lập mảng giá trị checked = false cho các đối tượng
        for (const length in this.dsloaicay){
          if (this.dsloaicay.hasOwnProperty(length)){
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
  this.dsloaicay = this.dsloaicaysearch;
  const text = this.removeAccents(this.keyword);
  if (text === ''){
    this.getdsloaicay();
  }else{
    this.dsloaicay = this.dsloaicay.filter( res => {
      const ten = this.removeAccents(res.Ten_loai_cay);
      const maso = this.removeAccents(res._id);
      const tmp2 = text.replace(/·/g, '');
      if (ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())){
        return ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
      }else {
        if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())){
          return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        }
      }
    });
  }
}

SearchByOption(value){
  this.dsloaicay = this.dsloaicaysearch;
  value.preventDefault();
  const target = value.target.value;
  if (target === 'Cũ nhất'){
    this.getdsloaicay();
  }else{
    if (target === 'Mới nhất'){
      this.dsloaicay.reverse();
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
    for (let i = 0; i < this.lengthdsloaicay; i++){
      this.checked.push(false);
      document.getElementById('divbutton').style.display = 'none';
   }
  } else{
    this.checkAll = true;
    this.checked = [];
    for (let i = 0; i < this.lengthdsloaicay; i++){
      this.checked.push(true);
      document.getElementById('divbutton').style.display = 'block';
    }
  }
}

  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.choosefile = false
    this.UnChecked();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.loaicay = new LoaiCayModel();
    // Gán giá trị rỗng ban đầu cho giới tính
  }

    // Hàm mở Dialog Xác nhận xóa tài khoản
    open_delete(content_delete, _id?){
      if (_id != null){
        this.UnChecked();
        this.loaicayID = _id;
        this.flag = false;
      }else{
        this.flag = true;
      }
      this.modalService.open(content_delete, {ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });
    }

    // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, loaicayUpdate) {
    this.choosefile = true
    this.UnChecked();
    this.modalService.open(content_update, {ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.loaicay = new LoaiCayModel();
    this.loaicay = loaicayUpdate;

  }
  // Đóng dialog
  DongModal(){
    this.modalService.dismissAll();
    location.reload();
  }
    // Hàm kiểm tra thông tin
    KTNull(loaicay: LoaiCayModel){
      const Ten_loai_cay = loaicay.Ten_loai_cay;
      const Hinh_anh = loaicay.Hinh_anh
      const thongtinloaicay = [];
      thongtinloaicay.push( Ten_loai_cay, Hinh_anh);
      for (const i in thongtinloaicay){
        if (thongtinloaicay.hasOwnProperty(i)){
          if (thongtinloaicay[i] === undefined || thongtinloaicay[i] === '' || thongtinloaicay[i] === null){
            window.alert('Hãy nhập đầy đủ thông tin!');
            this.KiemTraThongTin = false;
            break;
          } else {
           this.KiemTraThongTin = true;
          }
        }
      }
    }

      //upload lên firebase và gọi hàm lưu vào csdl
  uploadImageandSave(flag?: number) {
    if (this.choosefile) {
      const ref = firebase.storage().ref();
      const f = document.querySelector('#photo') as HTMLInputElement;
      const file = f.files[0];

      if (file === undefined) {
        this.CapNhatLoaiCay(this.loaicay.Hinh_anh)
      } else {
        const name = new Date() + '-' + file.name;
        const metadata = {
          contentType: file.type
        };
        const task = ref.child(name).put(file, metadata);
        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            // console.log(url),
            this.url = url;
            // alert("Image upload succesful")
            if (flag === 1) {
              this.CapNhatLoaiCay(this.url)
            } else {
              this.ThemLoaiCay(this.url);
            }
          }
          );
      }
    } else {
      this.ThemLoaiCay(null);
    }

  }

    // Hàm thực hiện thêm tài khoản nhân viên
    ThemLoaiCay(url){
      this.loaicay.Hinh_anh = url
      // console.log(this.loaicay)
      this.KTNull(this.loaicay);

      if (this.KiemTraThongTin){
        this.loaicayService.ThemLoaiCay(this.loaicay).subscribe(data_them => {
          console.log(data_them)
          if (JSON.stringify(data_them) === '"Tạo loại cây thành công!"'){
            this.DongModal();
          }
          else {
              window.alert(data_them);
            }
          });
      }
    }

    // Hàm thực hiện cập nhật thông tin nhân viên
    CapNhatLoaiCay(url){
      this.loaicay.Hinh_anh = url
    this.KTNull(this.loaicay);
    if (this.KiemTraThongTin){
      this.loaicayService.CapNhatLoaiCay(this.loaicay).subscribe(data_capnhat => {
        if (JSON.stringify(data_capnhat) === '"Cập nhật loại cây thành công!"'){
          this.DongModal();
        } else {
            window.alert(data_capnhat);
          }
        });
    }
  }

  // Mãng  được check
  LoaiCayChecked(){
    this.arrLoaiCay_ID = [];
    this.arrTenLoaiCay = [];
    for (const kt in this.checked){
      if (this.checked.hasOwnProperty(kt)){
        if (this.checked[kt] === true){
          this.arrLoaiCay_ID.push(this.dsloaicay[kt]._id);
          this.arrTenLoaiCay.push(this.dsloaicay[kt].Ten_loai_cay);
        }
      }
    }
  }
   // Hàm xóa nhiều nhân viên
   XoaNhieuLoaiCay(){
    this.LoaiCayChecked();
    this.loaicayService.XoaNhieuLoaiCay(this.arrLoaiCay_ID).subscribe(data_xoanhieunv => {
      if (JSON.stringify(data_xoanhieunv) === '"Xóa loại cây thành công!"'){
        this.DongModal();
        // location.reload();
        // this.modalService.dismissAll();
    } else {
        window.alert(data_xoanhieunv);
      }
    });
  }

   // Hàm thực hiện xóa nhân viên
   XoaLoaiCay(_id: string){
    this.loaicayService.XoaLoaiCay(_id).subscribe(data_xoa => {
      window.alert(data_xoa);
      location.reload();
    });
  }

   // Thực hiện xóa sau khi xác nhận Dialog
   XacNhan(){
    if (this.flag === true){
      this.XoaNhieuLoaiCay();
    }else {
      this.XoaLoaiCay(this.loaicayID);
    }
    this.modalService.dismissAll();
  }

   // Kiểm tra file có được upload hay không
   chooseFile() {
    const f = document.querySelector('#photo') as HTMLInputElement;
    const file = f.files[0];
    if (file !== undefined) {
      document.getElementById('err_upload').style.display = 'none';
      this.choosefile = true;
    } else {
      document.getElementById('err_upload').style.display = 'block';
      this.choosefile = false
    }
  }
}
