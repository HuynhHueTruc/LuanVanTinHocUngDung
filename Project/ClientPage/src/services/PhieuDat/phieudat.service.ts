import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PhieuDatModel } from './../../models/PhieuDat/phieudat';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhieudatService {

  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  getListPhieuDat(): Observable<PhieuDatModel[]> {
    return this.http.get<PhieuDatModel[]>('http://localhost:3000/phieudat/thongtin').pipe();
  }

  ThemPhieuDat(phieudat: PhieuDatModel): Observable<PhieuDatModel[]> {
    return this.http.post<PhieuDatModel[]>('http://localhost:3000/phieudat/taomoi', phieudat)
      .pipe(
        tap(() => {
          this.refreshPage.next();
        })
      );
  }

  XoaPhieuDat(_id: string): Observable<PhieuDatModel[]> {
    return this.http.delete<PhieuDatModel[]>(`${'http://localhost:3000/phieudat/xoaphieudat'}/${_id}`).pipe();
  }

  GuiEmailTaiKhoan(dsSanPham, KhachHang): Observable<PhieuDatModel[]>{
    return this.http.post<PhieuDatModel[]>('http://localhost:3000/phieudat/guiemailphieudat', {dsSanPham, KhachHang}).pipe();
  }
}
