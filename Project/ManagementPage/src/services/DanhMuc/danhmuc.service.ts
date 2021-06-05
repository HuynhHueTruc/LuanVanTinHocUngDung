
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { DanhMucModel } from '../../models/DanhMuc/danhmuc';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class DanhmucService {

  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  // Observable: luôn luôn lắng nghe sự thay đổi
  getListDanhMuc(): Observable<DanhMucModel[]>{
    return this.http.get<DanhMucModel[]>('http://localhost:3000/danhmuc').pipe();
  }


   CapNhatDanhMucNho(danhmuc): Observable<DanhMucModel[]>{
     console.log(danhmuc)
    return this.http.put<DanhMucModel[]>(`${'http://localhost:3000/danhmuc/capnhatdanhmucnho'}/${danhmuc._id}`, danhmuc).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }


}

