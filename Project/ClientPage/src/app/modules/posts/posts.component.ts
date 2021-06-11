import { TenDanhMucNhoModel } from './../../../models/DanhMuc/TenDanhMucNho';
import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhmucService } from '../../../services/DanhMuc/danhmuc.service';
import { Component, OnInit } from '@angular/core';
import { DanhMucModel } from '../../../models/DanhMuc/danhmuc';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})

export class PostsComponent implements OnInit {


  // Khi chạy constructor thì khởi tạo luôn DanhmucService
  constructor(private danhmucService: DanhmucService) { }

  ngOnInit(): void {
    
  }
  
}
