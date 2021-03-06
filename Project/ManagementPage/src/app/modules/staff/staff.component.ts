import { NguoiNhanModel } from './../../../models/NhanVien/nguoinhan';
import { ThongTinTaiKhoanEmailModel } from './../../../models/NhanVien/thongtinemail';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { DiaChiDKModle } from './../../../models/DiaChi/Diachi_DK';
import { NhanvienService } from './../../../services/NhanVien/nhanvien.service';
import { NhanVienModel } from './../../../models/NhanVien/nhanvien';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data, each, event } from 'jquery';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// import * as $ from 'jquery';
// import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  // Chứa thông tin được nhập vào trong form đăng ký
  nhanvien: NhanVienModel;
  flag = false;
  // Chứa mật khẩu được random
  text = '';
  checkAll = false;
  // KiemTraThongTin = false;
  lengthchecked = 0;
  // Mãng ID Nhân viên, mãng mật khẩu, mãng tên nhân viên, mãng email nhân viên được check để xóa và gửi email
  arrNhanVienID = [];
  arrMatKhauNV = [];
  arrTenNV = [];
  arrEmailNV = [];
  // Tạo Model Thông tin nhân viên để gửi Email sau khi tạo
  ThongTinGuiEmailTaiKhoan: ThongTinTaiKhoanEmailModel[] = [];
  // Tạo Model thông tin người nhận trong Dialog gửi mail
  NguoiNhanMail: NguoiNhanModel[] = [];
  dsNguoiNhanMail: NguoiNhanModel[] = [];
  // Dùng cho Modal
  QuyenSuDung = 'Nhân viên';
  //  Biến lưu ID của đối tượng cần xác nhận xóa
  nhanvienID: string;
  // Trạng thái div chứa thông báo lỗi của giới tính
  display = 'block';
  // Chứa mảng các giá trị của từng checkbox
  checked = [];
  lengthdsnhanvien = 0;

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
  dsnhanvien: NhanVienModel[] = [];
  dsnhanviensearch: NhanVienModel[] = [];
  dsdiachi: DiaChiDKModle[] = [];
  arrdiachi: DiaChiDKModle[] = [];
  nhanviens: NhanVienModel[] = []
  is_edit = false;
  hienthi = false
  p: number = 1
  Ten_dang_nhap_pattern = "^[A-Za-z0-9 _-]{6,32}$"
  So_dien_thoai_pattern = "^0[0-9\s.-]{9}"
  CMND_pattern = "[0-9]{9,12}"
  email_pattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"

  // Đối tượng nhân viên update
  NhanVienUpdate: NhanVienModel[] = [];
  constructor(private modalService: NgbModal, private httpClient: HttpClient, private NVService: NhanvienService,
    private diachiService: DiachiService, private formBuilder: FormBuilder, private datePipe: DatePipe) { }

  form: FormGroup;
  Ten_dang_nhap = new FormControl()

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.email_pattern)]],
      // password: [null, Validators.required],
      Ten_dang_nhap: [null, [Validators.required, Validators.pattern(this.Ten_dang_nhap_pattern)]],
      Ho_ten: ['', Validators.required],
      Ngay_sinh: ['', [Validators.required]],
      So_dien_thoai: ['', [Validators.required, Validators.pattern(this.So_dien_thoai_pattern)]],
      Gioi_tinh: ['', Validators.required],
      CMND_CCCD: ['', [Validators.required, Validators.pattern(this.CMND_pattern)]],
      provinces: ['', [Validators.required]],
      districts: ['', [Validators.required]],
      ward: ['', [Validators.required]],
      // Mat_khau: ['', [Validators.required]],
      QuyenSuDung: ['', [Validators.required]]
    });

    this.NVService.getRefeshPage().subscribe(dt => {
      this.getdsnhanvien();
      this.geteachDiaDiem();

    })
    this.getdsnhanvien();
    this.geteachDiaDiem();
  }

  // Hàm lấy danh sách nhân viên
  getdsnhanvien() {
    this.NVService.getListNhanVien().subscribe((res: any) => {
      this.dsnhanvien = res.nhanviens;
      // hỗ trợ searchbykeywword và searchbysex
      this.dsnhanviensearch = res.nhanviens;
      // Lưu độ dài của danh sách nhân viên để làm checkbox
      this.lengthdsnhanvien = this.dsnhanvien.length;
      if (this.nhanviens.length === 0) {
        this.p = 1
      }
      this.ChuyenTrang(this.p)
      // console.log(this.checked);
    });


  }

  // Hàm lấy thông tin thành phố
  geteachDiaDiem() {
    this.diachiService.getListDiaChi().subscribe((res: any) => {
      this.thanhphos = res;
    });
  }

  // Hàm random Mật khẩu
  RandomMatKhau() {
    this.text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i++) {
      this.text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return this.text;
  }

  // Hàm hỗ trợ hiển thị list Thành phố trong thẻ select  + kiểm tra đã chọn tỉnh thành phố chưa
  ThanhPho(e?, diachi?) {
    // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
    // Clear lại xã phường
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);
    if (e === null) {
      for (const qh in this.thanhphos) {
        if (this.thanhphos.hasOwnProperty(qh)) {
          if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho) {
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);
            for (const arr2 in this.arrquanhuyen1[0]) {
              if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
                if (this.arrquanhuyen1[0][arr2].name === diachi.Huyen_Quan) {
                  this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
                }
              }
            }
            this.arrxaphuong.push(this.quanhuyens[0].wards);
            for (const arr in this.arrxaphuong[0]) {
              if (this.arrxaphuong[0].hasOwnProperty(arr)) {
                if (this.arrxaphuong[0][arr].name === diachi.Xa_Phuong) {
                  this.xaphuongs.push(this.arrxaphuong[0][arr]);
                }
              }
            }
          }
        }
      }
      this.HienThiQuanHuyen_XaPhuong(null, diachi);
    }
    else {
      this.nhanvien.Dia_chi.Huyen_Quan = '';
      this.nhanvien.Dia_chi.Xa_Phuong = '';
      e.preventDefault();
      const target = e.target;
      this.thanhpho = target.value;
      for (const qh in this.thanhphos) {
        if (this.thanhphos.hasOwnProperty(qh)) {
          if (this.thanhphos[qh].name === this.thanhpho) {
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);
            for (const arr2 in this.arrquanhuyen1[0]) {
              if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
                this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
              }
            }
          }
        }
      }
    }
  }


  HienThiQuanHuyen_XaPhuong(evt, diachi) {
    // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);
    for (const qh in this.thanhphos) {
      if (this.thanhphos.hasOwnProperty(qh)) {
        if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho) {
          this.arrquanhuyen1.push(this.thanhphos[qh].districts);
          for (const arr2 in this.arrquanhuyen1[0]) {
            if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
              this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
            }
          }
        }
      }
    }
    for (const xp in this.quanhuyens) {
      if (this.quanhuyens.hasOwnProperty(xp)) {
        if (this.quanhuyens[xp].name === diachi.Huyen_Quan) {
          this.arrxaphuong.push(this.quanhuyens[xp].wards);
          for (const arr2 in this.arrxaphuong[0]) {
            if (this.arrxaphuong[0].hasOwnProperty(arr2)) {
              this.xaphuongs.push(this.arrxaphuong[0][arr2]);
            }
          }
        }
      }
    }
  }

  // Hàm hiển thị quận huyện tương ứng thành phố + kiểm tra đã chọn quận huyện chưa
  QuanHuyen(e) {
    this.nhanvien.Dia_chi.Xa_Phuong = '';
    this.xaphuongs.splice(0, this.xaphuongs.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    e.preventDefault();
    const target = e.target;
    this.quanhuyen = target.value;
    if (this.quanhuyen !== '') {
      for (const xp in this.quanhuyens) {
        if (this.quanhuyens.hasOwnProperty(xp)) {
          if (this.quanhuyens[xp].name === this.quanhuyen) {
            this.arrxaphuong.push(this.quanhuyens[xp].wards);
            for (const arr2 in this.arrxaphuong[0]) {
              if (this.arrxaphuong[0].hasOwnProperty(arr2)) {
                this.xaphuongs.push(this.arrxaphuong[0][arr2]);
              }
            }
          }
        }
      }
    } else {
      this.xaphuongs.splice(0, this.xaphuongs.length);
    }
  }
  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.UnChecked();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
    this.RandomMatKhau();
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.nhanvien = new NhanVienModel();
    // Gán giá trị rỗng ban đầu cho giới tính
    this.nhanvien.Gioi_tinh = '';
    // Gán giá trị rỗng ban đầu cho địa chỉ
    this.nhanvien.Dia_chi = { Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: '' };
    // Gán giá trị mật khẩu bằng chuỗi random khi vừa load form đăng ký
    this.nhanvien.Mat_khau = this.text;
    this.nhanvien.Quyen_su_dung = 'Nhân viên';
  }

  // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, nhanvienUpdate) {
    this.UnChecked();
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false, size: 'lg' });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.nhanvien = new NhanVienModel();
    nhanvienUpdate.Ngay_sinh = this.datePipe.transform(nhanvienUpdate.Ngay_sinh, 'yyyy-MM-dd');
    this.nhanvien = nhanvienUpdate;
    this.nhanvien.Dia_chi = nhanvienUpdate.Dia_chi[0];
    // document.getElementById('errNgaySinh').style.display = 'none'
    this.ThanhPho(null, this.nhanvien.Dia_chi);

  }

  // Hàm mở Dialog gửi mail
  open_send_mail(content_mails, nv?) {
    this.dsNguoiNhanMail = [];
    this.modalService.open(content_mails, { ariaLabelledBy: 'modal-basic-title-mails', backdrop: 'static', keyboard: false, size: 'lg' });
    if (nv === null) {
      this.NhanVienChecked();
      this.ThongTinGuiEmail();
      for (const email in this.ThongTinGuiEmailTaiKhoan) {
        if (this.ThongTinGuiEmailTaiKhoan.hasOwnProperty(email)) {
          this.dsNguoiNhanMail.push({
            Email: this.ThongTinGuiEmailTaiKhoan[email].Email,
            Ho_ten: this.ThongTinGuiEmailTaiKhoan[email].Ho_ten
          });
        }
      }
    } else {
      this.UnChecked();
      this.ThongTinGuiEmailTaiKhoan = [];
      this.ThongTinGuiEmailTaiKhoan.push({ Ho_ten: nv.Ho_ten, Email: nv.Email, Mat_khau: nv.Mat_khau, Nhan_vien_id: nv.Nhan_vien_id });
      this.dsNguoiNhanMail.push({ Email: nv.Email, Ho_ten: nv.Ho_ten });
    }

  }

  // Hàm mở Dialog thêm email cần gửi
  open_info_mail_plus(content_info_mail_plus) {
    this.tai_khoan = '';
    this.chu_tai_khoan = '';
    this.noi_dung = '';
    this.chu_de = '';
    this.modalService.open(content_info_mail_plus, {
      ariaLabelledBy: 'modal-basic-title-info-mail-plus',
      backdrop: 'static', keyboard: false
    });
  }

  // Hàm thêm email
  ThemMail(content_mails) {
    this.dsNguoiNhanMail.push({ Email: this.tai_khoan, Ho_ten: this.chu_tai_khoan });
    this.modalService.dismissAll();
    this.modalService.open(content_mails, { ariaLabelledBy: 'modal-basic-title-mails', backdrop: 'static', keyboard: false, size: 'lg' });
  }

  // Xoá email ra khỏi danh sách gửi
  xoa_email(nv) {
    // console.log(nv)
    for (let i in this.dsNguoiNhanMail) {
      if (this.dsNguoiNhanMail[i].Email === nv.Email) {
        this.dsNguoiNhanMail.splice(Number.parseInt(i), 1);
      }
    }
    // console.log(this.dsNguoiNhanMail)
  }

  // Đóng dialog
  DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }

  // Hàm mở Dialog Xác nhận xóa tài khoản
  open_delete(content_delete, Nhan_vien_id?) {
    if (Nhan_vien_id != null) {
      this.UnChecked();
      this.nhanvienID = Nhan_vien_id;
      this.flag = false;
    } else {
      this.flag = true;
    }
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

  }

  // Thực hiện xóa sau khi xác nhận Dialog
  XacNhan() {
    if (this.flag === true) {
      this.XoaNhieuNhanVien();
    } else {
      this.XoaNhanVien(this.nhanvienID);
    }
    this.modalService.dismissAll();
  }

  // Bỏ chọn tất cả checkbox
  UnChecked() {
    this.checkAll = true
    this.KTCheckedAll()
  }

  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.lengthdsnhanvien; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.lengthdsnhanvien; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }

  // Hàm kiểm tra checked tại các item
  KTChecked(i: string) {
    this.lengthchecked = 0;
    this.checked[i] = !this.checked[i];
    if (this.checkAll) {
      this.checkAll = false;
    }

    // Kiểm tra có checkbox nào được check hay không, nếu có thì hiển thị divbutton
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt]) {
          this.lengthchecked += 1;
          document.getElementById('divbutton').style.display = 'block';
          // break;
        } else {
          document.getElementById('divbutton').style.display = 'none';
        }
      }
    }
    // Nếu các checkbox đều được check thì checbox chechkAll cũng được check
    if (this.lengthchecked === this.checked.length) {
      this.checkAll = true;
    }
    // Mở divbutton khi có checkbox được check
    if (this.lengthchecked > 0) {
      document.getElementById('divbutton').style.display = 'block';

    }
  }


  // Hàm thực hiện thêm tài khoản nhân viên
  ThemNhanVien() {
    this.ThongTinGuiEmailTaiKhoan = [];
    this.nhanvien.Quyen_su_dung = this.QuyenSuDung;
    this.nhanvien.Mat_khau = this.text;

    this.NVService.ThemNhanVien(this.nhanvien).subscribe(data_them => {
      if (JSON.stringify(data_them) === '"Tạo tài khoản thành công!"') {
        this.ThongTinGuiEmailTaiKhoan.push({
          Nhan_vien_id: this.nhanvien.Nhan_vien_id, Email: this.nhanvien.Email,
          Ho_ten: this.nhanvien.Ho_ten, Mat_khau: this.nhanvien.Mat_khau
        });
        // Gửi email thông tin về tài khoản a tạo cho nhân viên  vừ
        this.GuiMailNhanVien(this.ThongTinGuiEmailTaiKhoan);
        this.modalService.dismissAll()
      }
      else {
        window.alert(data_them);
      }
    });
    // }
  }

  // Hàm thực hiện xóa nhân viên
  XoaNhanVien(Nhan_vien_id: string) {
    this.NVService.XoaNhanVien(Nhan_vien_id).subscribe(data_xoa => {
      this.modalService.dismissAll()
    });
  }

  // Hàm xóa nhiều nhân viên
  XoaNhieuNhanVien() {
    this.NhanVienChecked();
    this.NVService.XoaNhieuNhanVien(this.arrNhanVienID).subscribe(data_xoanhieunv => {
      if (JSON.stringify(data_xoanhieunv) === '"Xóa tài khoản nhân viên thành công!"') {
        //this.DongModal();
        // location.reload();
       this.modalService.dismissAll();
      } else {
        window.alert(data_xoanhieunv);
      }
    });
  }

  // Hàm thực hiện cập nhật thông tin nhân viên
  CapNhatNhanVien() {
    const nv = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.nhanvien.Quyen_su_dung = this.QuyenSuDung;

    this.NVService.CapNhatNhanVien(this.nhanvien).subscribe(data_capnhat => {
      if (JSON.stringify(data_capnhat) === '"Cập nhật nhân viên thành công!"') {
        if (nv.Nhan_vien_id === this.nhanvien.Nhan_vien_id) {
          localStorage.setItem('loggedInAcount', JSON.stringify(this.nhanvien));
        }
        this.modalService.dismissAll();
      } else {
        window.alert(data_capnhat);
      }
    });
    // }
  }

  // Mãng nhân viên được check
  NhanVienChecked() {
    this.arrNhanVienID = [];
    this.arrMatKhauNV = [];
    this.arrTenNV = [];
    this.arrEmailNV = [];
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt] === true) {
          this.arrEmailNV.push(this.dsnhanvien[kt].Email);
          this.arrNhanVienID.push(this.dsnhanvien[kt].Nhan_vien_id);
          this.arrMatKhauNV.push(this.dsnhanvien[kt].Mat_khau);
          this.arrTenNV.push(this.dsnhanvien[kt].Ho_ten);
        }
      }
    }
  }

  // Gộp thông tin của từng nhân viên để gửi email
  ThongTinGuiEmail() {
    this.ThongTinGuiEmailTaiKhoan = [];

    const sl = this.arrEmailNV.length;

    for (let i = 0; i < sl; i++) {
      this.ThongTinGuiEmailTaiKhoan.push({
        Ho_ten: this.arrTenNV[i], Mat_khau: this.arrMatKhauNV[i],
        Nhan_vien_id: this.arrNhanVienID[i], Email: this.arrEmailNV[i]
      });
    }
    // console.log(this.ThongTinGuiEmailTaiKhoan);
  }

  // Gửi email cho nhiều nhân viên
  GuiMailNhanVien(nv) {
    this.NVService.GuiEmailTaiKhoan(this.ThongTinGuiEmailTaiKhoan).subscribe();
  }

  GuiMail() {
    if (this.chu_de === '' || this.noi_dung === '') {
      window.alert('Hãy nhập đầy đủ thông tin!');
    }
    else {
      this.NVService.GuiEmailNhanVien(this.dsNguoiNhanMail, this.noi_dung, this.chu_de).subscribe();
      this.modalService.dismissAll()
      this.chu_de = ''
      this.noi_dung = ''
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
  SearchByKeyWord() {
    this.nhanviens = this.dsnhanviensearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdsnhanvien();
    } else {
      this.nhanviens = this.nhanviens.filter(res => {
        const hoten = this.removeAccents(res.Ho_ten);
        const maso = this.removeAccents(res.Nhan_vien_id);
        const tmp2 = text.replace(/·/g, '');
        if (hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });
    }
    this.DiaChi()
  }

  SearchByOption(value) {
    this.nhanviens = this.dsnhanviensearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'Tất cả' || target === 'Cũ nhất') {
      this.getdsnhanvien();
    } else {
      if (target === 'Mới nhất') {
        this.nhanviens.reverse();
      } else {
        const text = this.removeAccents(target);
        this.nhanviens = this.dsnhanviensearch.filter(res => {
          const gioitinh = this.removeAccents(res.Gioi_tinh);
          return gioitinh.match(text);
        });
      }
     this.DiaChi()
    }
  }

  KiemTraNgaySinh(ngaysinh) {
    if ((new Date(ngaysinh).getTime() > new Date().getTime())) {
      document.getElementById('errNgaySinh2').style.display = 'block'
      document.getElementById('errNgaySinh3').style.display = 'none'

      return false
    } else {
      if ((new Date().getFullYear() - new Date(ngaysinh).getFullYear()) < 18){
        document.getElementById('errNgaySinh2').style.display = 'none'
        document.getElementById('errNgaySinh3').style.display = 'block'
        return false
      }else{
        document.getElementById('errNgaySinh2').style.display = 'none'
        document.getElementById('errNgaySinh3').style.display = 'none'
        return true
      }
     
    }

  }

  HienThiMa() {
    this.hienthi = true
    document.getElementById('AnMa').style.display = 'block'
    document.getElementById('HienThiMa').style.display = 'none'
  }

  AnMa() {
    this.hienthi = false
    document.getElementById('AnMa').style.display = 'none'
    document.getElementById('HienThiMa').style.display = 'block'

  }

  DiaChi(){
    this.dsdiachi = []
    this.arrdiachi = []
    for (const nhanvien in this.nhanviens) {
      if (this.nhanviens.hasOwnProperty(nhanvien)) {
        this.dsdiachi.push(this.nhanviens[nhanvien].Dia_chi);
      }
    }

    for (const dc in this.dsdiachi) {
      if (this.dsdiachi.hasOwnProperty(dc)) {
        this.arrdiachi.push(this.dsdiachi[dc][0]);
      }
    }
  }

  ChuyenTrang(number) {
    this.nhanviens = []
    // this.dsdiachi = []
    // this.arrdiachi = []
    this.checked = []
    for (let i = 0; i < 10; i++) {
      if ((this.dsnhanvien[((number - 1) * 10) + i]) !== undefined) {
        this.nhanviens.push(this.dsnhanvien[((number - 1) * 10) + i]);
      }
    }
    this.UnChecked()
    this.DiaChi()
    // Thiết lập mảng giá trị checked = false cho các đối tượng
    for (const length in this.nhanviens) {
      if (this.nhanviens.hasOwnProperty(length)) {
        this.checked.push(false);
      }
    }
  }

}

