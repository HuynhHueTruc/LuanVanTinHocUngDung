import { HttpClient } from '@angular/common/http';
import { ThongTinCuaHangModel } from './../../models/ThongTinCuaHang/thongtincuahang';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThongtincuahangService {

  constructor(private http: HttpClient) { }

  getThongTinCuaHang():Observable<ThongTinCuaHangModel[]>{
    return this.http.get<ThongTinCuaHangModel[]>('http://localhost:3000/cuahang/thongtincuahang').pipe();
  }

  updateThongTinCuaHang(thongtincuahang):Observable<ThongTinCuaHangModel[]>{
    return this.http.put<ThongTinCuaHangModel[]>(`${'http://localhost:3000/cuahang/capnhatthongtincuahang'}/${thongtincuahang._id}`, thongtincuahang).pipe();
  }
}
