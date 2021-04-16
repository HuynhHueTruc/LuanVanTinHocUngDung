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

    // Tạo mảng đối tượng DanhMucModel để chứa mảng trả về
    datas: DanhMucModel[] = [];
    dmcaycanh: DanhMucModel[] = [];
    dmhatgiong: DanhMucModel[] = [];
    dmchaucay: DanhMucModel[] = [];
    dmphanbon: DanhMucModel[] = [];
    dmdichvu: DanhMucModel[] = [];
    dmdungcu: DanhMucModel[] = [];
    dmhotro: DanhMucModel[] = [];

    // Tạo mảng lấy danh mục nhỏ của từng đối tượng trong danh mục

    dmncaycanh: DanhMucNhoModel[] = [];
    dmnhatgiong: DanhMucNhoModel[] = [];
    dmnchaucay: DanhMucNhoModel[] = [];
    dmnphanbon: DanhMucNhoModel[] = [];
    dmndichvu: DanhMucNhoModel[] = [];
    dmndungcu: DanhMucNhoModel[] = [];
    dmnhotro: DanhMucNhoModel[] = [];

    // Tạo mảng lấy các phần tử trong các danh mục nhỏ
    dscaycanh: TenDanhMucNhoModel[] = [];
    dshatgiong: TenDanhMucNhoModel[] = [];
    dschaucay: TenDanhMucNhoModel[] = [];
    dsphanbon: TenDanhMucNhoModel[] = [];
    dsdichvu: TenDanhMucNhoModel[] = [];
    dsdungcu: TenDanhMucNhoModel[] = [];
    dshotro: TenDanhMucNhoModel[] = [];

    // Khi chạy constructor thì khởi tạo luôn DanhmucService
    constructor(private danhmucService: DanhmucService){}

    ngOnInit(): void{
      this.geteachDanhMuc();
    }
    // Hàm lấy từng Danh mục sản phẩm

    geteachDanhMuc(){
     this.danhmucService.getListDanhMuc().subscribe((res: any) => {
       // lấy toàn bộ kết quả trả về theo dạng json
      this.datas = res.danhmucs;
       // console.log(this.datas);

      // Tách riêng lẻ từng danh muc
      this.dmcaycanh.push(this.datas[1]);
      this.dmhatgiong.push(this.datas[2]);
      this.dmchaucay.push(this.datas[3]);
      this.dmphanbon.push(this.datas[4]);
      this.dmdichvu.push(this.datas[5]);
      this.dmdungcu.push(this.datas[7]);
      this.dmhotro.push(this.datas[10]);
     // console.log(this.dmcaycanh);

     // Lấy danh sách cây cảnh
     // Sau khi tách riêng lẻ các danh mục (dmcaycanh). Ta duyệt qua tất cả row trong dmcaycanh: for (const caycanh in this.dmcaycanh)
     // Câu lệnh if để kiểm tra có tồn tại hay không
     // Tại mỗi row ta thêm vào dmncaycanh thông tin về Danh mục nhỏ
     // Trong danh mục nhỏ có 1 mảng lớn chứa các mảng nhỏ => vị trí của mảng lớn là 0: this.dmncaycanh[0]
     // Duyệt qua tất cả các row trong các mảng con của mảng lớn (this.dmncaycanh[0]): for (const item in this.dmncaycanh[0])
     // Thêm Tên danh mục nhỏ trong từng mảng nhỏ (vị trí item trong mảng lớn => this.dmncaycanh[0][item]) vào dscaycanh
      for (const caycanh in this.dmcaycanh){
       if (this.dmcaycanh.hasOwnProperty(caycanh)){
        this.dmncaycanh.push(this.dmcaycanh[caycanh].Danh_muc_nho);
       // console.log(this.dmncaycanh);
        for (const item in this.dmncaycanh[0]){
            if (this.dmncaycanh[0].hasOwnProperty(item)){
              this.dscaycanh.push(this.dmncaycanh[0][item].Ten_danh_muc_nho) ;
              // console.log(this.dscaycanh);
            }
        }
       }
    }

      for (const hatgiong in this.dmhatgiong){
        if (this.dmhatgiong.hasOwnProperty(hatgiong)){
          this.dmnhatgiong.push(this.dmhatgiong[hatgiong].Danh_muc_nho);
         // console.log(this.dmnhatgiong);
          for (const item in this.dmnhatgiong[0]){
            if (this.dmnhatgiong[0].hasOwnProperty(item)){
              this.dshatgiong.push(this.dmnhatgiong[0][item].Ten_danh_muc_nho) ;
             // console.log(this.dshatgiong);
            }
          }
        }
      }

      for (const chaucay in this.dmchaucay){
        if (this.dmchaucay.hasOwnProperty(chaucay)){
          this.dmnchaucay.push(this.dmchaucay[chaucay].Danh_muc_nho);
         // console.log(this.dmnchaucay);
          for (const item in this.dmnchaucay[0]){
            if (this.dmnchaucay[0].hasOwnProperty(item)){
              this.dschaucay.push(this.dmnchaucay[0][item].Ten_danh_muc_nho) ;
              // console.log(this.dschaucay);
            }
          }
        }
      }

      for (const phanbon in this.dmphanbon){
        if (this.dmphanbon.hasOwnProperty(phanbon)){
          this.dmnphanbon.push(this.dmphanbon[phanbon].Danh_muc_nho);
        //  console.log(this.dmnphanbon);
          for (const item in this.dmnphanbon[0]){
            if (this.dmnphanbon[0].hasOwnProperty(item)){
              this.dsphanbon.push(this.dmnphanbon[0][item].Ten_danh_muc_nho) ;
             // console.log(this.dsphanbon);
            }
          }
        }
     }
      for (const dichvu in this.dmdichvu){
        if (this.dmdichvu.hasOwnProperty(dichvu)){
          this.dmndichvu.push(this.dmdichvu[dichvu].Danh_muc_nho);
        //  console.log(this.dmndichvu);
          for (const item in this.dmndichvu[0]){
            if (this.dmndichvu[0].hasOwnProperty(item)){
              this.dsdichvu.push(this.dmndichvu[0][item].Ten_danh_muc_nho) ;
             // console.log(this.dsdichvu);
            }
          }
        }
      }

      for (const dungcu in this.dmdungcu){
        if (this.dmdungcu.hasOwnProperty(dungcu)){
        this.dmndungcu.push(this.dmdungcu[dungcu].Danh_muc_nho);
        //console.log(this.dmndungcu);
        for (const item in this.dmndungcu[0]){
            if (this.dmndungcu[0].hasOwnProperty(item)){
              this.dsdungcu.push(this.dmndungcu[0][item].Ten_danh_muc_nho) ;
             // console.log(this.dsdungcu);
            }
        }
        }
    }

      for (const hotro in this.dmhotro){
        if (this.dmhotro.hasOwnProperty(hotro)){
          this.dmnhotro.push(this.dmhotro[hotro].Danh_muc_nho);
        //  console.log(this.dmnhotro);
          for (const item in this.dmnhotro[0]){
            if (this.dmnhotro[0].hasOwnProperty(item)){
              this.dshotro.push(this.dmnhotro[0][item].Ten_danh_muc_nho) ;
             // console.log(this.dshotro);
            }
          }
        }
      }
     });
    }

  }
