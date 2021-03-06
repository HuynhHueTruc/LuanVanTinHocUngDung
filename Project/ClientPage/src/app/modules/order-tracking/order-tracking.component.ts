import { DanhGiaModel } from './../../../models/SanPham/danhgia';
import { Router } from '@angular/router';
import { AnhDaiDienModel } from './../../../models/SanPham/anhdaidien';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NbIconConfig } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';
import { timer } from 'rxjs';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {

  datalogin: any
  lstphieudat: PhieuDatModel
  lsthoadonbanhang: HoaDonBanHangModel
  dsphieudat: PhieuDatModel[] = []
  dsdanhgia: HoaDonBanHangModel[] = []
  dssanpham: SanPhamModel[] = []
  dsdonhang = []

  dschoxacnhan = []
  dscholayhang = []
  dsdanggiaohang = []

  dssanphamchoxacnhan: AnhDaiDienModel[] = []
  dssanphamcholayhang: AnhDaiDienModel[] = []
  dssanphamdanggiaohang: AnhDaiDienModel[] = []
  dssanphamdanhgia: AnhDaiDienModel[] = []

  soluongchoxacnhan = 0
  soluongcholayhang = 0
  soluongdanggiaohang = 0
  soluongdanhgia = 0

  danhgia: DanhGiaModel[] = []
  sanphamdanhgia: PhieuDatModel
  current: any
  arrdanhgia = []
  arrsodiem = []
  trang_thai = ''
  updateimg = false;
  phieudat: PhieuDatModel
  flag: any
  imagePath = []
  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig = {
    apiKey: "AIzaSyB5XhGTH_qmY-E5SKq0x9xvvadjtqPeXQQ",
    authDomain: "managementimagesgreenlife.firebaseapp.com",
    projectId: "managementimagesgreenlife",
    storageBucket: "managementimagesgreenlife.appspot.com",
    messagingSenderId: "206299427924",
    appId: "1:206299427924:web:63b6f139ee2c4d059f69c1",
    measurementId: "G-QZHVZRPBCT"
  };

  constructor(private phieudatService: PhieudatService, private hoadonService: HoadonbanhangService, private sanphamService: SanphamService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.phieudatService.getRefeshPage().subscribe(() => {
      this.getdsphieudat()
      // const getdsphieudat = timer(1000, 5000); // Tr??n th???c t??? l?? 864000000 (1 ng??y)
      // getdsphieudat.subscribe(val => this.ReloadDSPhieuDat());

    })
    this.sanphamService.getRefeshPage().subscribe(() => {
      this.getdsphieudat()

    })
    this.getdsphieudat()
    // const getdsphieudat = timer(1000, 5000); // Tr??n th???c t??? l?? 864000000 (1 ng??y)
    // getdsphieudat.subscribe(val => this.ReloadDSPhieuDat());

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(this.firebaseConfig);
      firebase.analytics();
    } else {
      firebase.app(); // if already initialized, use that one
    }
  }

  // ReloadDSPhieuDat(){
  //   this.lstphieudat = new PhieuDatModel()
  //   this.dsphieudat = []
  //   this.dschoxacnhan = []
  //   this.dscholayhang = []
  //   this.dsdanggiaohang = []
  //   this.dsdanhgia = []
  //   this.arrdanhgia = []
  //   this.dssanphamcholayhang = []
  //   this.dssanphamchoxacnhan = []
  //   this.dssanphamdanggiaohang = []
  //   this.dssanphamdanhgia = []
  //   this.soluongdanhgia = 0
  //   this.getdsphieudat()
  // }
  getdsphieudat() {
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.lstphieudat = res.phieudats;

      for (const i in this.lstphieudat) {
        if (this.lstphieudat[i].KhachHang_id === this.datalogin.Khach_hang_id) {
          this.dsphieudat.push(this.lstphieudat[i])
        }
      }

      for (const j in this.dsphieudat) {
        if (this.dsphieudat[j].Trang_thai === 'Ch??a duy???t' || this.dsphieudat[j].Trang_thai === 'Giao h??ng th???t b???i' || this.dsphieudat[j].Trang_thai === '???? h???y') {
          this.dschoxacnhan.push(this.dsphieudat[j])
        } else {
          if (this.dsphieudat[j].Trang_thai === '???? duy???t' || this.dsphieudat[j].Trang_thai === '??ang ???????c ????ng g??i'
            || this.dsphieudat[j].Trang_thai === 'Xu???t kho' || this.dsphieudat[j].Trang_thai === '??ang v???n chuy???n') {
            this.dscholayhang.push(this.dsphieudat[j])
          } else {
            if (this.dsphieudat[j].Trang_thai === '??ang giao h??ng') {
              this.dsdanggiaohang.push(this.dsphieudat[j])
            }
          }
        }
      }

      this.soluongchoxacnhan = this.dschoxacnhan.length
      this.soluongcholayhang = this.dscholayhang.length
      this.soluongdanggiaohang = this.dsdanggiaohang.length
      this.getdshoadon()
    })
  }

  getdshoadon() {
    this.hoadonService.getListHoaDonBan().subscribe((res: any) => {
      this.lsthoadonbanhang = res.hoadonbanhangs
      for (const i in this.lsthoadonbanhang) {
        if (this.lsthoadonbanhang[i].KhachHang_id === this.datalogin.Khach_hang_id) {
          this.dsdanhgia.push(this.lsthoadonbanhang[i])
        }
      }
      this.getdssanpham()
    })
  }

  getdssanpham() {
    let count = 0
    let hinhanh: AnhDaiDienModel[] = []
    let tmp: any
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const i in this.dsdanhgia) {
        // L???y ???nh ?????i di???n cho ????n mua
        for (const j in this.dsdanhgia[i].San_Pham) {
          hinhanh.push({ SanPham_id: this.dsdanhgia[i].San_Pham[j].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })

          for (const k in this.dssanpham) {
            if (this.dsdanhgia[i].San_Pham[j].SanPham_id === this.dssanpham[k]._id) {
              for (const l in this.dssanpham[k].Danh_gia) {
                if (this.dssanpham[k].Danh_gia[l].KhachHang_id === this.datalogin.Khach_hang_id) {
                  count += 1
                }
              }
            }
          }
        }
        tmp = hinhanh
        this.dssanphamdanhgia.push(tmp)
        hinhanh = []
        this.arrdanhgia.push(count)
        count = 0
      }

      for (const n in this.arrdanhgia) {
        if (this.arrdanhgia[n] === 0) {
          this.soluongdanhgia += 1
        }
      }
      for (const l in this.dschoxacnhan) {
        for (const k in this.dschoxacnhan[l].San_Pham) {
          hinhanh.push({ SanPham_id: this.dschoxacnhan[l].San_Pham[k].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.dssanphamchoxacnhan.push(tmp)
        hinhanh = []
      }

      for (const k in this.dscholayhang) {
        for (const l in this.dscholayhang[k].San_Pham) {
          hinhanh.push({ SanPham_id: this.dscholayhang[k].San_Pham[l].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.dssanphamcholayhang.push(tmp)
        hinhanh = []
      }

      for (const m in this.dsdanggiaohang) {
        for (const l in this.dsdanggiaohang[m].San_Pham) {
          hinhanh.push({ SanPham_id: this.dsdanggiaohang[m].San_Pham[l].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.dssanphamdanggiaohang.push(tmp)
        hinhanh = []
      }

      for (const j in this.dssanpham) {
        for (const h in this.dssanphamdanhgia) {
          for (const k in this.dssanphamdanhgia[h]) {
            if (this.dssanphamdanhgia[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamdanhgia[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamdanhgia[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }

        }
        for (const h in this.dssanphamchoxacnhan) {
          for (const k in this.dssanphamchoxacnhan[h]) {
            if (this.dssanphamchoxacnhan[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamchoxacnhan[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamchoxacnhan[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
        for (const h in this.dssanphamcholayhang) {
          for (const k in this.dssanphamcholayhang[h]) {
            if (this.dssanphamcholayhang[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamcholayhang[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamcholayhang[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
        for (const h in this.dssanphamdanggiaohang) {
          for (const k in this.dssanphamdanggiaohang) {
            if (this.dssanphamdanggiaohang[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamdanggiaohang[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamdanggiaohang[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
      }

    })
  }

  KiemTraTrangThai(eachPhieuDat) {
    if (eachPhieuDat.Trang_thai === undefined) {
      this.trang_thai = '???? giao h??ng th??nh c??ng'
    }
    return true
  }

  ChiTietDonHang(eachPhieuDat) {
    this.router.navigateByUrl(`/bill_manegement/order_tracking_detail/${eachPhieuDat._id}`);
  }

  // H??m m??? Dialog T???o
  open(content, eachPhieuDat, index, flag) {
    this.imagePath = []
    this.sanphamdanhgia = new PhieuDatModel()
    this.sanphamdanhgia = eachPhieuDat
    this.current = index
    this.flag = flag
    for (const j in this.sanphamdanhgia.San_Pham) {
      this.imagePath.push([])
      this.danhgia.push({ SanPham_id: this.sanphamdanhgia.San_Pham[j].SanPham_id, Noi_dung: '', Hinh_anh: [{ url: '' }], KhachHang_id: this.datalogin.Khach_hang_id, So_diem: 0 })
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
  }

  DemSoSao(index, count) {
    this.danhgia[index].So_diem = count
  }

  UL(index) {
    this.imagePath[index] = []
    const ref = firebase.storage().ref();
    const f = document.getElementById('imgcomment-' + index) as HTMLInputElement;
    const file = f.files;
    let length = file.length;
    for (let i = 0; i < length; i++) {
      if (typeof file[i] === 'object') {
        const name = new Date() + '-' + file[i].name;
        this.imagePath[index].push('../../../assets/' + file[i].name)
        const metadata = {
          contentType: file[i].type
        };
        const task = ref.child(name).put(file[i], metadata);
        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            console.log(url)
            this.danhgia[index].Hinh_anh.push({ url: url })
            // document.getElementById('imagecomment-' + index + '-' + i).style.display = 'block'
          }
          );
      }
    }
  }
  async UploadImg(index) {
    await this.UL(index)
    console.log('hihi')

  }

  DanhGia() {
    let html;
    let tmp = []
    console.log(this.danhgia)

    for (const i in this.danhgia) {
      html = document.getElementById('txtarea-' + i) as HTMLInputElement
      const content_comment = html.value
      this.danhgia[i].Noi_dung = content_comment
      this.danhgia[i].Hinh_anh.splice(0, 1)
    }
    for (let j = 0; j < this.danhgia.length; j++) {
      if (this.danhgia[j].So_diem === 0 && this.danhgia[j].Hinh_anh.length <= 0 && this.danhgia[j].Noi_dung === '') {
        tmp.push(this.danhgia[j])
      }
    }
    for (const i in tmp) {
      for (const j in this.danhgia) {
        if (tmp[i].SanPham_id === this.danhgia[j].SanPham_id) {
          this.danhgia.splice(Number.parseInt(j), 1)
        }
      }
    }
    // console.log(this.danhgia)
    if (this.danhgia.length > 0) {
      this.sanphamService.DanhGiaSanPham(this.danhgia, this.datalogin.Khach_hang_id, this.flag).subscribe(data => {
        alert(data)
        this.modalService.dismissAll()
        location.reload()
      })
    } else {
      alert('B???n ch??a vi???t ????nh gi?? n??o!')
    }


  }

  open_delete(content_delete, sanpham) {
    this.phieudat = sanpham
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-delete-title', backdrop: 'static', keyboard: false });
  }

  HuyDonChoXacNhan() {
    this.phieudatService.XoaPhieuDat(this.phieudat._id).subscribe()
    this.modalService.dismissAll()
    location.reload()
  }

  Huy() {
    this.modalService.dismissAll();
    this.danhgia = []
  }
}
