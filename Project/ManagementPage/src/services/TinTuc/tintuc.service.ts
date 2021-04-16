import { Observable } from 'rxjs';
import { TinTucModel } from './../../models/TinTuc/tintuc';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TintucService {

  constructor(private http: HttpClient) { }

  getListTinTuc(): Observable<TinTucModel[]>{
    return this.http.get<TinTucModel[]>('http://localhost:3000/tintuc/thongtin').pipe();
  }

  ThemTinTuc(tintuc: TinTucModel): Observable<TinTucModel[]>{
    return this.http.post<TinTucModel[]>('http://localhost:3000/tintuc/taomoi', tintuc).pipe();
   }

   CapNhatTinTuc(tintuc: TinTucModel): Observable<TinTucModel[]>{
    return this.http.put<TinTucModel[]>(`${'http://localhost:3000/tintuc/capnhattintuc'}/${tintuc._id}`, tintuc).pipe(
    );
   }

   XoaTinTuc(_id: string): Observable<TinTucModel[]>{
    return this.http.delete<TinTucModel[]>(`${'http://localhost:3000/tintuc/xoatintuc'}/${_id}`).pipe(
    );
   }

   XoaNhieuTinTuc(arrTinTucID): Observable<TinTucModel[]>{
     return this.http.post<TinTucModel[]>('http://localhost:3000/tintuc/xoanhieutintuc', arrTinTucID).pipe();
   }
}
