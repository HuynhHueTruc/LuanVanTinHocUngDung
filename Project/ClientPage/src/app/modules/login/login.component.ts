import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { KhachHangModel } from './../../../models/KhachHang/khachhang';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { KhachhangService } from './../../../services/KhachHang/khachhang.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaChiDKModle } from 'src/models/DiaChi/Diachi_DK';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private KHService: KhachhangService, private diachiService: DiachiService,
    private route: ActivatedRoute, private router: Router, private giohangService: GiohangService, private loaicayService: LoaicayService) { }

  khachhang: KhachHangModel;

  errorMessage = '';
  // Tạo item Địa chỉ
  thanhphos: DiaChiModel[] = [];
  quanhuyens: QuanHuyenModel[] = [];
  arrquanhuyen1: QuanHuyenModel[] = [];
  xaphuongs: XaPhuongModel[] = [];
  arrxaphuong: XaPhuongModel[] = [];
  diachi: DiaChiDKModle[] = [];
  account: KhachHangModel[] = [];
  dsloaicay: LoaiCayModel
  dt: any;
  gioitinh: string;
  thanhpho: string;
  quanhuyen: string;
  checkboxstate = false;
  mat_khau_moi = null;
  xac_nhan_mat_khau_moi = null;
  max_length = 32;
  min_length = 8;
  KiemTraThongTin = false;
  so_thich = []
  dropdownSettings: IDropdownSettings;

  ngOnInit(): void {

    this.geteachDiaDiem();
    this.getloaicay();
    this.khachhang = new KhachHangModel();

    this.khachhang.Dia_chi = { Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: '' };
    this.khachhang.Gioi_tinh = '';
    this.khachhang.So_thich = [{ Loai_cay: '' }]

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

  getloaicay() {
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays
    })
  }

   //Chọn nhiều phần tử trong thẻ select
   onItemSelect(item: any) {
    // i = 0 là tạo mới, = 1 là cập nhật
      document.getElementById('errTaoMoi').style.display = 'none'
  }

  onSelectAll(items: any) {
    this.so_thich = items
      document.getElementById('errTaoMoi').style.display = 'none'
  }

  onDeSelectAll(items: any) {
    this.so_thich = items

      document.getElementById('errTaoMoi').style.display = 'block'
  }

  onItemDeSelect(item: any) {
    if (this.so_thich.length === 0){
      document.getElementById('errTaoMoi').style.display = 'block'

    }
  }


  //  Select Giơis tính
  public GioiTinh(event) {
    event.preventDefault();
    const target = event.target;
    // console.log(target.value);
    this.gioitinh = target.value;
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

      document.getElementById('mes_tinh_thanhpho').style.display = 'none';
      e.preventDefault();
      const target = e.target;
      this.thanhpho = target.value;

      document.getElementById('mes_huyen_quan').style.display = 'block';
      document.getElementById('mes_xa_phuong').style.display = 'block';

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
    if (evt === null) {
      document.getElementById('mes_xa_phuong').style.display = 'none';

    } else {
      document.getElementById('mes_xa_phuong').style.display = 'block';
      this.khachhang.Dia_chi.Xa_Phuong = '';
    }

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
    // console.log(this.xaphuongs)
    this.KiemTraDiaChiUpdate();
    // console.log(this.quanhuyens);
  }

  KiemTraDiaChiUpdate() {
    if (this.khachhang.Dia_chi.Huyen_Quan !== '') {
      document.getElementById('mes_huyen_quan').style.display = 'none';
    } else {
      this.khachhang.Dia_chi.Xa_Phuong = '';
      document.getElementById('mes_huyen_quan').style.display = 'block';
      document.getElementById('mes_xa_phuong').style.display = 'block';

    }
  }
  // Hàm hiển thị quận huyện tương ứng thành phố + kiểm tra đã chọn quận huyện chưa
  QuanHuyen(e) {
    document.getElementById('mes_xa_phuong').style.display = 'block';
    this.xaphuongs.splice(0, this.xaphuongs.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    //  console.log(this.thanhpho);
    e.preventDefault();
    const target = e.target;
    // console.log(target.value);
    this.quanhuyen = target.value;
    // console.log(this.quanhuyen)
    if (this.quanhuyen !== '') {
      // console.log(this.quanhuyen)

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
      document.getElementById('mes_xa_phuong').style.display = 'block';

    }

    if (this.khachhang.Dia_chi.Huyen_Quan !== '') {
      document.getElementById('mes_huyen_quan').style.display = 'none';
    } else {
      document.getElementById('mes_huyen_quan').style.display = 'block';
    }
  }

  // Kiểm tra chọn xã phường
  XaPhuong(diachi?) {
    if (diachi === null) {
      if (this.khachhang.Dia_chi.Xa_Phuong !== '') {
        document.getElementById('mes_xa_phuong').style.display = 'none';
      } else {
        document.getElementById('mes_xa_phuong').style.display = 'block';
      }
    } else {
      if (this.khachhang.Dia_chi.Xa_Phuong !== '') {
        document.getElementById('mes_xa_phuong').style.display = 'none';
      } else {
        document.getElementById('mes_xa_phuong').style.display = 'block';
      }
    }

  }

  // Hàm xử lý sự kiện submit trên frontend
  LoginKhachHang(event) {
    event.preventDefault();
    const target = event.target;

    const Khach_hang_id = target.querySelector('#firstname').value;
    const Mat_khau = target.querySelector('#password1').value;

    this.KHService.DangNhapKhachHang(Khach_hang_id, btoa(Mat_khau)).subscribe(data => {
      if (data) {
        this.dt = data;
        // console.log(this.dt);
        // window.alert('Đăng nhập thành công!');
        this.router.navigate(['/default']);
        // Đăng nhập thành công thì setLoggedIn để báo đã đăng nhập rồi để thỏa điều kiện default_guard chuyển qua trang default
        this.KHService.setLoggedIn(true, this.dt);
      } else {
        // window.alert('Tài khoản không đúng!');
        this.errorMessage = 'Tài khoản hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại!';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    }, (err) => {
      this.errorMessage = err;
      setTimeout(() => this.errorMessage = '', 2000);
    });
  }

  DangKy(event) {
    this.khachhang.Mat_khau = this.mat_khau_moi;
    for (const i in this.so_thich) {

      this.khachhang.So_thich.push({ Loai_cay: this.so_thich[i]._id })
    }
    this.khachhang.So_thich.splice(0, 1)
    this.KTNull(this.khachhang);

    if (this.xac_nhan_mat_khau_moi === this.khachhang.Mat_khau) {
      if (this.KiemTraThongTin && this.KiemTraNgaySinh(this.khachhang.Ngay_sinh)) {
        this.KHService.ThemKhachHang(this.khachhang).subscribe(data_them => {
          if (JSON.stringify(data_them) === '"Tạo tài khoản thành công!"') {
            this.giohangService.ThemGioHang({ KhachHang_id: this.khachhang.Khach_hang_id }).subscribe()
            alert(data_them)

            location.reload();
          }
          else {
            window.alert(data_them);
          }
        });
      }
    } else {
      document.getElementById('err_khong_trung_mat_khau_moi').style.display = 'block';
    }
  }


  // Hàm kiểm tra thông tin
  KTNull(khachhang: KhachHangModel) {
    const hoten = khachhang.Ho_ten;
    const ngaysinh = khachhang.Ngay_sinh;
    const KHId = khachhang.Khach_hang_id;
    const diachi = khachhang.Dia_chi;
    const gioitinh = khachhang.Gioi_tinh;
    const sdt = khachhang.So_dien_thoai;
    const email = khachhang.Email;
    const cmnd = khachhang.CMND_CCCD;
    const matkhau = khachhang.Mat_khau;
    const sothich = khachhang.So_thich
    const thongtinkhachhang = [];
    thongtinkhachhang.push(hoten, ngaysinh, KHId, diachi.Tinh_ThanhPho, diachi.Huyen_Quan,
      diachi.Xa_Phuong, gioitinh, sdt, email, cmnd, matkhau);
    for (const i in thongtinkhachhang) {
      if (thongtinkhachhang.hasOwnProperty(i)) {
        if (thongtinkhachhang[i] === '' || thongtinkhachhang[i] === undefined || thongtinkhachhang[i] === null || sothich.length <= 0)  {
          window.alert('Hãy nhập đầy đủ thông tin!');
          this.KiemTraThongTin = false;
          break;
        } else {
          this.KiemTraThongTin = true;
        }
      }
    }
  }

  // Hàm lấy thông tin thành phố
  geteachDiaDiem() {
    this.diachiService.getListDiaChi().subscribe((res: any) => {
      this.thanhphos = res;
    });
  }

  An_HienMatKhau() {
    this.checkboxstate = !this.checkboxstate;
    if (this.checkboxstate) {
      document.getElementById('password1').setAttribute('type', 'text');
    } else {
      document.getElementById('password1').setAttribute('type', 'password');
    }
  }


  KiemTraNgaySinh(ngaysinh) {
    if ((new Date(ngaysinh).getTime() > new Date().getTime())) {
      document.getElementById('errNgaySinh2').style.display = 'block';
      document.getElementById('errNgaySinh').style.display = 'none';
      document.getElementById('errNgaySinh3').style.display = 'none'

      return false;
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
  // Bắt sự kiện chọn ngày
  ChangeDate(e) {
    e.preventDefault();
    const target = e.target;
    if (target.id === 'NgaySinh') {
      document.getElementById('errNgaySinh').style.display = 'none';
    }
    this.KiemTraNgaySinh(this.khachhang.Ngay_sinh);
  }

  KiemTraMatKhau() {
    if (this.mat_khau_moi !== null && this.xac_nhan_mat_khau_moi !== null) {
      if (this.mat_khau_moi.length >= this.min_length
        && this.xac_nhan_mat_khau_moi.length >= this.min_length) {
        const element = document.getElementById('Dang_ky') as HTMLInputElement;
        element.disabled = false;
      } else {
        const element = document.getElementById('Dang_ky') as HTMLInputElement;
        element.disabled = true;
      }
    } else {
      const element = document.getElementById('Dang_ky') as HTMLInputElement;
      element.disabled = true;
    }
  }

  // Hàm kiểm tra giá trị giới tính
  KTGioiTinh() {
    if (this.khachhang.Gioi_tinh !== '') {
      document.getElementById('mes_gioitinh').style.display = 'none';
    } else {
      document.getElementById('mes_gioitinh').style.display = 'block';

    }
  }
}
