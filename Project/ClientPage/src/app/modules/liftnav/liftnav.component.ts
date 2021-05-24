import { GioHangModel } from './../../../models/GioHang/giohang';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liftnav',
  templateUrl: './liftnav.component.html',
  styleUrls: ['./liftnav.component.scss']
})
export class LiftnavComponent implements OnInit {

  datalogin: any;
  giohang: GioHangModel[] = [];
  lengthdssanpham = 0;

  constructor(private giohangService: GiohangService) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    if (this.datalogin !== null){
      this.giohangService.getRefeshPage().subscribe(() => {
        this.getgiohang();
      })
      this.getgiohang();

    }
  }

  getgiohang() {
    this.giohangService.getGioHang(this.datalogin).subscribe((dt) => {
      this.giohang = dt;
      // if (this.giohang !== null){
        this.lengthdssanpham = this.giohang[0].San_Pham.length;
      // }else{
      //   this.lengthdssanpham = 0;
      // }
    });
  }

  SoLuongSanPham(){
    if(this.lengthdssanpham > 0){
      return true
    }else{
      return false
    }
  }
}
