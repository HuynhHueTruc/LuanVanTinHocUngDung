import { Component, OnInit } from '@angular/core';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { DiaChiDKModle } from './../../../models/DiaChi/Diachi_DK';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { NhanVienModel } from './../../../models/NhanVien/nhanvien';
import { NhanvienService } from './../../../services/NhanVien/nhanvien.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  datalogin: any;
  // Chứa thông tin được nhập vào trong form đăng ký
  nhanvien: NhanVienModel;
  KiemTraThongTin = false;

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

  constructor(private NVService: NhanvienService, private diachiService: DiachiService) { }

  ngOnInit(): void {
    this.NVService.getRefeshPage().subscribe(() => {
      this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
      this.nhanvien = new NhanVienModel();
      this.nhanvien = this.datalogin;
      this.nhanvien.Dia_chi = this.datalogin.Dia_chi;
      this.geteachDiaDiem();

    })
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.nhanvien = new NhanVienModel();
    this.nhanvien = this.datalogin;
    this.nhanvien.Dia_chi = this.datalogin.Dia_chi;
    console.log(this.nhanvien.Dia_chi)
    this.geteachDiaDiem();
  }

  // Hàm lấy thông tin thành phố
  geteachDiaDiem() {
    this.diachiService.getListDiaChi().subscribe((res: any) => {
      this.thanhphos = res;
      this.ThanhPho(null, this.nhanvien.Dia_chi);

    });
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
    this.nhanvien.Dia_chi.Xa_Phuong = '';
  }
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
  this.KiemTraDiaChiUpdate();
}

KiemTraDiaChiUpdate() {
  if (this.nhanvien.Dia_chi.Huyen_Quan !== '') {
    document.getElementById('mes_huyen_quan').style.display = 'none';
  } else {
    this.nhanvien.Dia_chi.Xa_Phuong = '';
    document.getElementById('mes_huyen_quan').style.display = 'block';
    document.getElementById('mes_xa_phuong').style.display = 'block';
  }
}

// Hàm hiển thị quận huyện tương ứng thành phố + kiểm tra đã chọn quận huyện chưa
QuanHuyen(e) {
  document.getElementById('mes_xa_phuong').style.display = 'block';
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
    document.getElementById('mes_xa_phuong').style.display = 'block';
  }

  if (this.nhanvien.Dia_chi.Huyen_Quan !== '') {
    document.getElementById('mes_huyen_quan').style.display = 'none';
  } else {
    document.getElementById('mes_huyen_quan').style.display = 'block';
  }
}

// Kiểm tra chọn xã phường
XaPhuong(diachi?) {
  if (diachi === null) {
    if (this.nhanvien.Dia_chi.Xa_Phuong !== '') {
      document.getElementById('mes_xa_phuong').style.display = 'none';
    } else {
      document.getElementById('mes_xa_phuong').style.display = 'block';
    }
  } else {
    if (this.nhanvien.Dia_chi.Xa_Phuong !== '') {
      document.getElementById('mes_xa_phuong').style.display = 'none';
    } else {
      document.getElementById('mes_xa_phuong').style.display = 'block';
    }
  }
}


  KTNull(nhanvien: NhanVienModel) {
    const hoten = nhanvien.Ho_ten;
    const diachi = nhanvien.Dia_chi;
    const gioitinh = nhanvien.Gioi_tinh;
    const sdt = nhanvien.So_dien_thoai;
    const email = nhanvien.Email;
    const cmnd = nhanvien.CMND_CCCD;
    const thongtinnhanvien = [];
    thongtinnhanvien.push(hoten, diachi.Tinh_ThanhPho, diachi.Huyen_Quan,
      diachi.Xa_Phuong, gioitinh, sdt, email, cmnd);
    for (const i in thongtinnhanvien) {
      if (thongtinnhanvien.hasOwnProperty(i)) {
        if (thongtinnhanvien[i] === '') {
          window.alert('Hãy nhập đầy đủ thông tin!');
          this.KiemTraThongTin = false;
          break;
        } else {
          this.KiemTraThongTin = true;
        }
      }
    }
  }

  LuuThayDoi() {
    this.KTNull(this.nhanvien);
    if (this.KiemTraThongTin) {
      this.datalogin = this.nhanvien;
      localStorage.setItem('loggedInAcount', JSON.stringify(this.datalogin));
      this.NVService.CapNhatNhanVien(this.nhanvien).subscribe(data_capnhat => {
        if (JSON.stringify(data_capnhat) === '"Cập nhật nhân viên thành công!"') {
        } else {
          window.alert(data_capnhat);
          this.nhanvien.Dia_chi = this.nhanvien.Dia_chi[0];
        }
      });
    }
  }

  Huy() {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.nhanvien = new NhanVienModel();
    this.nhanvien = this.datalogin;
    this.nhanvien.Dia_chi = this.datalogin.Dia_chi;
    this.ThanhPho(null, this.nhanvien.Dia_chi);
  }
}
