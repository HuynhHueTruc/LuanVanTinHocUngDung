import { NhanvienService } from './../../../services/NhanVien/nhanvien.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  tendangnhap: any;
  matkhau: any;
  errorMessage = '';
  datalogin: any;
  checkboxstate = false;

  constructor(private NVService: NhanvienService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  LoginNhanVien(){
console.log(btoa('12345678'))
    this.NVService.DangNhapNhanVien(this.tendangnhap,btoa(this.matkhau)).subscribe(data => {
        if (data){
          this.datalogin = data;
        // console.log(data)
          this.router.navigate(['/default']);
          // Đăng nhập thành công thì setLoggedIn để báo đã đăng nhập rồi để thỏa điều kiện default_guard chuyển qua trang default
          this.NVService.setLoggedIn(true, data);
        }
        else{
           // window.alert('Tài khoản không đúng!');
           this.errorMessage = 'Lỗi: Tài khoản hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại!';
           setTimeout(() => this.errorMessage = '', 2000);
        }
    }, (err) => {
      this.errorMessage = err;
      setTimeout(() => this.errorMessage = '', 2000);
    });
  }

  An_HienMatKhau(){
    this.checkboxstate = !this.checkboxstate;
    if (this.checkboxstate){
      document.getElementById('password1').setAttribute('type', 'text');
    }else {
      document.getElementById('password1').setAttribute('type', 'password');
    }
  }
}
