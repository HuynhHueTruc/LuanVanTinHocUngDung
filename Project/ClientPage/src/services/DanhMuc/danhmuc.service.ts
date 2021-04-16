// https://www.tiepphan.com/angular-http-client-module-option/   -- Tai lieu
// Tai lieu tham khao https://viblo.asia/p/thu-lay-data-tu-api-bang-angular-lam-trang-danh-sach-san-pham-1VgZveJRKAw

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DanhMucModel } from '../../models/DanhMuc/danhmuc';

// const httpOptions ={
//   headers:new HttpHeaders({'Content-Type':'Application/json'})
// }

@Injectable({
  providedIn: 'root'
})

export class DanhmucService {

  constructor(private httpClient: HttpClient) { }

  // Observable: luôn luôn lắng nghe sự thay đổi
  getListDanhMuc(): Observable<DanhMucModel[]>{
    return this.httpClient.get<DanhMucModel[]>('http://localhost:3000/danhmuc').pipe();
  }

//   createPost(post: PostEntityModel): Observable<PostEntityModel> {
//     return this.httpClient.post<PostEntityModel>('https://jsonplaceholder.typicode.com/posts', post);
// }

// updatePost(postId: number, post: PostEntityModel): Observable<PostEntityModel> {
//     return this.httpClient.put<PostEntityModel>(`https://jsonplaceholder.typicode.com/posts/${ postId }`, post);
// }

// updateOptionPost(postId: number, post: Partial<PostEntityModel>): Observable<PostEntityModel> {
//     return this.httpClient.patch<PostEntityModel>(`https://jsonplaceholder.typicode.com/posts/${ postId }`, post);
// }

// deletePost(postId: number): Observable<any> {
//     return this.httpClient.delete(`https://jsonplaceholder.typicode.com/posts/${ postId }`);
// }
}

