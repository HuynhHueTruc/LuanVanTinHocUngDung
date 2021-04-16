import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { FormBuilder } from '@angular/forms';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { NhacungcapService } from './../../../services/NhaCungCap/nhacungcap.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiaChiDKModle } from './../../../models/DiaChi/Diachi_DK';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { EmailNhaCungCapModel } from './../../../models/NhaCungCap/emailnhacungcap';
import { NhaCungCapModel } from './../../../models/NhaCungCap/nhacungcap';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  nhacungcap: NhaCungCapModel;
  sanpham: SanPhamModel
  flag = false;
  // Chứa mật khẩu được random
  text = '';
  checkAll = false;
  KiemTraThongTin = false;
  lengthchecked = 0;
  // Mãng ID Nhân viên, mãng mật khẩu, mãng tên nhân viên, mãng email nhân viên được check để xóa và gửi email
  arrNhaCungCapID = [];
  arrTenNCC = [];
  arrEmailNCC = [];
  thongtinnhacungcap = [];
  arrDMN: DanhMucNhoModel[] = [];
  sanphams: SanPhamModel[] = [];
  danhmuc: DanhMucModel;
  subdanhmuc: DanhMucNhoModel[] = [];
  thongtindanhmucnho = [];
  danhmuctmp = []
  DMN = [];

  // Tạo Model Thông tin nhân viên để gửi Email sau khi tạo
  ThongTinGuiEmailTaiKhoan: EmailNhaCungCapModel[] = [];
  // Tạo Model thông tin người nhận trong Dialog gửi mail
  NhaCungCapMail: EmailNhaCungCapModel[] = [];
  dsNhaCungCapNhanMail: EmailNhaCungCapModel[] = [];
  //  Biến lưu ID của đối tượng cần xác nhận xóa
  nhacungcapID: string;

  // Trạng thái div chứa thông báo lỗi của giới tính
  display = 'block';

  // Chứa mảng các giá trị của từng checkbox
  checked = [];
  lengthdsnhacungcap = 0;

  // Tạo Email giả
  tai_khoan = '';
  chu_de = '';
  noi_dung = '';
  chu_tai_khoan = '';
// Biến lưu trữ từ khóa tìm kiếm
  keyword: string;

  thanhphos: DiaChiModel[] = [];
  quanhuyens: QuanHuyenModel[] = [];
  arrquanhuyen1: QuanHuyenModel[] = [];
  xaphuongs: XaPhuongModel[] = [];
  arrxaphuong: XaPhuongModel[] = [];
  diachi: DiaChiDKModle[] = [];
  thanhpho: string;
  quanhuyen: string;
  dsnhacungcap: NhaCungCapModel[] = [];
  dsnhacungcapsearch: NhaCungCapModel[] = [];
  dsdiachi: DiaChiDKModle[] = [];
  arrdiachi: DiaChiDKModle[] = [];
  is_edit = false;
  dropdownSettings: IDropdownSettings;

  constructor(private modalService: NgbModal, private httpClient: HttpClient, private NCCService: NhacungcapService,
    private diachiService: DiachiService, private formBuilder: FormBuilder, private danhmucService: DanhmucService) { }

  ngOnInit(): void {
    this.getdsnhacungcap();
    this.geteachDiaDiem();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'DMN_id',
      textField: 'Ten_danh_muc_nho',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  // Hàm lấy danh sách nhân viên
  getdsnhacungcap(){
    this.NCCService.getListNhaCungCap().subscribe((res: any) => {
      this.dsnhacungcap = res.nhacungcaps;
      // hỗ trợ searchbykeywword và searchbysex
      this.dsnhacungcapsearch = res.nhacungcaps;
      // Lưu độ dài của danh sách nhân viên để làm checkbox
      this.lengthdsnhacungcap = this.dsnhacungcap.length;
      // console.log(res.nhacungcaps);
      // console.log(this.lengthdsnhacungcap);

      for (const nhacungcap in this.dsnhacungcap){
        if (this.dsnhacungcap.hasOwnProperty(nhacungcap)){
         this.dsdiachi.push(this.dsnhacungcap[nhacungcap].Dia_chi);
        }
     }

      for (const dc in this.dsdiachi){
        if (this.dsdiachi.hasOwnProperty(dc)){
          this.arrdiachi.push(this.dsdiachi[dc][0]);
        }
      }
      // Thiết lập mảng giá trị checked = false cho các đối tượng
      for (const length in this.dsnhacungcap){
        if (this.dsnhacungcap.hasOwnProperty(length)){
         this.checked.push(false);
        }
     }
      this.getdsDanhMucNho(this.dsnhacungcap)
    });


  }

    // Hàm lấy thông tin thành phố
  geteachDiaDiem(){
      this.diachiService.getListDiaChi().subscribe((res: any) => {
        this.thanhphos = res;
      });
  }
// Lấy danh sách danh mục
getdsDanhMucNho(ds){
  try {
  this.danhmucService.getListDanhMuc().subscribe((res : any) =>{

      this.danhmuc = res.danhmucs;
      for (const dm in this.danhmuc){
        if (this.danhmuc[dm].Danh_muc_nho.length !== 0){
          for (const dmn in this.danhmuc[dm].Danh_muc_nho)
            this.subdanhmuc.push(this.danhmuc[dm].Danh_muc_nho[dmn])
        }
      }
      this.compareDMN_id(ds)
  })
} catch (error) {
    console.log(error)
  };
}


 // Tìm đối tượng danh mục nhỏ trong DANH MỤC khớp DMN_id với DMN_id trong KHUYẾN MÃI
 compareDMN_id(ds){
  this.arrDMN = []
  this.thongtindanhmucnho.splice(0, this.thongtindanhmucnho.length)
  for (const dmn in ds){
    for (const dmn2 in ds[dmn].Danh_muc_cung_cap){
      for (const dmn3 in this.subdanhmuc){
        if (ds[dmn].Danh_muc_cung_cap[dmn2].DMN_id === this.subdanhmuc[dmn3].DMN_id){
          this.arrDMN.push(this.subdanhmuc[dmn3])
        }
      }
      }
      this.thongtindanhmucnho.push(this.arrDMN)
      this.arrDMN = [];
  }
}

//Chọn phần tử trong thẻ select
onItemSelect(item: any, i?) {
  this.danhmuctmp.push(item)
  // i = 0 là tạo mới, = 1 là cập nhật
  if (i === 0 ){
    document.getElementById('errTaoDanhMuc').style.display = 'none'
  }else{
    if (i === 1){
      document.getElementById('DanhMucNho').style.display = 'none'
    }
  }
}

onSelectAll(items: any, i?) {
  this.danhmuctmp.push(items)
  console.log(this.danhmuctmp)
  if (i === 0 ){
    document.getElementById('errTaoDanhMuc').style.display = 'none'
  }else{
    if (i === 1){
      document.getElementById('DanhMucNho').style.display = 'none'
    }
  }
}

onDeSelectAll(items: any, i?){
  this.danhmuctmp = []

  if (i === 0 ){
    document.getElementById('errTaoDanhMuc').style.display = 'block'
  }else{
    if (i === 1){
      document.getElementById('DanhMucNho').style.display = 'block'
    }
  }

}

onItemDeSelect(item: any, i?){
  for (const j in this.danhmuctmp){
    if(this.danhmuctmp[j].DMN_id === item.DMN_id){
      this.danhmuctmp.splice(Number.parseInt(j), 1)
      if (this.danhmuctmp[0] === undefined){
         if (i === 0 ){
    document.getElementById('errTaoDanhMuc').style.display = 'block'
  }else{
    if (i === 1){
      document.getElementById('DanhMucNho').style.display = 'block'
    }
  }
      }
    }
  }
}

   // Hàm hỗ trợ hiển thị list Thành phố trong thẻ select  + kiểm tra đã chọn tỉnh thành phố chưa
  ThanhPho(e?, diachi?){

  // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);

  // Clear lại xã phường
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);

    if (e === null){
      document.getElementById('mes_tinh_thanhpho').style.display = 'none';

      for (const qh in this.thanhphos){
        if (this.thanhphos.hasOwnProperty(qh)){
          if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho){
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);

            for (const arr2 in this.arrquanhuyen1[0]){
            if (this.arrquanhuyen1[0].hasOwnProperty(arr2)){
              if (this.arrquanhuyen1[0][arr2].name === diachi.Huyen_Quan){
                this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);

              }
            }
          }
            this.arrxaphuong.push(this.quanhuyens[0].wards);

            for (const arr in this.arrxaphuong[0]){
            if (this.arrxaphuong[0].hasOwnProperty(arr)){

                  if (this.arrxaphuong[0][arr].name === diachi.Xa_Phuong){
                    this.xaphuongs.push(this.arrxaphuong[0][arr]);
                  }
            }
          }
          }
        }
      }
      this.HienThiQuanHuyen_XaPhuong(null, diachi);
    }
    else{
      this.nhacungcap.Dia_chi.Huyen_Quan = '';
      this.nhacungcap.Dia_chi.Xa_Phuong = '';

      document.getElementById('mes_tinh_thanhpho').style.display = 'none';
      e.preventDefault();
      const target = e.target;
      this.thanhpho = target.value;

      document.getElementById('mes_huyen_quan').style.display = 'block';
      document.getElementById('mes_xa_phuong').style.display = 'block';

      for (const qh in this.thanhphos){
            if (this.thanhphos.hasOwnProperty(qh)){
              if (this.thanhphos[qh].name === this.thanhpho){
              this.arrquanhuyen1.push(this.thanhphos[qh].districts);
              for (const arr2 in this.arrquanhuyen1[0]){
                if (this.arrquanhuyen1[0].hasOwnProperty(arr2)){
                  this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
                }
              }
              }
            }
      }

    }
  }

  HienThiQuanHuyen_XaPhuong(evt, diachi){
    if (evt === null){
      document.getElementById('mes_xa_phuong').style.display = 'none';

    }else{
      document.getElementById('mes_xa_phuong').style.display = 'block';
      this.nhacungcap.Dia_chi.Xa_Phuong = '';
    }

    // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);

    for (const qh in this.thanhphos){
      if (this.thanhphos.hasOwnProperty(qh)){
        if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho){
        this.arrquanhuyen1.push(this.thanhphos[qh].districts);
        for (const arr2 in this.arrquanhuyen1[0]){
          if (this.arrquanhuyen1[0].hasOwnProperty(arr2)){
            this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
          }
        }
        }
      }
    }

    for (const xp in this.quanhuyens){
      if (this.quanhuyens.hasOwnProperty(xp)){
        if (this.quanhuyens[xp].name === diachi.Huyen_Quan){
        this.arrxaphuong.push(this.quanhuyens[xp].wards);
        for (const arr2 in this.arrxaphuong[0]){
          if (this.arrxaphuong[0].hasOwnProperty(arr2)){
            this.xaphuongs.push(this.arrxaphuong[0][arr2]);
          }
        }
        }
      }
    }
    // console.log(this.xaphuongs)
    this.KiemTraDiaChiUpdate();
    // console.log(this.quanhuyens);
  }

  KiemTraDiaChiUpdate(){
    if (this.nhacungcap.Dia_chi.Huyen_Quan !== ''){
      document.getElementById('mes_huyen_quan').style.display = 'none';
    }else {
      this.nhacungcap.Dia_chi.Xa_Phuong = '';
      document.getElementById('mes_huyen_quan').style.display = 'block';
      document.getElementById('mes_xa_phuong').style.display = 'block';
// console.log(this.nhacungcap.Dia_chi[0].Huyen_Quan)
// console.log(this.nhacungcap.Dia_chi[0].Xa_Phuong)

    }
  }
   // Hàm hiển thị quận huyện tương ứng thành phố + kiểm tra đã chọn quận huyện chưa
  QuanHuyen(e){
      document.getElementById('mes_xa_phuong').style.display = 'block';
      this.xaphuongs.splice(0, this.xaphuongs.length);
      this.arrxaphuong.splice(0, this.arrxaphuong.length);
  //  console.log(this.thanhpho);
      e.preventDefault();
      const target = e.target;
     // console.log(target.value);
      this.quanhuyen = target.value;
      // console.log(this.quanhuyen)
      if (this.quanhuyen !== ''){
        // console.log(this.xaphuongs)
        // console.log(this.quanhuyen)

        for (const xp in this.quanhuyens){
          if (this.quanhuyens.hasOwnProperty(xp)){
            if (this.quanhuyens[xp].name === this.quanhuyen){
            this.arrxaphuong.push(this.quanhuyens[xp].wards);
            for (const arr2 in this.arrxaphuong[0]){
              if (this.arrxaphuong[0].hasOwnProperty(arr2)){
                this.xaphuongs.push(this.arrxaphuong[0][arr2]);
              }
            }
            }
          }
        }
      }else {
        this.xaphuongs.splice(0, this.xaphuongs.length);
        document.getElementById('mes_xa_phuong').style.display = 'block';

      }

      if (this.nhacungcap.Dia_chi.Huyen_Quan !== ''){
        document.getElementById('mes_huyen_quan').style.display = 'none';
      }else {
        document.getElementById('mes_huyen_quan').style.display = 'block';
      }
  }

  // Kiểm tra chọn xã phường
  XaPhuong(diachi?){
    if (diachi === null){
      if (this.nhacungcap.Dia_chi.Xa_Phuong !== ''){
        document.getElementById('mes_xa_phuong').style.display = 'none';
      }else {
        document.getElementById('mes_xa_phuong').style.display = 'block';
      }
    }else {
      if (this.nhacungcap.Dia_chi.Xa_Phuong !== ''){
        document.getElementById('mes_xa_phuong').style.display = 'none';
      }else {
        document.getElementById('mes_xa_phuong').style.display = 'block';
      }
    }

  }
  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.UnChecked();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhacungcap, nếu không sẽ báo lỗi không đọc được undefine
    this.nhacungcap = new NhaCungCapModel();
    // Gán giá trị rỗng ban đầu cho địa chỉ
    this.nhacungcap.Dia_chi = {Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: ''};
    this.nhacungcap.Danh_muc_cung_cap = [{DMN_id: ''}]
    // Gán giá trị mật khẩu bằng chuỗi random khi vừa load form đăng ký
  }

    // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, nhacungcapUpdate) {
    this.UnChecked();
    this.modalService.open(content_update, {ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhacungcap, nếu không sẽ báo lỗi không đọc được undefine
    this.nhacungcap = new NhaCungCapModel();
    this.nhacungcap = nhacungcapUpdate;
    if (nhacungcapUpdate.Dia_chi.Tinh_ThanhPho === undefined){
      this.nhacungcap.Dia_chi = nhacungcapUpdate.Dia_chi[0];
    }else{
      nhacungcapUpdate.Dia_chi = nhacungcapUpdate.Dia_chi
    }
    // console.log(this.nhacungcap.Dia_chi)
    this.ThanhPho(null, this.nhacungcap.Dia_chi);
    for (const dmn2 in nhacungcapUpdate.Danh_muc_cung_cap){
      for(const dm in this.subdanhmuc){
        if (nhacungcapUpdate.Danh_muc_cung_cap[dmn2].DMN_id === this.subdanhmuc[dm].DMN_id){
          this.DMN.push(this.subdanhmuc[dm])
        }
      }
    }

  }

  // Hàm mở Dialog gửi mail
  open_send_mail(content_mails, ncc?) {
      this.dsNhaCungCapNhanMail = [];
      this.modalService.open(content_mails, {ariaLabelledBy: 'modal-basic-title-mails', backdrop: 'static', keyboard: false });
      if (ncc === null ){
        this.NhaCungCapChecked();
        this.ThongTinGuiEmail();
        for (const email in this.ThongTinGuiEmailTaiKhoan){
          if (this.ThongTinGuiEmailTaiKhoan.hasOwnProperty(email)){
          this.dsNhaCungCapNhanMail.push({Email: this.ThongTinGuiEmailTaiKhoan[email].Email,
            Ho_ten: this.ThongTinGuiEmailTaiKhoan[email].Ho_ten});
          }
        }
      } else {
        this.UnChecked();
        this.ThongTinGuiEmailTaiKhoan = [];
        this.ThongTinGuiEmailTaiKhoan.push({Ho_ten: ncc.Ten, Email: ncc.Email});
        this.dsNhaCungCapNhanMail.push({Email: ncc.Email, Ho_ten: ncc.Ten});
      }

  }

  open_supplier_plus(content_info_supplier_plus){
    this.modalService.open(content_info_supplier_plus, {ariaLabelledBy: 'modal-basic-title-info-mail-plus',
    backdrop: 'static', keyboard: false });
  }
  // Hàm mở Dialog thêm email cần gửi
  open_info_mail_plus(content_info_mail_plus) {
    this.tai_khoan = '';
    this.chu_tai_khoan = '';
    this.noi_dung = '';
    this.chu_de = '';
    this.modalService.open(content_info_mail_plus, {ariaLabelledBy: 'modal-basic-title-info-mail-plus',
    backdrop: 'static', keyboard: false });
  }

// Hàm thêm email
  ThemMail(content_mails){
    this.dsNhaCungCapNhanMail.push({Email: this.tai_khoan, Ho_ten: this.chu_tai_khoan});
    this.modalService.dismissAll();
    this.modalService.open(content_mails, {ariaLabelledBy: 'modal-basic-title-mails', backdrop: 'static', keyboard: false });
    // document.getElementById('modals_mails').style.display = 'none';
    // console.log(this.dsNhaCungCapNhanMail);
  }

  // Xoá email ra khỏi danh sách gửi
  xoa_email(ncc){
    // console.log(ncc)
    for (let i in this.dsNhaCungCapNhanMail){
      if (this.dsNhaCungCapNhanMail[i].Email === ncc.Email){
        this.dsNhaCungCapNhanMail.splice(Number.parseInt(i) , 1);
      }
    }
        // console.log(this.dsNhaCungCapNhanMail)
  }

 // Đóng dialog
  DongModal(){
    this.modalService.dismissAll();
    location.reload();
  }

  // Hàm mở Dialog Xác nhận xóa tài khoản
  open_delete(content_delete, Nhan_vien_id?){
    if (Nhan_vien_id != null){
      this.UnChecked();
      this.nhacungcapID = Nhan_vien_id;
      this.flag = false;
    }else{
      this.flag = true;
    }
    this.modalService.open(content_delete, {ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

  }

  // Thực hiện xóa sau khi xác nhận Dialog
  XacNhan(){
    if (this.flag === true){
      this.XoaNhieuNhaCungCap();
    }else {
      this.XoaNhaCungCap(this.nhacungcapID);
    }
    this.modalService.dismissAll();
  }

  // Bỏ chọn tất cả checkbox
  UnChecked(){
    this.checkAll = true
    this.KTCheckedAll()
  }

  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll(){
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.lengthdsnhacungcap; i++){
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
     }
    } else{
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.lengthdsnhacungcap; i++){
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
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

  // Hàm kiểm tra thông tin
  KTNull(nhacungcap: NhaCungCapModel){

    const ten = nhacungcap.Ten;
    const diachi = nhacungcap.Dia_chi;
    const sdt = nhacungcap.So_dien_thoai;
    const email = nhacungcap.Email;
    const thongtinnhacungcap = [];
    thongtinnhacungcap.push(ten, diachi.Tinh_ThanhPho, diachi.Huyen_Quan,
      diachi.Xa_Phuong, sdt, email);
    for (const i in thongtinnhacungcap){
      if (thongtinnhacungcap.hasOwnProperty(i)){
        if (thongtinnhacungcap[i] === '' || thongtinnhacungcap[i] === undefined || thongtinnhacungcap[i] === null){
          window.alert('Hãy nhập đầy đủ thông tin!');
          this.KiemTraThongTin = false;
          break;
        } else {
         this.KiemTraThongTin = true;
        }
      }
    }
  }

  // Hàm thực hiện thêm
  ThemNhaCungCap(){
    if (this.danhmuctmp[0] === undefined){
      document.getElementById('errTaoDanhMuc').style.display = 'block'
      this.KiemTraThongTin = false;

    }else{
      for (const i in this.danhmuctmp){
        this.nhacungcap.Danh_muc_cung_cap.push({DMN_id: this.danhmuctmp[i].DMN_id})
      }
      this.KTNull(this.nhacungcap);

      if (this.KiemTraThongTin){
        for (const i in this.nhacungcap.Danh_muc_cung_cap){
          if (this.nhacungcap.Danh_muc_cung_cap[i].DMN_id === ''){
            this.nhacungcap.Danh_muc_cung_cap.splice(Number.parseInt(i), 1)
          }
        }
        this.NCCService.ThemNhaCungCap(this.nhacungcap).subscribe(data_them => {
          if (JSON.stringify(data_them) === '"Tạo nhà cung cấp thành công!"'){
            this.DongModal();
          }
          else {
              window.alert(data_them);
            }
          });
      }
    }

  }

  // Hàm thực hiện xóa nhân viên
  XoaNhaCungCap(Nhan_vien_id: string){
    this.NCCService.XoaNhaCungCap(Nhan_vien_id).subscribe(data_xoa => {
      window.alert(data_xoa);
      location.reload();
    });
  }

   // Hàm xóa nhiều nhân viên
   XoaNhieuNhaCungCap(){
    this.NhaCungCapChecked();
    this.NCCService.XoaNhieuNhaCungCap(this.arrNhaCungCapID).subscribe(data_xoanhieuncc => {
      if (JSON.stringify(data_xoanhieuncc) === '"Xóa nhà cung cấp thành công!"'){
        this.DongModal();
        // location.reload();
        // this.modalService.dismissAll();
    } else {
        window.alert(data_xoanhieuncc);
      }
    });
  }

// Hàm thực hiện cập nhật thông tin nhân viên
  CapNhatNhaCungCap(){

    this.KTNull(this.nhacungcap);
    if (this.KiemTraThongTin){
      this.NCCService.CapNhatNhaCungCap(this.nhacungcap).subscribe(data_capnhat => {
        if (JSON.stringify(data_capnhat) === '"Cập nhật nhà cung cấp thành công!"'){
          this.DongModal();
          // location.reload();
          //   this.modalService.dismissAll();
        } else {
            window.alert(data_capnhat);
          }
        });
    }
  }

// Mãng nhân viên được check
  NhaCungCapChecked(){
    this.arrNhaCungCapID = [];
    this.arrTenNCC = [];
    this.arrEmailNCC = [];
    for (const kt in this.checked){
      if (this.checked.hasOwnProperty(kt)){
        if (this.checked[kt] === true){
          this.arrEmailNCC.push(this.dsnhacungcap[kt].Email);
          this.arrNhaCungCapID.push(this.dsnhacungcap[kt]._id);
          this.arrTenNCC.push(this.dsnhacungcap[kt].Ten);
        }
      }
    }
  }

  // Gộp thông tin của từng nhân viên để gửi email
  ThongTinGuiEmail(){
    this.ThongTinGuiEmailTaiKhoan = [];

    const sl = this.arrEmailNCC.length;

    for (let i = 0 ; i < sl; i++){
      this.ThongTinGuiEmailTaiKhoan.push({Ho_ten: this.arrTenNCC[i], Email: this.arrEmailNCC[i]});
    }
    // console.log(this.ThongTinGuiEmailTaiKhoan);
  }


  GuiMail(){
      if (this.chu_de === '' || this.noi_dung === ''){
        window.alert('Hãy nhập đầy đủ thông tin!');
      }
      else{
        // console.log(this.dsNhaCungCapNhanMail)
        this.NCCService.GuiEmailNhaCungCap(this.dsNhaCungCapNhanMail, this.noi_dung, this.chu_de).subscribe();
        this.DongModal();
      }
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
  this.dsnhacungcap = this.dsnhacungcapsearch;
  const text = this.removeAccents(this.keyword);
  if (text === ''){
    this.getdsnhacungcap();
  }else{
    this.dsnhacungcap = this.dsnhacungcap.filter( res => {
      const ten = this.removeAccents(res.Ten);
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
  this.dsnhacungcap = this.dsnhacungcapsearch;
  value.preventDefault();
  const target = value.target.value;
  if ( target === 'Cũ nhất'){
    this.getdsnhacungcap();
  }else{
    if (target === 'Mới nhất'){
      this.dsnhacungcap.reverse();
    }
  }
}

KiemTraTrungDMN_id(nhacungcap, arrdanhmuc){
  for (const i in nhacungcap.Danh_muc_cung_cap){
    for (const j in arrdanhmuc){
      if (nhacungcap.Danh_muc_cung_cap[i].DMN_id === arrdanhmuc[j].DMN_id){
        this.danhmuctmp.splice(Number.parseInt(j), 1)
      }
    }
  }
}

ThemDanhMucNho(content_update){
  if (this.danhmuctmp[0] === undefined){
    document.getElementById('DanhMucNho').style.display = 'block'

  }else{
    document.getElementById('DanhMucNho').style.display = 'none'
   this.KiemTraTrungDMN_id(this.nhacungcap, this.danhmuctmp)

   for (const i in this.danhmuctmp){
     this.nhacungcap.Danh_muc_cung_cap.push({DMN_id: this.danhmuctmp[i].DMN_id})
     this.DMN.push(this.danhmuctmp[i])
   }
      this.modalService.dismissAll();
      this.modalService.open(content_update, {ariaLabelledBy: 'modal-basic-title-info-mail-plus',
      backdrop: 'static', keyboard: false });
  }
}

   // Xóa danh mục nhỏ
   XoaDanhMucNho(e){
    for (const i in this.nhacungcap.Danh_muc_cung_cap){
      if (this.nhacungcap.Danh_muc_cung_cap[i].DMN_id === e.DMN_id){
        this.nhacungcap.Danh_muc_cung_cap.splice(Number.parseInt(i), 1)
        this.DMN.splice(Number.parseInt(i), 1)
        this.danhmuctmp = this.DMN
      }
    }
  }
}
