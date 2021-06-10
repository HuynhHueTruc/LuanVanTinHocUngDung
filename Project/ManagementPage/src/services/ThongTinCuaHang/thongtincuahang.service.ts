import { HttpClient } from '@angular/common/http';
import { ThongTinCuaHangModel } from './../../models/ThongTinCuaHang/thongtincuahang';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThongtincuahangService {

  
  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  getThongTinCuaHang():Observable<ThongTinCuaHangModel[]>{
    return this.http.get<ThongTinCuaHangModel[]>('http://localhost:3000/cuahang/thongtincuahang').pipe();
  }

  updateThongTinCuaHang(thongtincuahang):Observable<ThongTinCuaHangModel[]>{
    return this.http.put<ThongTinCuaHangModel[]>(`${'http://localhost:3000/cuahang/capnhatthongtincuahang'}/${thongtincuahang._id}`, thongtincuahang).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
  }
}
