import { KhachHangModel } from './../../../models/KhachHang/khachhang';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { KhachhangService } from './../../../services/KhachHang/khachhang.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaChiDKModle } from 'src/models/DiaChi/Diachi_DK';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private KHService: KhachhangService, private diachiService: DiachiService,
              private route: ActivatedRoute, private router: Router) { }

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
  dt: any;
  gioitinh: string;
  thanhpho: string;
  quanhuyen: string;
  checkboxstate = false;
  ngOnInit(): void {
    this.geteachDiaDiem();

    this.khachhang = new KhachHangModel();

    this.khachhang.Dia_chi = {Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: ''};
    this.khachhang.Gioi_tinh = '';
  }

  //  Select Giơis tính
  public GioiTinh(event){
    event.preventDefault();
    const target = event.target;
   // console.log(target.value);
    this.gioitinh = target.value;
  }

  // Select Thành phố
  public ThanhPho(event){
    event.preventDefault();
    const target = event.target;
 //   console.log(target.value);

    this.thanhpho = target.value;
  //  console.log(this.thanhpho);

     // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
// Clear lại xã phường
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);

    for (const qh in this.thanhphos){
        if (this.thanhphos.hasOwnProperty(qh)){
          if (this.thanhphos[qh].name === this.thanhpho){
          this.arrquanhuyen1.push(this.thanhphos[qh].districts);
          // console.log(this.arrquanhuyen1);
          // console.log(this.arrquanhuyen1[0]);
          // console.log(this.quanhuyens);
          for (const arr2 in this.arrquanhuyen1[0]){
            if (this.arrquanhuyen1[0].hasOwnProperty(arr2)){
              this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
            }
          }
          }
        }
      }
  }

   // Select quận huyện
   public QuanHuyen(event){
  //  console.log(this.thanhpho);
      event.preventDefault();
      const target = event.target;
     // console.log(target.value);
      this.quanhuyen = target.value;

      for (const xp in this.quanhuyens){
        if (this.thanhphos.hasOwnProperty(xp)){
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
  }

// Hàm xử lý sự kiện submit trên frontend
    LoginKhachHang(event){
      event.preventDefault();
      const target = event.target;

      const Khach_hang_id = target.querySelector('#firstname').value;
      const Mat_khau = target.querySelector('#password1').value;

      this.KHService.DangNhapKhachHang(Khach_hang_id, Mat_khau).subscribe(data => {
          if (data){
            this.dt = data;
            // console.log(this.dt);
            // window.alert('Đăng nhập thành công!');
            this.router.navigate(['/default']);
            // Đăng nhập thành công thì setLoggedIn để báo đã đăng nhập rồi để thỏa điều kiện default_guard chuyển qua trang default
            this.KHService.setLoggedIn(true, this.dt);
          }else{
             // window.alert('Tài khoản không đúng!');
             this.errorMessage = 'Tài khoản hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại!';
             setTimeout(() => this.errorMessage = '', 2000);
          }
      }, (err) => {
        this.errorMessage = err;
        setTimeout(() => this.errorMessage = '', 2000);
      });
  }

  DangKy(event){
    event.preventDefault();
    const target = event.target;

    const Xac_nhan_mat_khau = target.querySelector('#Xac_nhan_mat_khau').value;

    if (this.khachhang.Mat_khau === Xac_nhan_mat_khau){
      this.KHService.ThemKhachHang(this.khachhang).subscribe(data => {
         window.alert(data);
        });
    }else{
      window.alert('Xác nhận mật khẩu không thành công!');
    }

  }
// Hàm lấy thông tin thành phố
  geteachDiaDiem(){
    this.diachiService.getListDiaChi().subscribe((res: any) => {
      this.thanhphos = res;
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
