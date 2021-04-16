import { LoaiCayModel } from './../../models/LoaiCay/loaicay';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaicayService {

  constructor(private http: HttpClient) { }

  getListLoaiCay(): Observable<LoaiCayModel[]>{
    return this.http.get<LoaiCayModel[]>('http://localhost:3000/loaicay/thongtin').pipe();
  }

  ThemLoaiCay(loaicay: LoaiCayModel): Observable<LoaiCayModel[]>{
    return this.http.post<LoaiCayModel[]>('http://localhost:3000/loaicay/taomoi', loaicay).pipe();
   }

   CapNhatLoaiCay(loaicay: LoaiCayModel): Observable<LoaiCayModel[]>{
    return this.http.put<LoaiCayModel[]>(`${'http://localhost:3000/loaicay/capnhatloaicay'}/${loaicay._id}`, loaicay).pipe(
    );
   }

   XoaLoaiCay(_id: string): Observable<LoaiCayModel[]>{
    return this.http.delete<LoaiCayModel[]>(`${'http://localhost:3000/loaicay/xoaloaicay'}/${_id}`).pipe(
    );
   }

   XoaNhieuLoaiCay(arrLoaiCayID): Observable<LoaiCayModel[]>{
     return this.http.post<LoaiCayModel[]>('http://localhost:3000/loaicay/xoanhieuloaicay', arrLoaiCayID).pipe();
   }
}
