import { PhieuDatModel } from './../../models/PhieuDat/phieudat';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhieudatService {

  constructor(private http: HttpClient) { }

  getListPhieuDat(): Observable<PhieuDatModel[]>{
    return this.http.get<PhieuDatModel[]>('http://localhost:3000/phieudat/thongtin').pipe();
  }

  ThemPhieuDat(phieudat: PhieuDatModel): Observable<PhieuDatModel[]>{
    return this.http.post<PhieuDatModel[]>('http://localhost:3000/phieudat/taomoi', phieudat).pipe();
   }


   CapNhatPhieuDat(phieudat: PhieuDatModel): Observable<PhieuDatModel[]>{
    return this.http.put<PhieuDatModel[]>(`${'http://localhost:3000/phieudat/capnhatphieudat'}/${phieudat._id}`, phieudat).pipe(
    );
   }

   XoaPhieuDat(_id: string): Observable<PhieuDatModel[]>{
    return this.http.delete<PhieuDatModel[]>(`${'http://localhost:3000/phieudat/xoaphieudat'}/${_id}`).pipe(
    );
   }

   XoaNhieuPhieuDat(arrPhieuDatID): Observable<PhieuDatModel[]>{
     return this.http.post<PhieuDatModel[]>('http://localhost:3000/phieudat/xoanhieuphieudat', arrPhieuDatID).pipe();
   }

}
