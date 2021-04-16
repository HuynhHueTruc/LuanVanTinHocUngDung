import { EmailNhaCungCapModel } from './../../models/NhaCungCap/emailnhacungcap';
import { NhaCungCapModel } from './../../models/NhaCungCap/nhacungcap';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NhacungcapService {

  constructor( private http: HttpClient) { }
  getListNhaCungCap(): Observable<NhaCungCapModel[]>{
    return this.http.get<NhaCungCapModel[]>('http://localhost:3000/nhacungcap/thongtin').pipe();
  }

  ThemNhaCungCap(nhacungcap: NhaCungCapModel): Observable<NhaCungCapModel[]>{
    return this.http.post<NhaCungCapModel[]>('http://localhost:3000/nhacungcap/taomoi', nhacungcap).pipe();
   }

   CapNhatNhaCungCap(nhacungcap: NhaCungCapModel): Observable<NhaCungCapModel[]>{
    return this.http.put<NhaCungCapModel[]>(`${'http://localhost:3000/nhacungcap/capnhatnhacungcap'}/${nhacungcap._id}`, nhacungcap).pipe(
    );
   }

   XoaNhaCungCap(_id: string): Observable<NhaCungCapModel[]>{
    return this.http.delete<NhaCungCapModel[]>(`${'http://localhost:3000/nhacungcap/xoanhacungcap'}/${_id}`).pipe(
    );
   }

   XoaNhieuNhaCungCap(arrNhaCungCapID): Observable<NhaCungCapModel[]>{
     return this.http.post<NhaCungCapModel[]>('http://localhost:3000/nhacungcap/xoanhacungcap', arrNhaCungCapID).pipe();
   }

   GuiEmailNhaCungCap(thongtinemail, noidung, chude): Observable<EmailNhaCungCapModel[]>{
    return this.http.post<EmailNhaCungCapModel[]>('http://localhost:3000/nhacungcap/guiemail', {thongtinemail, noidung, chude}).pipe();
  }

  GetOTP(nhacungcap: NhaCungCapModel): Observable<NhaCungCapModel[]>{
    return this.http.post<NhaCungCapModel[]>('http://localhost:3000/nhacungcap/guiOTP', nhacungcap).pipe();
  }
}
