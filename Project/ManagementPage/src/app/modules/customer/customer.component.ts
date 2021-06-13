import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { KhachhangService } from './../../../services/KhachHang/khachhang.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiaChiDKModle } from './../../../models/DiaChi/Diachi_DK';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NguoiNhanModel } from './../../../models/KhachHang/nguoinhan';
import { ThongTinTaiKhoanEmailModel } from './../../../models/KhachHang/thongtinemail';
import { KhachHangModel } from './../../../models/KhachHang/khachhang';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  // Chứa thông tin được nhập vào trong form đăng ký
  khachhang: KhachHangModel;
  flag = false;
  // Chứa mật khẩu được random
  text = '';
  checkAll = false;
  KiemTraThongTin = false;
  lengthchecked = 0;
  // Mãng ID khachhang, mãng mật khẩu, mãng tên khachhang, mãng email khachhang được check để xóa và gửi email
  arrKhachHangID = [];
  arrMatKhauKH = [];
  arrTenKH = [];
  arrEmailKH = [];
  // Tạo Model Thông tin khách hàng để gửi Email sau khi tạo
  ThongTinGuiEmailTaiKhoan: ThongTinTaiKhoanEmailModel[] = [];
  // Tạo Model thông tin người nhận trong Dialog gửi mail
  NguoiNhanMail: NguoiNhanModel[] = [];
  dsNguoiNhanMail: NguoiNhanModel[] = [];
  dsloaicay: LoaiCayModel
  // Dùng cho Modal
  //  Biến lưu ID của đối tượng cần xác nhận xóa
  khachhangID: string;
  KhachHangFormGroup: FormGroup;

  // Trạng thái div chứa thông báo lỗi của giới tính
  display = 'block';

  // Chứa mảng các giá trị của từng checkbox
  checked = [];
  lengthdskhachhang = 0;

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
  dskhachhang: KhachHangModel[] = [];
  dskhachhangsearch: KhachHangModel[] = [];
  dsdiachi: DiaChiDKModle[] = [];
  arrdiachi: DiaChiDKModle[] = [];
  is_edit = false;
  so_thich = []
  dropdownSettings: IDropdownSettings;
  hienthi = false
  p: number = 1
  khachhangs: KhachHangModel[] = []
  // Đối tượng nhân viên update
  KhachHangUpdate: KhachHangModel[] = [];
  Ten_dang_nhap_pattern = "^[A-Za-z0-9 _-]{6,32}$"
  So_dien_thoai_pattern = "^0[0-9\s.-]{9}"
  CMND_pattern = "[0-9]{9,12}"
  email_pattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"

  constructor(private modalService: NgbModal, private KHService: KhachhangService, private diachiService: DiachiService, private datePipe: DatePipe, private giohangService: GiohangService,
    private loaicayService: LoaicayService, private formBuilder: FormBuilder,) { }

  form: FormGroup;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.email_pattern)]],
      // password: [null, Validators.required],
      // Ten_dang_nhap: [null, [Validators.required, Validators.pattern(this.Ten_dang_nhap_pattern)]],
      Ten_dang_nhap: ['', [Validators.required, Validators.pattern(this.Ten_dang_nhap_pattern)]],

      Ho_ten: ['', Validators.required],
      Ngay_sinh: ['', [Validators.required]],
      So_dien_thoai: ['', [Validators.required, Validators.pattern(this.So_dien_thoai_pattern)]],
      Gioi_tinh: ['', Validators.required],
      CMND_CCCD: ['', [Validators.required, Validators.pattern(this.CMND_pattern)]],
      provinces: ['', [Validators.required]],
      districts: ['', [Validators.required]],
      ward: ['', [Validators.required]],
      // Mat_khau: ['', [Validators.required]],
      so_thich: ['', [Validators.required]]
    });
    this.KHService.getRefeshPage().subscribe(dt => {
      this.getdskhachhang();
    })
    this.getdskhachhang();
    this.geteachDiaDiem();
    this.getloaicay();
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'Ten_loai_cay',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // Hàm lấy danh sách khách hàng
  getdskhachhang() {
    // this.dsdiachi = []
    // this.arrdiachi = []
    this.KHService.getListKhachHang().subscribe((res: any) => {
      this.dskhachhang = res.khachhangs;
      // hỗ trợ searchbykeywword và searchbysex
      this.dskhachhangsearch = res.khachhangs;
      // Lưu độ dài của danh sách khách hàng để làm checkbox
      this.lengthdskhachhang = this.dskhachhang.length;
      if (this.khachhangs.length === 0) {
        this.p = 1
      }
      this.ChuyenTrang(this.p)
    });


  }

  getloaicay() {
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays
    })
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
      this.khachhang.Dia_chi.Huyen_Quan = '';
      this.khachhang.Dia_chi.Xa_Phuong = '';
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
    this.khachhang.Dia_chi.Xa_Phuong = '';
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
  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.khachhangs.length; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.khachhangs.length; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }
  // Bỏ chọn tất cả checkbox
  UnChecked() {
    this.checkAll = true
    this.KTCheckedAll()
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

  // Mãng khách hàng được check
  KhachHangChecked() {
    this.arrKhachHangID = [];
    this.arrMatKhauKH = [];
    this.arrTenKH = [];
    this.arrEmailKH = [];
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt] === true) {
          this.arrEmailKH.push(this.khachhangs[kt].Email);
          this.arrKhachHangID.push(this.khachhangs[kt].Khach_hang_id);
          this.arrMatKhauKH.push(this.khachhangs[kt].Mat_khau);
          this.arrTenKH.push(this.khachhangs[kt].Ho_ten);
        }
      }
    }
  }

  // Gộp thông tin của từng nhân viên để gửi email
  ThongTinGuiEmail() {
    this.ThongTinGuiEmailTaiKhoan = [];

    const sl = this.arrEmailKH.length;

    for (let i = 0; i < sl; i++) {
      this.ThongTinGuiEmailTaiKhoan.push({
        Ho_ten: this.arrTenKH[i], Mat_khau: this.arrMatKhauKH[i],
        Khach_hang_id: this.arrKhachHangID[i], Email: this.arrEmailKH[i]
      });
    }
    // console.log(this.ThongTinGuiEmailTaiKhoan);
  }

  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.UnChecked();
    this.so_thich = []
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
    this.RandomMatKhau();
    // Gán giá trị rỗng ban đầu cho khachhang, nếu không sẽ báo lỗi không đọc được undefine
    this.khachhang = new KhachHangModel();
    // Gán giá trị rỗng ban đầu cho giới tính
    this.khachhang.Gioi_tinh = '';
    // Gán giá trị rỗng ban đầu cho địa chỉ
    this.khachhang.Dia_chi = { Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: '' };
    this.khachhang.So_thich = [{ Loai_cay: '' }]
    // Gán giá trị mật khẩu bằng chuỗi random khi vừa load form đăng ký
    this.khachhang.Mat_khau = this.text;
  }

  // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, khachhangUpdate) {
    this.UnChecked();
    this.so_thich = []
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false, size: 'lg' });
    // Gán giá trị rỗng ban đầu cho khachang, nếu không sẽ báo lỗi không đọc được undefine
    this.khachhang = new KhachHangModel();
    khachhangUpdate.Ngay_sinh = this.datePipe.transform(khachhangUpdate.Ngay_sinh, 'yyyy-MM-dd');
    this.khachhang = khachhangUpdate;
    this.khachhang.Dia_chi = khachhangUpdate.Dia_chi[0];
    for (const i in this.dsloaicay) {
      for (const j in khachhangUpdate.So_thich) {
        if (this.dsloaicay[i]._id === khachhangUpdate.So_thich[j].Loai_cay) {
          this.so_thich.push(this.dsloaicay[i])
        }
      }
    }
    // this.so_thich = khachhangUpdate.So_thich
    this.ThanhPho(null, this.khachhang.Dia_chi);

  }

  // Hàm mở Dialog gửi mail
  open_send_mail(content_mails, kh?) {
    this.dsNguoiNhanMail = [];
    this.modalService.open(content_mails, { ariaLabelledBy: 'modal-basic-title-mails', backdrop: 'static', keyboard: false, size: 'lg' });
    if (kh === null) {
      this.KhachHangChecked();
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
      this.ThongTinGuiEmailTaiKhoan.push({ Ho_ten: kh.Ho_ten, Email: kh.Email, Mat_khau: kh.Mat_khau, Khach_hang_id: kh.Khach_hang_id });
      this.dsNguoiNhanMail.push({ Email: kh.Email, Ho_ten: kh.Ho_ten });
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

  // Hàm mở Dialog Xác nhận xóa tài khoản
  open_delete(content_delete, Khach_hang_id?) {
    if (Khach_hang_id != null) {
      this.UnChecked();
      this.khachhangID = Khach_hang_id;
      this.flag = false;
    } else {
      this.flag = true;
    }
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

  }

  // Hàm thêm email
  ThemMail(content_mails) {
    this.dsNguoiNhanMail.push({ Email: this.tai_khoan, Ho_ten: this.chu_tai_khoan });
    this.modalService.dismissAll();
    this.modalService.open(content_mails, { ariaLabelledBy: 'modal-basic-title-mails', backdrop: 'static', keyboard: false });
  }

  // Xoá email ra khỏi danh sách gửi
  xoa_email(kh) {
    for (let i in this.dsNguoiNhanMail) {
      if (this.dsNguoiNhanMail[i].Email === kh.Email) {
        this.dsNguoiNhanMail.splice(Number.parseInt(i), 1);
      }
    }
  }

  // Đóng dialog
  DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }

  // Thực hiện xóa sau khi xác nhận Dialog
  XacNhan() {
    if (this.flag === true) {
      this.XoaNhieuKhachHang();
    } else {
      this.XoaKhachHang(this.khachhangID);
    }
    this.modalService.dismissAll();
  }

 

  // Hàm thực hiện thêm tài khoản nhân viên
  ThemKhachHang() {
    try {
      this.ThongTinGuiEmailTaiKhoan = [];
      // let thongtin;
      this.khachhang.Mat_khau = this.text;
      for (const i in this.so_thich) {

        this.khachhang.So_thich.push({ Loai_cay: this.so_thich[i]._id })
      }
      this.khachhang.So_thich.splice(0, 1)
      // this.KTNull(this.khachhang);
      // if (this.KiemTraThongTin && this.KiemTraNgaySinh(this.khachhang.Ngay_sinh)) {
      this.KHService.ThemKhachHang(this.khachhang).subscribe(data_them => {
        if (JSON.stringify(data_them) === '"Tạo tài khoản thành công!"') {
          this.ThongTinGuiEmailTaiKhoan.push({
            Khach_hang_id: this.khachhang.Khach_hang_id, Email: this.khachhang.Email,
            Ho_ten: this.khachhang.Ho_ten, Mat_khau: this.khachhang.Mat_khau
          });
          // Tạo giỏ hàng
          this.giohangService.ThemGioHang({ KhachHang_id: this.khachhang.Khach_hang_id }).subscribe()

          this.GuiMailKhachHang(this.ThongTinGuiEmailTaiKhoan);
          alert(data_them)
          //  this.DongModal();
          this.modalService.dismissAll()
        }
        else {
          window.alert(data_them);
        }
      });
      // }

    } catch (error) {
      alert(error)
    }
  }

  // Hàm thực hiện xóa nhân viên
  XoaKhachHang(Khach_hang_id: string) {
    for (const i in this.khachhangs) {

      if (this.khachhangs[i].Khach_hang_id === Khach_hang_id) {
        this.khachhangs.splice(Number.parseInt(i), 1)
      }

    }
    this.KHService.XoaKhachHang(Khach_hang_id).subscribe(data_xoa => {
      this.giohangService.XoaGioHang(Khach_hang_id).subscribe()
    });
  }

  // Hàm xóa nhiều nhân viên
  XoaNhieuKhachHang() {
    this.KhachHangChecked();
    for (const i in this.khachhangs) {
      for (const j in this.arrKhachHangID) {
        if (this.khachhangs[i].Khach_hang_id === this.arrKhachHangID[j]) {
          this.khachhangs.splice(Number.parseInt(i), 1)
        }
      }
    }
    this.KHService.XoaNhieuKhachHang(this.arrKhachHangID).subscribe(data_xoanhieukh => {
      if (JSON.stringify(data_xoanhieukh) === '"Xóa tài khoản khách hàng thành công!"') {
        this.giohangService.XoaNhieuGioHang(this.arrKhachHangID).subscribe()
        this.KTCheckedAll()
        this.UnChecked()
        this.modalService.dismissAll()
      } else {
        window.alert(data_xoanhieukh);
      }
    });
  }

  // Hàm thực hiện cập nhật thông tin nhân viên
  CapNhatKhachHang() {
    // this.KTNull(this.khachhang);
    // if (this.KiemTraThongTin && this.KiemTraNgaySinh(this.khachhang.Ngay_sinh)) {
    this.KHService.CapNhatKhachHang(this.khachhang).subscribe(data_capnhat => {
      if (JSON.stringify(data_capnhat) === '"Cập nhật khách hàng thành công!"') {
        this.DongModal();
      } else {
        window.alert(data_capnhat);
      }
    });
    // }
  }

  // Gửi email cho nhiều nhân viên
  GuiMailKhachHang(kh) {
    this.KHService.GuiEmailTaiKhoan(this.ThongTinGuiEmailTaiKhoan).subscribe();
  }

  GuiMail() {
    if (this.chu_de === '' || this.noi_dung === '') {
      window.alert('Hãy nhập đầy đủ thông tin!');
    }
    else {
      // console.log(this.dsNguoiNhanMail)
      this.KHService.GuiEmailKhachHang(this.dsNguoiNhanMail, this.noi_dung, this.chu_de).subscribe();
      this.DongModal();
    }
  }

  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
  removeAccents(str) {
    console.log(str)
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      ;
  }
  // Hàm tìm kiếm theo tên hoặc id
  SearchByKeyWord() {
    this.khachhangs = this.dskhachhangsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdskhachhang();
    } else {
      this.khachhangs = this.khachhangs.filter(res => {
        const hoten = this.removeAccents(res.Ho_ten);
        const maso = this.removeAccents(res.Khach_hang_id);
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
    this.khachhangs = this.dskhachhangsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'Tất cả' || target === 'Cũ nhất') {
      this.getdskhachhang();
    } else {
      if (target === 'Mới nhất') {
        this.khachhangs.reverse();
      } else {
        const text = this.removeAccents(target);
        this.khachhangs = this.dskhachhangsearch.filter(res => {
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
    for (const khachhang in this.khachhangs) {
      if (this.khachhangs.hasOwnProperty(khachhang)) {
        this.dsdiachi.push(this.khachhangs[khachhang].Dia_chi);
      }
    }
    for (const dc in this.dsdiachi) {
      if (this.dsdiachi.hasOwnProperty(dc)) {
        this.arrdiachi.push(this.dsdiachi[dc][0]);
      }
    }
  }

  ChuyenTrang(number) {
    this.khachhangs = []
    // this.dsdiachi = []
    // this.arrdiachi = []
    this.checked = []
    for (let i = 0; i < 5; i++) {
      if ((this.dskhachhang[((number - 1) * 5) + i]) !== undefined) {
        this.khachhangs.push(this.dskhachhang[((number - 1) * 5) + i]);
      }
    }
    // Thiết lập mảng giá trị checked = false cho các đối tượng
    for (const length in this.khachhangs) {
      if (this.khachhangs.hasOwnProperty(length)) {
        this.checked.push(false);
      }
    }
    console.log(this.khachhangs)

    this.DiaChi()
   
    this.UnChecked()
  }
}
