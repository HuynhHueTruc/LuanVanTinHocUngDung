import { KhuyenMaiModel } from './../../models/KhuyenMai/khuyenmai';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KhuyenmaiService {

  constructor(private http: HttpClient) { }

  getListKhuyenMai(): Observable<KhuyenMaiModel[]>{
    return this.http.get<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/thongtin').pipe();
  }

  ThemKhuyenMai(khuyenmai: KhuyenMaiModel): Observable<KhuyenMaiModel[]>{
    return this.http.post<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/taomoi', khuyenmai).pipe();
   }

   CapNhatKhuyenMai(khuyenmai: KhuyenMaiModel): Observable<KhuyenMaiModel[]>{
    return this.http.put<KhuyenMaiModel[]>(`${'http://localhost:3000/khuyenmai/capnhatkhuyenmai'}/${khuyenmai._id}`, khuyenmai).pipe(
    );
   }

   XoaKhuyenMai(_id: string): Observable<KhuyenMaiModel[]>{
    return this.http.delete<KhuyenMaiModel[]>(`${'http://localhost:3000/khuyenmai/xoakhuyenmai'}/${_id}`).pipe(
    );
   }

   XoaNhieuKhuyenMai(arrKhuyenMaiID): Observable<KhuyenMaiModel[]>{
     return this.http.post<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/xoanhieukhuyenmai', arrKhuyenMaiID).pipe();
   }

}
