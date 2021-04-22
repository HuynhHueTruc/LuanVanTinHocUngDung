import { SanPham } from './../../models/SanPham/sanpham';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SanphamService {

  constructor(private http: HttpClient) { }

  getListSanPham(): Observable<SanPham[]>{
    return this.http.get<SanPham[]>('http://localhost:3000/sanpham/thongtin').pipe();
  }
}
