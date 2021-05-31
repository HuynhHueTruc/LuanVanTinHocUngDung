import { KhachHangModel } from './../../../../models/KhachHang/khachhang';
import { KhachhangService } from './../../../../services/KhachHang/khachhang.service';
import { LoaiCayModel } from './../../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../../services/LoaiCay/loaicay.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {

  dsloaicay: LoaiCayModel[] = []
  datalogin: any
  arrsothich = []
  arrbit_sothich = []
  constructor(private loaicayService: LoaicayService, private KHService: KhachhangService) { }

  ngOnInit(): void {

    this.getdskhachhang()
  }

  getdskhachhang(){
   this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'))
   if (this.datalogin !== null){
    this.getdsloaicay()
   }
  }

  getdsloaicay(){
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays
     this.arrsothich = this.datalogin.So_thich
     for (let i = 0; i < this.dsloaicay.length; i++){
      this.arrbit_sothich.push(0)
     }
     for (const i in this.dsloaicay){
       for (const j in this.arrsothich){
         if (this.dsloaicay[i]._id === this.arrsothich[j].Loai_cay){
           this.arrbit_sothich[i] = 1
         }
       }
     }
    })
  }

}
