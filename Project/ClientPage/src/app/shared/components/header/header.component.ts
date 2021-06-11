import { SanPhamModel } from './../../../../models/SanPham/sanpham';
import { SanphamService } from './../../../../services/SanPham/sanpham.service';
import { LoaicayService } from './../../../../services/LoaiCay/loaicay.service';
import { LoaiCayModel } from './../../../../models/LoaiCay/loaicay';
import { KhachhangService } from './../../../../services/KhachHang/khachhang.service';
import { TenDanhMucNhoModel } from '../../../../models/DanhMuc/TenDanhMucNho';
import { DanhMucNhoModel } from '../../../../models/DanhMuc/DanhMucNho';
import { DanhmucService } from '../../../../services/DanhMuc/danhmuc.service';
import { Component, OnInit, AfterContentChecked, DoCheck } from '@angular/core';
import { DanhMucModel } from '../../../../models/DanhMuc/danhmuc';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterContentChecked, DoCheck {
  speechRecognition = window['webkitSpeechRecognition'];
  recognition = new this.speechRecognition()


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

  dssanpham: SanPhamModel[] = []
  dssanphamsearch = []
  name = '';
  loaicay_id = '';
  href = '';
  isLoading = false;
  keysearch = ''
  statuslogin: any

  trainscript = ''
  // Khi chạy constructor thì khởi tạo luôn DanhmucService
  constructor(private danhmucService: DanhmucService, private KHService: KhachhangService, private loaicayService: LoaicayService,
    private router: Router, private route: ActivatedRoute, private sanphamService: SanphamService) { }

  ngOnInit(): void {

    let content = ''
    this.getLoaiCay();
    this.geteachDanhMuc();
    this.getdscsanpham();
    // console.log(this.KHService.loggedInStatus, JSON.parse(this.KHService.loggedInStatus));
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.statuslogin = this.KHService.loggedInStatus
    if (this.KHService.loggedInStatus === false) {
      this.linkImgAccount = '../../../../assets/images/profile.png';
      this.nameAccount = 'Green Life';
    }
    else {
      this.linkImgAccount = '../../../../assets/images/avata.png';
      this.nameAccount = this.datalogin.Ho_ten;
      // console.log(this.KHService.loggedInAccount);
    }



  }
  // Lấy loại cây làm danh mục
  getLoaiCay() {
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.loaicays = res.loaicays;
    });
  }

  ngDoCheck() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'vi_VN';
    this.recognition.onerror = function () {
      this.recognition.close()
    }
    this.recognition.onresult = async function (event) {
      const current = event.resultIndex
      const transcript = await event.results[current][0].transcript
      this.keysearch = transcript
      const a = document.getElementById('search') as HTMLInputElement;
      a.value = transcript
    }
  }

  getdscsanpham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

    })
  }

  // Hàm lấy từng Danh mục sản phẩm
  geteachDanhMuc() {
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

      for (const caycanh in this.dmcaycanh) {
        if (this.dmcaycanh.hasOwnProperty(caycanh)) {
          this.dmncaycanh.push(this.dmcaycanh[caycanh].Danh_muc_nho);
          for (const item in this.dmncaycanh[0]) {
            if (this.dmncaycanh[0].hasOwnProperty(item)) {
              this.dscaycanh.push(this.dmncaycanh[0][item].Ten_danh_muc_nho);
            }
          }
        }
      }

      for (const hatgiong in this.dmhatgiong) {
        if (this.dmhatgiong.hasOwnProperty(hatgiong)) {
          this.dmnhatgiong.push(this.dmhatgiong[hatgiong].Danh_muc_nho);
          // console.log(this.dmnhatgiong);
          for (const item in this.dmnhatgiong[0]) {
            if (this.dmnhatgiong[0].hasOwnProperty(item)) {
              this.dshatgiong.push(this.dmnhatgiong[0][item]);
            }
          }
        }
      }

      for (const chaucay in this.dmchaucay) {
        if (this.dmchaucay.hasOwnProperty(chaucay)) {
          this.dmnchaucay.push(this.dmchaucay[chaucay].Danh_muc_nho);
          // console.log(this.dmnchaucay);
          for (const item in this.dmnchaucay[0]) {
            if (this.dmnchaucay[0].hasOwnProperty(item)) {
              this.dschaucay.push(this.dmnchaucay[0][item]);
              // console.log(this.dschaucay);
            }
          }
        }
      }

      for (const phanbon in this.dmphanbon) {
        if (this.dmphanbon.hasOwnProperty(phanbon)) {
          this.dmnphanbon.push(this.dmphanbon[phanbon].Danh_muc_nho);
          //  console.log(this.dmnphanbon);
          for (const item in this.dmnphanbon[0]) {
            if (this.dmnphanbon[0].hasOwnProperty(item)) {
              this.dsphanbon.push(this.dmnphanbon[0][item]);
              // console.log(this.dsphanbon);
            }
          }
        }
      }
      for (const dichvu in this.dmdichvu) {
        if (this.dmdichvu.hasOwnProperty(dichvu)) {
          this.dmndichvu.push(this.dmdichvu[dichvu].Danh_muc_nho);
          //  console.log(this.dmndichvu);
          for (const item in this.dmndichvu[0]) {
            if (this.dmndichvu[0].hasOwnProperty(item)) {
              this.dsdichvu.push(this.dmndichvu[0][item]);
              // console.log(this.dsdichvu);
            }
          }
        }
      }

      for (const dungcu in this.dmdungcu) {
        if (this.dmdungcu.hasOwnProperty(dungcu)) {
          this.dmndungcu.push(this.dmdungcu[dungcu].Danh_muc_nho);
          // console.log(this.dmndungcu);
          for (const item in this.dmndungcu[0]) {
            if (this.dmndungcu[0].hasOwnProperty(item)) {
              this.dsdungcu.push(this.dmndungcu[0][item]);
              // console.log(this.dsdungcu);
            }
          }
        }
      }

      for (const hotro in this.dmhotro) {
        if (this.dmhotro.hasOwnProperty(hotro)) {
          this.dmnhotro.push(this.dmhotro[hotro].Danh_muc_nho);
          //  console.log(this.dmnhotro);
          for (const item in this.dmnhotro[0]) {
            if (this.dmnhotro[0].hasOwnProperty(item)) {
              this.dshotro.push(this.dmnhotro[0][item]);
              // console.log(this.dshotro);
            }
          }
        }
      }
    });
  }

  Logout() {
    this.KHService.logout();
  }

  onSelectLTypeTree(eachLoaiCay) {
    this.router.navigateByUrl(`/default/typetree/${eachLoaiCay._id}`);
    this.isLoading = true;
  }

  ngAfterContentChecked(): void {
    // Called after every check of the component's or directive's content.
    // Add 'implements AfterContentChecked' to the class.
    if (this.isLoading) {
      window.location.reload();
    }
    this.isLoading = false;
  }

 async GoiYTuKhoa(flag?) {
  let a = document.getElementById('search') as HTMLInputElement
  this.keysearch  = a.value
    if (this.keysearch === '') {
      document.getElementById('suggestions-box').style.display = 'none'
    } else {
     
     await this.SearchByKeyWord()
     if (flag === 'voice'){
       this.onSelectProduct(this.dssanphamsearch[0].Danh_Muc[0])
     }else
     {
      document.getElementById('suggestions-box').style.display = 'block'
     }
    }
  }

  HiddenSearch() {
    console.log('hihi')
    document.getElementById('suggestions-box').style.display = 'none'
  }

  onSelectProduct(eachSP?) {
    if (eachSP !== undefined) {
      this.router.navigateByUrl(`/default/product/${eachSP.DMN_id}`);
      this.isLoading = true;
    } else {
      this.router.navigate(['/default/product', '5f7d88277cc2cc2a04b1573d']);
    }
  }



  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      ;
  }

  // Tìm kiếm theo từ khóa
  SearchByKeyWord() {
    this.dssanphamsearch = this.dssanpham;
    const text = this.removeAccents(this.keysearch);
    if (text === '') {
      this.getdscsanpham();
    } else {
      this.dssanphamsearch = this.dssanpham.filter(res => {
        const tensanpham = this.removeAccents(res.Ten_san_pham);
        const tmp2 = text.replace(/·/g, '');
        if (tensanpham.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return tensanpham.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        }
      });
    }
  }

  Start() {
    this.recognition.start()
  }
}
