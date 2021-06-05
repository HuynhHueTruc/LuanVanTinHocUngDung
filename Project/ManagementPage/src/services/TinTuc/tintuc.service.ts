import { Observable, Subject } from 'rxjs';
import { TinTucModel } from './../../models/TinTuc/tintuc';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TintucService {

  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }


  getListTinTuc(): Observable<TinTucModel[]>{
    return this.http.get<TinTucModel[]>('http://localhost:3000/tintuc/thongtin').pipe();
  }

  ThemTinTuc(tintuc: TinTucModel): Observable<TinTucModel[]>{
    return this.http.post<TinTucModel[]>('http://localhost:3000/tintuc/taomoi', tintuc).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   CapNhatTinTuc(tintuc: TinTucModel): Observable<TinTucModel[]>{
    return this.http.put<TinTucModel[]>(`${'http://localhost:3000/tintuc/capnhattintuc'}/${tintuc._id}`, tintuc).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   XoaTinTuc(_id: string): Observable<TinTucModel[]>{
    return this.http.delete<TinTucModel[]>(`${'http://localhost:3000/tintuc/xoatintuc'}/${_id}`).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   XoaNhieuTinTuc(arrTinTucID): Observable<TinTucModel[]>{
     return this.http.post<TinTucModel[]>('http://localhost:3000/tintuc/xoanhieutintuc', arrTinTucID).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }
}
