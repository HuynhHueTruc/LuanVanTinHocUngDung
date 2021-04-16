import { BannerModel } from './../../../../models/ThongTinCuaHang/banner';
import { ThongTinCuaHangModel } from './../../../../models/ThongTinCuaHang/thongtincuahang';
import { Observable } from 'rxjs';
import { ThongtincuahangService } from './../../../../services/ThongTinCuaHang/thongtincuahang.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private cuahangService: ThongtincuahangService) { }
  ngOnInit(): void {
  }

}
