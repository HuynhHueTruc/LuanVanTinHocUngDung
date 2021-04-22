import { LoaicayService } from './../../../../services/LoaiCay/loaicay.service';
import { LoaiCayModel } from './../../../../models/LoaiCay/loaicay';
import { KhachhangService } from './../../../../services/KhachHang/khachhang.service';
import { TenDanhMucNhoModel } from '../../../../models/DanhMuc/TenDanhMucNho';
import { DanhMucNhoModel } from '../../../../models/DanhMuc/DanhMucNho';
import { DanhmucService } from '../../../../services/DanhMuc/danhmuc.service';
import { Component, OnInit } from '@angular/core';
import { DanhMucModel } from '../../../../models/DanhMuc/danhmuc';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    // Link image và Tên người dùng
    linkImgAccount: string;
    nameAccount: string;
    datalogin: any;
    // Danh mục loại cây
    loaicays: LoaiCayModel[] = [];
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

    name = '';
    loaicay_id = '';
    href = '';

    // Khi chạy constructor thì khởi tạo luôn DanhmucService
    constructor(private danhmucService: DanhmucService, private KHService: KhachhangService, private loaicayService: LoaicayService,
      private router: Router, private route: ActivatedRoute){}

    ngOnInit(): void{

      this.getLoaiCay();
      this.geteachDanhMuc();
      // console.log(this.KHService.loggedInStatus, JSON.parse(this.KHService.loggedInStatus));
      this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
      if (this.KHService.loggedInStatus === false){
        this.linkImgAccount = '../../../../assets/images/profile.png';
        this.nameAccount = 'Green Life';
      }
      else
      {
        this.linkImgAccount = '../../../../assets/images/avata.png';
        this.nameAccount = this.datalogin.Ho_ten;
       // console.log(this.KHService.loggedInAccount);
      }
    }
    // Lấy loại cây làm danh mục
    getLoaiCay(){
      this.loaicayService.getListLoaiCay().subscribe((res: any) => {
        this.loaicays = res.loaicays;
      });
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
            }
        }
      // console.log(this.dscaycanh);

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
        // console.log(this.dmndungcu);
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

    Logout(){
      this.KHService.logout();
    }

    onSelect(eachLoaiCay){
      this.router.navigateByUrl(`/default/typetree/${eachLoaiCay._id}`);
      // this.href = this.router.url;
      // this.loaicay_id = this.href.replace('/default/typetree/', '');
      // console.log(this.loaicay_id)
    }
}
