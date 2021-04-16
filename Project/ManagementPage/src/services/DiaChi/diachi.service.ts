import { DiaChiModel } from './../../models/DiaChi/diachi';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiachiService {

  constructor(private httpClient: HttpClient ) { }

  getListDiaChi(): Observable<DiaChiModel[]>{
    return this.httpClient.get<DiaChiModel[]>('../../assets/diachi.js').pipe();
  }
}
