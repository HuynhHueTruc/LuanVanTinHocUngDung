import { BannerModel } from './../../../models/ThongTinCuaHang/banner';
import { ThongTinCuaHangModel } from './../../../models/ThongTinCuaHang/thongtincuahang';
import { ThongtincuahangService } from './../../../services/ThongTinCuaHang/thongtincuahang.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  data: any;
  thongtincuahang: ThongTinCuaHangModel;
  arrBanner: BannerModel;
  banners = [];
  mo_ta = [];

  constructor(private cuahangService: ThongtincuahangService) { }

  ngOnInit(): void {
    this.getBanner();
  }

  getBanner(){
    this.cuahangService.getBanner().subscribe((res: any) => {
      this.thongtincuahang = res.cuahangs[0];
      // console.log(this.thongtincuahang)
      this.arrBanner = this.thongtincuahang.Banner;
      // console.log(this.arrBanner)
      for (const dn in this.arrBanner){
        if (this.arrBanner.hasOwnProperty){
          this.banners.push(this.arrBanner[dn].Hinh_anh);
          this.mo_ta.push(this.arrBanner[dn].Mo_ta)
        }
      }

    });

  }
}
