import { HinhThucVanChuyenModel } from './../../models/HinhThucVanChuyen/hinhthucvanchuyen';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HinhthucvanchuyenService {

  constructor(private http: HttpClient) { }

  getListHinhThucVanChuyen(): Observable<HinhThucVanChuyenModel[]>{
    return this.http.get<HinhThucVanChuyenModel[]>('http://localhost:3000/hinhthucvanchuyen/thongtin').pipe();
  }

  ThemHinhThucVanChuyen(hinhthucvanchuyen: HinhThucVanChuyenModel): Observable<HinhThucVanChuyenModel[]>{
    return this.http.post<HinhThucVanChuyenModel[]>('http://localhost:3000/hinhthucvanchuyen/taomoi', hinhthucvanchuyen).pipe();
   }

   CapNhatHinhThucVanChuyen(hinhthucvanchuyen: HinhThucVanChuyenModel): Observable<HinhThucVanChuyenModel[]>{
    return this.http.put<HinhThucVanChuyenModel[]>(`${'http://localhost:3000/hinhthucvanchuyen/capnhathinhthucvanchuyen'}/${hinhthucvanchuyen._id}`, hinhthucvanchuyen).pipe(
    );
   }

   XoaHinhThucVanChuyen(_id: string): Observable<HinhThucVanChuyenModel[]>{
    return this.http.delete<HinhThucVanChuyenModel[]>(`${'http://localhost:3000/hinhthucvanchuyen/xoahinhthucvanchuyen'}/${_id}`).pipe(
    );
   }

   XoaNhieuHinhThucVanChuyen(arrHinhThucID): Observable<HinhThucVanChuyenModel[]>{
     return this.http.post<HinhThucVanChuyenModel[]>('http://localhost:3000/hinhthucvanchuyen/xoanhieuhinhthucvanchuyen', arrHinhThucID).pipe();
   }

}
