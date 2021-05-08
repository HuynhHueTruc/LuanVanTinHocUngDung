import { Router } from '@angular/router';
import { NhanvienService } from './../../../services/NhanVien/nhanvien.service';
import { NhanVienModel } from './../../../models/NhanVien/nhanvien';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  diachiEmail: any;
  nhanvien: NhanVienModel;
  datalogin: any;
  dsnhanvien: NhanVienModel;
  key: string;
  mat_khau_moi = null;
  xac_nhan_mat_khau_moi = null;
  constructor(private NVService: NhanvienService, private router: Router) { }

  ngOnInit(): void {
    this.nhanvien = new NhanVienModel();

    if (this.NVService.isLoggedIn){
      this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
      this.nhanvien = this.datalogin;
    }
    this.getdsnhanvien();
  }

  getdsnhanvien(){
    this.NVService.getListNhanVien().subscribe((res: any) => {
      this.dsnhanvien = res.nhanviens
    })
  }

  // Kiểm tra Email có đúng không
  XacNhanEmail(){
    if (this.NVService.isLoggedIn){
      if (this.diachiEmail === this.datalogin.Email){
        document.getElementById('code').style.display = 'block';
        document.getElementById('emailaddress').style.display = 'none';
        // this.NVService.GuiEmailLayOTP(this.nhanvien).subscribe();
        this.LayMaXacNhan();

      }else {
        document.getElementById('err_addressmail').style.display = 'block';
      }
    }else{
      for (const i in this.dsnhanvien){
        if (this.diachiEmail === this.dsnhanvien[i].Email){
          this.nhanvien = this.dsnhanvien[i]
          document.getElementById('code').style.display = 'block';
          document.getElementById('emailaddress').style.display = 'none';
          // this.NVService.GuiEmailLayOTP(this.nhanvien).subscribe();
          this.LayMaXacNhan();

        }else {
          document.getElementById('err_addressmail').style.display = 'block';
        }
      }
    }


  }
 // Hàm nhận về chuỗi OTP người dùng nhập
  onOtpChange(e){
    this.key = e;
    if (this.key.length  === 6){
      const element =  document.getElementById('buttonxacnhan') as HTMLInputElement;
        element.disabled = false;
    } else {
      const element =  document.getElementById('buttonxacnhan') as HTMLInputElement;
        element.disabled = true;
    }
  }

  // Hàm xử lý khi click button
  LayMaXacNhan(){
    this.NVService.GetOTP(this.nhanvien).subscribe( dt => {
      const data = dt;
      // const tmp = JSON.stringify(dt);
      // const data = JSON.parse(tmp);
      if (this.NVService.isLoggedIn){
        localStorage.setItem('loggedInAcount', JSON.stringify(data));
      }
      document.getElementById('title-forgot').style.display = 'none';
      document.getElementById('sub-title-forgot').style.display = 'none';
      document.getElementById('Xac_nhan').style.display = 'none';
      document.getElementById('Xac_nhan_OTP').style.display = 'block';
    })
  }

  GuiLaiMa(){
    this.LayMaXacNhan();
  }

  // Kiểm tra Secret Key
  XacNhanKey(){
    this.NVService.TimKiemNhanVien(this.nhanvien).subscribe(dt => {
      if (dt.toString() !== this.key || this.key === undefined){
      document.getElementById('err_secretkey').style.display = 'block';

    }else {
      document.getElementById('code').style.display = 'none';
      document.getElementById('Xac_nhan_OTP').style.display = 'none';
      document.getElementById('Doi_mat_khau').style.display = 'block';
      document.getElementById('new_password').style.display = 'block';
      document.getElementById('confirm_password').style.display = 'block';
    }
    })
  }

  KiemTraMatKhau(){
    if ( this.mat_khau_moi !== null && this.xac_nhan_mat_khau_moi !== null){
      if ( this.mat_khau_moi.length >= 8 && this.xac_nhan_mat_khau_moi.length >= 8){
        const element =  document.getElementById('xac_nhan') as HTMLInputElement;
        element.disabled = false;
      }else {
        const element =  document.getElementById('xac_nhan') as HTMLInputElement;
        element.disabled = true;
      }
    }else {
      const element =  document.getElementById('xac_nhan') as HTMLInputElement;
      element.disabled = true;
  }
  }

  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
removeAccents(str) {
  if (str === null){
    return;
  }else{
    return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    ;
  }
}
// Kiểm tra Tiếng Việt
KiemTraUniCode(){
  const KTUnicode_Mat_khau_moi = this.removeAccents(this.mat_khau_moi);
  const KTUnicode_xac_nhan_mat_khau = this.removeAccents(this.xac_nhan_mat_khau_moi);

  if (this.xac_nhan_mat_khau_moi !== null){
    if (KTUnicode_xac_nhan_mat_khau !== this.xac_nhan_mat_khau_moi){
      document.getElementById('err_xac_nhan_mat_khau').style.display = 'block';
    }else{
        document.getElementById('err_xac_nhan_mat_khau').style.display = 'none';
    }
  }

  if (this.mat_khau_moi !== null){
    if (KTUnicode_Mat_khau_moi !== this.mat_khau_moi){
      document.getElementById('err_mat_khau_moi').style.display = 'block';
      return false;
    }else{
        document.getElementById('err_mat_khau_moi').style.display = 'none';
        return true;
    }
  }
}

 // Hàm hiển thị password
 HienThiPass(idevent){
  if (idevent === 'hien_mat_khau_moi'){
    document.getElementById('an_mat_khau_moi').style.display = 'none';
    document.getElementById('hien_mat_khau_moi').style.display = 'block';
    document.getElementById('new_password2').setAttribute('type', 'text');
  }

  if (idevent === 'hien_xac_nhan_mat_khau'){
    document.getElementById('an_xac_nhan_mat_khau').style.display = 'none';
    document.getElementById('hien_xac_nhan_mat_khau').style.display = 'block';
    document.getElementById('confirm_password2').setAttribute('type', 'text');
  }
}

// Hàm ẩn password
AnPass(idevent){
  if (idevent === 'an_mat_khau_moi'){
    document.getElementById('an_mat_khau_moi').style.display = 'block';
    document.getElementById('hien_mat_khau_moi').style.display = 'none';
    document.getElementById('new_password2').setAttribute('type', 'password');
  }

  if (idevent === 'an_xac_nhan_mat_khau'){
    document.getElementById('an_xac_nhan_mat_khau').style.display = 'block';
    document.getElementById('hien_xac_nhan_mat_khau').style.display = 'none';
    document.getElementById('confirm_password2').setAttribute('type', 'password');
  }
}

  // HÀm đổi mật khẩu
  DoiMatKhau(){
    if (this.KiemTraUniCode()){
      if (this.XacNhanMatKhauMoi()){
        this.nhanvien.Mat_khau = this.mat_khau_moi;
        this.NVService.CapNhatNhanVien(this.nhanvien).subscribe(data_capnhat => {

            window.alert('Thay đổi mật khẩu thành công!');
            if (this.NVService.isLoggedIn){
              localStorage.setItem('loggedInAcount', JSON.stringify(this.datalogin));
              this.router.navigateByUrl('/default')
            }else{
              this.router.navigateByUrl('/login')
            }

          });
      }
    }


  }

  XacNhanMatKhauMoi(){
    if (this.mat_khau_moi === this.xac_nhan_mat_khau_moi){

      document.getElementById('err_khong_trung_mat_khau_moi').style.display = 'none';

      this.nhanvien.Mat_khau = this.mat_khau_moi;
      return true;

    }else{
      document.getElementById('err_khong_trung_mat_khau_moi').style.display = 'block';
      return false;
    }
  }
}
