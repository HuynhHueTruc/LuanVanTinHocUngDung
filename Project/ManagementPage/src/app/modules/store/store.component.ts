import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThongTinCuaHangModel } from './../../../models/ThongTinCuaHang/thongtincuahang';
import { ThongtincuahangService } from './../../../services/ThongTinCuaHang/thongtincuahang.service';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  // anh_dai_dien: string;
  // shopname: string;
  thongtincuahang: ThongTinCuaHangModel;
  thongtincuahangmoi: ThongTinCuaHangModel;
  url: any;
  so_dien_thoai: string;
  // arrbanner: any;

  thanhpho: string;
  thanhphos: DiaChiModel[] = [];
  quanhuyens: QuanHuyenModel[] = [];
  arrquanhuyen1: QuanHuyenModel[] = [];
  xaphuongs: XaPhuongModel[] = [];
  arrxaphuong: XaPhuongModel[] = [];
  choosefile = false;
  updateimg = false;
  anh_dai_dien = ''
  banner = []
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


  constructor(private thongtincuahangService: ThongtincuahangService, private modalService: NgbModal, private diachiService: DiachiService) { }

  ngOnInit(): void {

    this.thongtincuahang = new ThongTinCuaHangModel();
    this.thongtincuahang.Dia_chi = { Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: '' };
    this.thongtincuahang.Anh_dai_dien = '';
    this.thongtincuahang.Ten_cua_hang = '';
    // this.anh_dai_dien = '';
    this.getThongTinCuaHang();
    this.geteachDiaDiem();

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(this.firebaseConfig);
      firebase.analytics();
    } else {
      firebase.app(); // if already initialized, use that one
    }
  }

  getThongTinCuaHang() {
    this.thongtincuahangService.getThongTinCuaHang().subscribe((res: any) => {
      this.thongtincuahang = res.cuahangs[0];
      this.thongtincuahang.Dia_chi = this.thongtincuahang.Dia_chi[0];
      // this.arrbanner = this.thongtincuahang.Banner;
      for (const i in this.thongtincuahang.Banner){
        this.banner.push(this.thongtincuahang.Banner[i].Hinh_anh)
      }
    });
  }

  open_dialog(content_update) {
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    this.anh_dai_dien = this.thongtincuahang.Anh_dai_dien
  }

  // Kiểm tra file có được upload hay không
  chooseFile() {
    // const ref = firebase.storage().ref()
    const f = document.querySelector('#photo') as HTMLInputElement;
    const file = f.files[0];
    this.anh_dai_dien = '../../../assets/' + file.name

    // console.log(file)
    if (file !== undefined) {
      document.getElementById('err_upload').style.display = 'none';
      this.choosefile = true;
    } else {
      this.choosefile = false
    }
  }


  //upload lên firebase và gọi hàm lưu vào csdl
  uploadImage() {
    if (this.choosefile) {
      const ref = firebase.storage().ref();
      const f = document.querySelector('#photo') as HTMLInputElement;
      const file = f.files[0];

      const name = new Date() + '-' + file.name;
      const metadata = {
        contentType: file.type
      };
      const task = ref.child(name).put(file, metadata);
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          // console.log(url),
          this.url = url;
          // alert("Image upload succesful")
          const image = document.querySelector('#image') as HTMLInputElement;
          image.src = url;
          const image2 = document.querySelector('#image2') as HTMLInputElement;
          image2.src = url;
          this.Luu(this.url);
        }
        );
    } else {
      this.Luu(null);
    }
  }

  // Hàm lưu vào csdl
  Luu(src) {
    let flag = false
    const textname = document.getElementById('changename') as HTMLInputElement;
    if (textname.value !== '') {
      flag = true
      this.thongtincuahang.Ten_cua_hang = textname.value;
      document.getElementById('err_message').style.display = 'none'

    } else {
      document.getElementById('err_message').style.display = 'block'
    }
    if (src !== null) {
      this.thongtincuahang.Anh_dai_dien = src;
    }
    if (flag) {
      this.thongtincuahangService.updateThongTinCuaHang(this.thongtincuahang).subscribe(dt => {
        window.alert(dt);
        this.modalService.dismissAll();
        this.choosefile = false;
      });
    }

  }

  // Hủy bỏ cập nhật avt và tên shop
  Huy() {
    this.choosefile = false;
    const image = document.querySelector('#image') as HTMLInputElement;
    image.src = this.thongtincuahang.Anh_dai_dien;
    const image2 = document.querySelector('#image2') as HTMLInputElement;
    image2.src = this.thongtincuahang.Anh_dai_dien;
    this.modalService.dismissAll();
  }

  // Hàm lấy thông tin thành phố
  geteachDiaDiem() {
    this.diachiService.getListDiaChi().subscribe((res: any) => {
      this.thanhphos = res;
      this.ThanhPho(null, this.thongtincuahang.Dia_chi);
    });
  }
  // Hàm hỗ trợ hiển thị list Thành phố trong thẻ select  + kiểm tra đã chọn tỉnh thành phố chưa
  ThanhPho(e?, diachi?) {
    // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);

    // Clear lại xã phường
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);

    if (e === null) {
      for (const qh in this.thanhphos) {
        if (this.thanhphos.hasOwnProperty(qh)) {
          if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho) {
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);

            for (const arr2 in this.arrquanhuyen1[0]) {
              if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
                if (this.arrquanhuyen1[0][arr2].name === diachi.Huyen_Quan) {
                  this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);

                }
              }
            }
            this.arrxaphuong.push(this.quanhuyens[0].wards);

            for (const arr in this.arrxaphuong[0]) {
              if (this.arrxaphuong[0].hasOwnProperty(arr)) {

                if (this.arrxaphuong[0][arr].name === diachi.Xa_Phuong) {
                  this.xaphuongs.push(this.arrxaphuong[0][arr]);
                }
              }
            }
          }
        }
      }
      this.HienThiQuanHuyen_XaPhuong(null, diachi);
    }
    else {
      this.thongtincuahang.Dia_chi.Huyen_Quan = '';
      this.thongtincuahang.Dia_chi.Xa_Phuong = '';

      document.getElementById('mes_tinh_thanhpho').style.display = 'none';
      e.preventDefault();
      const target = e.target;
      this.thanhpho = target.value;

      document.getElementById('mes_huyen_quan').style.display = 'block';
      document.getElementById('mes_xa_phuong').style.display = 'block';

      for (const qh in this.thanhphos) {
        if (this.thanhphos.hasOwnProperty(qh)) {
          if (this.thanhphos[qh].name === this.thanhpho) {
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);
            for (const arr2 in this.arrquanhuyen1[0]) {
              if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
                this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
              }
            }
          }
        }
      }

    }
  }

  // Hàm hiển thị quận huyện và xã phường khi update
  HienThiQuanHuyen_XaPhuong(evt, diachi) {
    if (evt === null) {
      document.getElementById('mes_xa_phuong').style.display = 'none';

    } else {
      document.getElementById('mes_xa_phuong').style.display = 'block';
      this.thongtincuahang.Dia_chi.Xa_Phuong = '';
    }

    // Xóa mảng truy xuất quận huyện ban đầu để bắt đầu mảng mới
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);

    for (const qh in this.thanhphos) {
      if (this.thanhphos.hasOwnProperty(qh)) {
        if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho) {
          this.arrquanhuyen1.push(this.thanhphos[qh].districts);
          for (const arr2 in this.arrquanhuyen1[0]) {
            if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
              this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
            }
          }
        }
      }
    }

    for (const xp in this.quanhuyens) {
      if (this.quanhuyens.hasOwnProperty(xp)) {
        if (this.quanhuyens[xp].name === diachi.Huyen_Quan) {
          this.arrxaphuong.push(this.quanhuyens[xp].wards);
          for (const arr2 in this.arrxaphuong[0]) {
            if (this.arrxaphuong[0].hasOwnProperty(arr2)) {
              this.xaphuongs.push(this.arrxaphuong[0][arr2]);
            }
          }
        }
      }
    }
    this.KiemTraDiaChiUpdate();
  }

  // Hàm kiểm tra địa chỉ update
  KiemTraDiaChiUpdate() {
    if (this.thongtincuahang.Dia_chi.Huyen_Quan !== '') {
      document.getElementById('mes_huyen_quan').style.display = 'none';
    } else {
      this.thongtincuahang.Dia_chi.Xa_Phuong = '';
      document.getElementById('mes_huyen_quan').style.display = 'block';
      document.getElementById('mes_xa_phuong').style.display = 'block';

    }
  }

  // Kiểm tra chọn xã phường
  XaPhuong(diachi?) {
    if (diachi === null) {
      if (this.thongtincuahang.Dia_chi.Xa_Phuong !== '') {
        document.getElementById('mes_xa_phuong').style.display = 'none';
      } else {
        document.getElementById('mes_xa_phuong').style.display = 'block';
      }
    } else {
      if (this.thongtincuahang.Dia_chi.Xa_Phuong !== '') {
        document.getElementById('mes_xa_phuong').style.display = 'none';
      } else {
        document.getElementById('mes_xa_phuong').style.display = 'block';
      }
    }

  }

  // Hàm kiểm tra thông tin cập nhật
  KiemTraThongTin() {
    if (this.thongtincuahang.So_dien_thoai.length !== 10 || this.thongtincuahang.Dia_chi.Huyen_Quan === '' || this.thongtincuahang.Dia_chi.Xa_Phuong === '') {
      return false;
    } else {
      return true;
    }
  }

  UpdateImg() {
    this.banner = []
    const f = document.querySelector('#banner') as HTMLInputElement;
    const file = f.files;
    if (file === undefined) {
      this.updateimg = false
    } else {
      this.updateimg = true
      for (let i = 0; i < 3; i++){
        this.banner.push('../../../assets/' + file[i].name)
      }
    }
  }

  UploadandSaveBanner() {
    let count = 1
    const ref = firebase.storage().ref();
    const f = document.querySelector('#banner') as HTMLInputElement;
    const file = f.files;
    // console.log(file)
    let length = file.length;
    if (length > 3) {
      length = 3;
    }

    for (let i = 0; i < length; i++) {
      if (typeof file[i] === 'object') {
        const name = new Date() + '-' + file[i].name;
        const metadata = {
          contentType: file[i].type
        };
        const task = ref.child(name).put(file[i], metadata);
        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            this.url = url;
            this.thongtincuahang.Banner[i].Hinh_anh = url;
            // this.arrbanner = this.thongtincuahang.Banner
          }
          ).then(dt => {
            if ( count === length){
              if (this.KiemTraThongTin()) {
                this.thongtincuahangService.updateThongTinCuaHang(this.thongtincuahang).subscribe(dt => {
                  window.alert(dt);
                  this.updateimg = false
                });
              } else {
                alert('Vui lòng nhập đầy đủ thông tin!');
              }
            } else{
              count += 1
            }
           
          });
      }
    }
  }

  // cập nhật thông tin cửa hàng
 async CapNhat() {
    if (this.updateimg) {
     await this.UploadandSaveBanner();
    }else{
      if (this.KiemTraThongTin()) {
        this.thongtincuahangService.updateThongTinCuaHang(this.thongtincuahang).subscribe(dt => {
          window.alert(dt);
          this.updateimg = false
        });
      } else {
        alert('Vui lòng nhập đầy đủ thông tin!');
      }
    }
  }

    // Hộp thoại xác nhận hủy bỏ tạo mới
    open_cancel(content_cancel) {
      this.modalService.open(content_cancel, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false, windowClass: 'my-class' });
    }

  HuyCapNhat(){
    location.reload()
  }
}
