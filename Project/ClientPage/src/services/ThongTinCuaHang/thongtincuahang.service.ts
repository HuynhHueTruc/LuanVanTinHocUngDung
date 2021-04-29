import { ThongTinCuaHangModel } from './../../models/ThongTinCuaHang/thongtincuahang';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThongtincuahangService {

  constructor(private httpClient: HttpClient) { }

  getBanner(): Observable<ThongTinCuaHangModel[]>{
    return this.httpClient.get<ThongTinCuaHangModel[]>('http://localhost:3000/cuahang/thongtincuahang').pipe();
  }


}
