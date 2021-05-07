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
}
