// https://www.tiepphan.com/angular-http-client-module-option/   -- Tai lieu
// Tai lieu tham khao https://viblo.asia/p/thu-lay-data-tu-api-bang-angular-lam-trang-danh-sach-san-pham-1VgZveJRKAw

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DanhMucModel } from '../../models/DanhMuc/danhmuc';

// const httpOptions ={
//   headers:new HttpHeaders({'Content-Type':'Application/json'})
// }

@Injectable({
  providedIn: 'root'
})

export class DanhmucService {

  constructor(private http: HttpClient) { }

  // Observable: luôn luôn lắng nghe sự thay đổi
  getListDanhMuc(): Observable<DanhMucModel[]>{
    return this.http.get<DanhMucModel[]>('http://localhost:3000/danhmuc').pipe();
  }

  // TimKiemDanhMuc(arrdanhmucnho): Observable<DanhMucModel[]>{
  //   return this.http.post<DanhMucModel[]>('http://localhost:3000/danhmuc/danhmucnho/timkiem', arrdanhmucnho).pipe()
  // }

  //  CapNhatNhaCungCap(danhmuc: DanhMucModel): Observable<DanhMucModel[]>{
  //   return this.http.put<DanhMucModel[]>(`${'http://localhost:3000/danhmuc/capnhatdanhmuc'}/${danhmuc._id}`, danhmuc).pipe(
  //   );
  //  }

   CapNhatDanhMucNho(danhmuc): Observable<DanhMucModel[]>{
     console.log(danhmuc)
    return this.http.put<DanhMucModel[]>(`${'http://localhost:3000/danhmuc/capnhatdanhmucnho'}/${danhmuc._id}`, danhmuc).pipe(
    );
   }


}

// {
//   "Ten_danh_muc_nho": "Terrarium",
//   "Loai_cay": {
//       "$oid": "600c43200c8c6941c440be55"
//   },
//   "DMN_id": {
//       "$oid": "5fb11eac192a11e11c9a91d5"
//   }
// }
