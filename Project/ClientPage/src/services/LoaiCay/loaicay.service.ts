import { HttpClient } from '@angular/common/http';
import { LoaiCayModel } from './../../models/LoaiCay/loaicay';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaicayService {

  constructor(private httpClient: HttpClient) { }

  getListLoaiCay(): Observable<LoaiCayModel[]>{
    return this.httpClient.get<LoaiCayModel[]>('http://localhost:3000/loaicay/thongtin').pipe();
  }
}
