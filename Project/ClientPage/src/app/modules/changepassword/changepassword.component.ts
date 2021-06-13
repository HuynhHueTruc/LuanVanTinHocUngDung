import { KhachhangService } from './../../../services/KhachHang/khachhang.service';
import { KhachHangModel } from './../../../models/KhachHang/khachhang';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DoiMatKhauModel } from './../../../models/KhachHang/doimatkhau';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  khachhang: KhachHangModel;
  datalogin: any;

  mat_khau_cu = null;
  mat_khau_moi = null;
  xac_nhan_mat_khau_moi = null;
  max_length = 32;
  min_length = 8;
  KiemTraMK: DoiMatKhauModel[] = [];
  constructor(private KHService: KhachhangService) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.khachhang = new KhachHangModel();
    this.khachhang = this.datalogin;


  }

  KiemTraMatKhau() {
    if (this.mat_khau_cu !== null && this.mat_khau_moi !== null && this.xac_nhan_mat_khau_moi !== null) {
      if (this.mat_khau_cu.length >= this.min_length && this.mat_khau_moi.length >= this.min_length
        && this.xac_nhan_mat_khau_moi.length >= this.min_length) {
        const element = document.getElementById('xac_nhan') as HTMLInputElement;
        element.disabled = false;
      } else {
        const element = document.getElementById('xac_nhan') as HTMLInputElement;
        element.disabled = true;
      }
    } else {
      const element = document.getElementById('xac_nhan') as HTMLInputElement;
      element.disabled = true;
    }
  }

  // Hàm hiển thị password
  HienThiPass(idevent) {
    if (idevent === 'hien_mat_khau_cu') {
      document.getElementById('an_mat_khau_cu').style.display = 'none';
      document.getElementById('hien_mat_khau_cu').style.display = 'block';
      document.getElementById('Mat_khau_cu').setAttribute('type', 'text');
    }

    if (idevent === 'hien_mat_khau_moi') {
      document.getElementById('an_mat_khau_moi').style.display = 'none';
      document.getElementById('hien_mat_khau_moi').style.display = 'block';
      document.getElementById('Mat_khau_moi').setAttribute('type', 'text');
    }

    if (idevent === 'hien_xac_nhan_mat_khau') {
      document.getElementById('an_xac_nhan_mat_khau').style.display = 'none';
      document.getElementById('hien_xac_nhan_mat_khau').style.display = 'block';
      document.getElementById('Xac_nhan_mat_khau').setAttribute('type', 'text');
    }
  }

  // Hàm ẩn password
  AnPass(idevent) {
    if (idevent === 'an_mat_khau_cu') {
      document.getElementById('an_mat_khau_cu').style.display = 'block';
      document.getElementById('hien_mat_khau_cu').style.display = 'none';
      document.getElementById('Mat_khau_cu').setAttribute('type', 'password');
    }

    if (idevent === 'an_mat_khau_moi') {
      document.getElementById('an_mat_khau_moi').style.display = 'block';
      document.getElementById('hien_mat_khau_moi').style.display = 'none';
      document.getElementById('Mat_khau_moi').setAttribute('type', 'password');
    }

    if (idevent === 'an_xac_nhan_mat_khau') {
      document.getElementById('an_xac_nhan_mat_khau').style.display = 'block';
      document.getElementById('hien_xac_nhan_mat_khau').style.display = 'none';
      document.getElementById('Xac_nhan_mat_khau').setAttribute('type', 'password');
    }
  }

  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
  removeAccents(str) {
    if (str === null) {
      return;
    } else {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        ;
    }
  }

  // HÀm đổi mật khẩu
  DoiMatKhau() {
    const mkc = JSON.parse(localStorage.getItem('loggedInAcount'));
    if (this.KiemTraUniCode()) {
      if (atob(mkc.Mat_khau) === this.mat_khau_cu) {

        document.getElementById('err_khong_trung_mat_khau_cu').style.display = 'none';

        if (this.XacNhanMatKhauMoi()) {
          this.khachhang.Mat_khau = btoa(this.mat_khau_moi);
          this.KHService.CapNhatKhachHang(this.khachhang).subscribe(data_capnhat => {

            if (JSON.stringify(data_capnhat) === '"Cập nhật khách hàng thành công!"') {
              localStorage.setItem('loggedInAcount', JSON.stringify(this.datalogin));
              window.alert('Thay đổi mật khẩu thành công!');
              location.reload();
            } else {
              window.alert(data_capnhat);
            }
          });
        }
      }
      else {
        document.getElementById('err_khong_trung_mat_khau_cu').style.display = 'block';
        this.XacNhanMatKhauMoi();
      }
    }

  }

  XacNhanMatKhauMoi() {
    if (this.mat_khau_moi === this.xac_nhan_mat_khau_moi) {

      document.getElementById('err_khong_trung_mat_khau_moi').style.display = 'none';

      this.khachhang.Mat_khau = btoa(this.mat_khau_moi);
      return true;

    } else {
      document.getElementById('err_khong_trung_mat_khau_moi').style.display = 'block';
      return false;
    }
  }

  KiemTraUniCode() {
    const KTUnicode_Mat_khau_cu = this.removeAccents(this.mat_khau_cu);
    const KTUnicode_Mat_khau_moi = this.removeAccents(this.mat_khau_moi);
    const KTUnicode_xac_nhan_mat_khau = this.removeAccents(this.xac_nhan_mat_khau_moi);

    if (this.mat_khau_cu !== null) {
      if (KTUnicode_Mat_khau_cu !== this.mat_khau_cu) {
        document.getElementById('err_mat_khau_cu').style.display = 'block';
      } else {
        document.getElementById('err_mat_khau_cu').style.display = 'none';
      }
    }


    if (this.xac_nhan_mat_khau_moi !== null) {
      if (KTUnicode_xac_nhan_mat_khau !== this.xac_nhan_mat_khau_moi) {
        document.getElementById('err_xac_nhan_mat_khau').style.display = 'block';
      } else {
        document.getElementById('err_xac_nhan_mat_khau').style.display = 'none';
      }
    }

    if (this.mat_khau_moi !== null) {
      if (KTUnicode_Mat_khau_moi !== this.mat_khau_moi) {
        document.getElementById('err_mat_khau_moi').style.display = 'block';
        return false;
      } else {
        document.getElementById('err_mat_khau_moi').style.display = 'none';
        return true;
      }
    }
  }

}
