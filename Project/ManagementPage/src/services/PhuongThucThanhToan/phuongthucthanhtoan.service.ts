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

  ThemPhuongThucThanhToan(phuongthucthanhtoan: PhuongThucThanhToanModel): Observable<PhuongThucThanhToanModel[]>{
    return this.http.post<PhuongThucThanhToanModel[]>('http://localhost:3000/phuongthucthanhtoan/taomoi', phuongthucthanhtoan).pipe();
   }

   CapNhatPhuongThucThanhToan(phuongthucthanhtoan: PhuongThucThanhToanModel): Observable<PhuongThucThanhToanModel[]>{
    return this.http.put<PhuongThucThanhToanModel[]>(`${'http://localhost:3000/phuongthucthanhtoan/capnhatphuongthucthanhtoan'}/${phuongthucthanhtoan._id}`, phuongthucthanhtoan).pipe(
    );
   }

   XoaPhuongThucThanhToan(_id: string): Observable<PhuongThucThanhToanModel[]>{
    return this.http.delete<PhuongThucThanhToanModel[]>(`${'http://localhost:3000/phuongthucthanhtoan/xoaphuongthucthanhtoan'}/${_id}`).pipe(
    );
   }

   XoaNhieuPhuongThucThanhToan(arrPhuongThucID): Observable<PhuongThucThanhToanModel[]>{
     return this.http.post<PhuongThucThanhToanModel[]>('http://localhost:3000/phuongthucthanhtoan/xoanhieuphuongthucthanhtoan', arrPhuongThucID).pipe();
   }
}
