import { KhuyenMaiModel } from './../../models/KhuyenMai/khuyenmai';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KhuyenmaiService {

 
  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }
  getListKhuyenMai(): Observable<KhuyenMaiModel[]>{
    return this.http.get<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/thongtin').pipe();
  }

  ThemKhuyenMai(khuyenmai: KhuyenMaiModel): Observable<KhuyenMaiModel[]>{
    return this.http.post<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/taomoi', khuyenmai).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   CapNhatKhuyenMai(khuyenmai: KhuyenMaiModel): Observable<KhuyenMaiModel[]>{
    return this.http.put<KhuyenMaiModel[]>(`${'http://localhost:3000/khuyenmai/capnhatkhuyenmai'}/${khuyenmai._id}`, khuyenmai).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   XoaKhuyenMai(_id: string): Observable<KhuyenMaiModel[]>{
    return this.http.delete<KhuyenMaiModel[]>(`${'http://localhost:3000/khuyenmai/xoakhuyenmai'}/${_id}`).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   XoaNhieuKhuyenMai(arrKhuyenMaiID): Observable<KhuyenMaiModel[]>{
     return this.http.post<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/xoanhieukhuyenmai', arrKhuyenMaiID).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

}
