import { PhuongThucThanhToanModel } from './../../models/PhuongThucThanhToan/phuongthucthanhtoan';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhuongthucthanhtoanService {


  constructor(private http: HttpClient) { }

  getListPhuongThucThanhToan(): Observable<PhuongThucThanhToanModel[]>{
    return this.http.get<PhuongThucThanhToanModel[]>('http://localhost:3000/phuongthucthanhtoan/thongtin').pipe();
  }
}
