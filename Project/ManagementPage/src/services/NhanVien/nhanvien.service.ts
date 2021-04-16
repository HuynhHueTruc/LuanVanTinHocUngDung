import { Router } from '@angular/router';
import { NguoiNhanModel } from './../../models/NhanVien/nguoinhan';
import { ThongTinTaiKhoanEmailModel } from './../../models/NhanVien/thongtinemail';
import { NhanVienModel } from './../../models/NhanVien/nhanvien';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NhanvienService {

    // Mặc định là bằng false
    // loggedInStatus = JSON.parse(sessionStorage.getItem('loggedIn') || 'false');
    // loggedInAccount = sessionStorage.getItem('loggedInAcount') || null;
    loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    loggedInAccount = localStorage.getItem('loggedInAcount') || null;
    datalogin: any;

  constructor(private http: HttpClient, private router: Router) { }

  setLoggedIn(value: boolean, data: any){
      this.loggedInStatus = value;
      localStorage.setItem('loggedIn', 'true');
      // this.loggedInAccount = data.Nhan_vien_id;
      this.loggedInAccount = data;
      localStorage.setItem('loggedInAcount', JSON.stringify(this.loggedInAccount));
      this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
  }

  logout(){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInAcount');
    this.router.navigate(['login']);
  }

  get isLoggedIn(){
    return JSON.parse(localStorage.getItem('loggedIn')
    || this.loggedInStatus && localStorage.getItem('loggedInAcoount') || this.loggedInAccount);
  }

// Tạo biến gửi trùng tên với biến nhận bên server
  DangNhapNhanVien(Nhan_vien_id, Mat_khau): Observable<NhanVienModel>{

    return this.http.post<NhanVienModel>('http://localhost:3000/nhanvien/dangnhap', {Nhan_vien_id, Mat_khau});
  }

  getListNhanVien(): Observable<NhanVienModel[]>{
    return this.http.get<NhanVienModel[]>('http://localhost:3000/nhanvien').pipe();
  }

  ThemNhanVien(nhanvien: NhanVienModel): Observable<NhanVienModel[]>{
    return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/dangky', nhanvien).pipe();
   }

   CapNhatNhanVien(nhanvien: NhanVienModel): Observable<NhanVienModel[]>{
    return this.http.put<NhanVienModel[]>(`${'http://localhost:3000/nhanvien/capnhatnhanvien'}/${nhanvien.Nhan_vien_id}`, nhanvien).pipe(
    );
   }

   XoaNhanVien(Nhan_vien_id: string): Observable<NhanVienModel[]>{
    return this.http.delete<NhanVienModel[]>(`${'http://localhost:3000/nhanvien/xoanhanvien'}/${Nhan_vien_id}`).pipe(
    );
   }

   XoaNhieuNhanVien(arrNhanVienID): Observable<NhanVienModel[]>{
     return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/xoanhanvien', arrNhanVienID).pipe();
   }

   GuiEmailTaiKhoan(arrThongTin): Observable<ThongTinTaiKhoanEmailModel[]>{
     return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/nhanvien/guiemailtaikhoan', arrThongTin).pipe();
   }

   GuiEmailNhanVien(thongtinemail, noidung, chude): Observable<ThongTinTaiKhoanEmailModel[]>{
    return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/nhanvien/guiemail', {thongtinemail, noidung, chude}).pipe();
  }

  GetOTP(nhanvien: NhanVienModel): Observable<NhanVienModel[]>{
    return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/guiOTP', nhanvien).pipe();
  }
  // `${'http://localhost:3000/nhanvien/kiemtrasecretkey'}/${secret_key}`
  // XacNhanKey(secrect_key, nhanvien){
  //   return this.http.post('http://localhost:3000/nhanvien/kiemtrasecretkey', {'secret_key': secrect_key, nhanvien}).pipe();
  // }
}
