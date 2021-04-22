import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { SanPham } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-typetree',
  templateUrl: './typetree.component.html',
  styleUrls: ['./typetree.component.scss']
})
export class TypetreeComponent implements OnInit {

  dsloaicay: LoaiCayModel;
  loaicay: LoaiCayModel;
  href = '';
  loaicay_id;
  dssanpham: SanPham;
  dsdanhmuc: DanhMucModel;
  dsdmcaycanh: any;
  dsdmhatgiong: any;
  dsdmchaucay: any;
  dsdmphanbon: any;
  dsdmdichvu: any;
  dsdmdungcu: any;
  dsloaicaycanh: DanhMucNhoModel[] = [];
  dscaycanh: SanPham[] = [];
  constructor(private router: Router, private loaicayService: LoaicayService, private route: ActivatedRoute,
    private sanphamService: SanphamService, private danhmucService: DanhmucService) { }

  ngOnInit(): void {
    this.href = this.router.url;
    this.loaicay_id = this.href.replace('/default/typetree/', '');

    this.getLoaiCay();
  }


  getLoaiCay() {
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays;

      for (const i in this.dsloaicay) {
        if (this.dsloaicay[i]._id === this.loaicay_id) {
          this.loaicay = this.dsloaicay[i];
        }
      }
      this.getdsdanhmuc();


    });
  }

  getdsdanhmuc() {
    this.danhmucService.getListDanhMuc().subscribe((res: any) => {
      this.dsdanhmuc = res.danhmucs;
      this.dsdmcaycanh = this.dsdanhmuc[1].Danh_muc_nho;
      this.dsdmhatgiong = this.dsdanhmuc[2].Danh_muc_nho;
      this.dsdmchaucay = this.dsdanhmuc[3].Danh_muc_nho;
      this.dsdmphanbon = this.dsdanhmuc[4].Danh_muc_nho;
      this.dsdmdichvu = this.dsdanhmuc[5].Danh_muc_nho;
      this.dsdmdungcu = this.dsdanhmuc[7].Danh_muc_nho;

      this.SoKhopLoaiCay(this.loaicay_id);
    });
  }


  getsanpham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const i in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty(i)){
          for (const j in this.dsloaicaycanh){
            if (this.dsloaicaycanh.hasOwnProperty(j)){
              if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.dsloaicaycanh[j].DMN_id){
                this.dscaycanh.push(this.dssanpham[i])
              }
            }
          }
        }
      }
      console.log(this.dscaycanh)
    });
  }

  SoKhopLoaiCay(loaicay_id) {
    // console.log(loaicay_id)
    // console.log(this.dsdmcaycanh);
    for (const i in this.dsdmcaycanh) {
      if (this.dsdmcaycanh[i].Loai_cay === loaicay_id) {
        this.dsloaicaycanh.push(this.dsdmcaycanh[i]);
      }
    }
    this.getsanpham();
    // console.log(this.dsloaicaycanh)
  }
}
