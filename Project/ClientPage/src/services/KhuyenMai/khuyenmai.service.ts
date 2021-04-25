import { KhuyenMaiModel } from './../../models/KhuyenMai/khuyenmai';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KhuyenmaiService {

  constructor(private http: HttpClient) { }

  getListKhuyenMai(): Observable<KhuyenMaiModel[]>{
    return this.http.get<KhuyenMaiModel[]>('http://localhost:3000/khuyenmai/thongtin').pipe();
  }

}
