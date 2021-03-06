import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TintucService } from './../../../services/TinTuc/tintuc.service';
import { TinTucModel } from './../../../models/TinTuc/tintuc';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { ClassicEditor } from 'src/public/ckeditor5-build-classic/ckeditor';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as EventEmitter from 'events';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  taikhoan: any
  Noi_dung = ''
  choosefile = false;
  updateimg = false;
  url: any;
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
  tintuc: TinTucModel
  dstintuc: TinTucModel[] = [];
  dstintucsearch: TinTucModel[] = [];
  keyword: string;
  KiemTraThongTin = false;
  imagePath = ['https://cdn.iconscout.com/icon/free/png-256/gallery-187-902099.png']
  constructor(private tintucService: TintucService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.tintucService.getRefeshPage().subscribe(() => {
      this.tintuc = new TinTucModel()
    this.getdstintuc()
    })
    this.tintuc = new TinTucModel()
    this.getdstintuc()
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(this.firebaseConfig);
      firebase.analytics();
    } else {
      firebase.app(); // if already initialized, use that one
    }
  }


  // L???y th??ng tin t??i kho???n hi???n ??ang thao t??c
  getthongtintaikhoan() {
    this.taikhoan = JSON.parse(localStorage.getItem('loggedInAcount'));
  }

  getdstintuc() {
    this.tintucService.getListTinTuc().subscribe((res: any) => {
      this.dstintuc = res.tintucs;
      this.dstintucsearch = res.tintucs;
    })
  }

  // Ki???m tra file c?? ???????c upload hay kh??ng
  chooseFile(status) {
    let f;
    if (status === 'create') {
      f = document.querySelector('#photo') as HTMLInputElement;
    } else {
      if (status === 'update') {
        f = document.querySelector('#photoupdate') as HTMLInputElement;
      }
    }
    const file = f.files[0];
    if (file !== undefined) {
      this.imagePath[0] = '../../../assets/' + file.name
      document.getElementById('err_upload').style.display = 'none';
      this.choosefile = true;
    } else {
      this.choosefile = false
    }
  }

  // H??m chuy???n ?????i ti???ng Vi???t sang ti???ng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/??/g, 'd').replace(/??/g, 'D')
      ;
  }

  // H??m t??m ki???m theo t??n ho???c id
  SearchByKeyWord() {
    this.dstintuc = this.dstintucsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdstintuc();
    } else {
      this.dstintuc = this.dstintuc.filter(res => {
        const hoten = this.removeAccents(res.Tieu_de);
        const tmp2 = text.replace(/??/g, '');
        if (hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        }
      });
    }
  }

  SearchByOption(value) {
    this.dstintuc = this.dstintucsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'C?? nh???t') {
      this.getdstintuc();
    } else {
      if (target === 'M???i nh???t') {
        this.dstintuc.reverse();
      }
    }
  }

  // H??m ki???m tra th??ng tin
  KTNull(tintuc: TinTucModel) {
    this.KTNoiDung()
    const Tieu_de = tintuc.Tieu_de;
    const Noi_dung = tintuc.Noi_dung
    const thongtintintuc = [];
    thongtintintuc.push(Tieu_de, Noi_dung);
    for (const i in thongtintintuc) {
      if (thongtintintuc.hasOwnProperty(i)) {
        if (thongtintintuc[i] === undefined || thongtintintuc[i] === '' || thongtintintuc[i] === null) {
          window.alert('H??y nh???p ?????y ????? th??ng tin!');
          this.KiemTraThongTin = false;
          break;
        } else {
          this.KiemTraThongTin = true;
        }
      }
    }
  }

  //upload l??n firebase v?? g???i h??m l??u v??o csdl
  uploadImage(status) {
    this.tintuc.Noi_dung = this.Noi_dung
    this.KTNull(this.tintuc);
    if (this.KiemTraThongTin) {
      if (this.choosefile) {
        const ref = firebase.storage().ref();
        let f;
        if (status === 'create') {
          f = document.querySelector('#photo') as HTMLInputElement;
        } else {
          if (status === 'update') {
            f = document.querySelector('#photoupdate') as HTMLInputElement;
          }
        }
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
            //  alert("Image upload succesful")
            this.Luu(this.url, status);
          }
          );
      } else {
        if (status === 'create') {
          alert('Vui l??ng ch???n h??nh ???nh!')
        } else {
          if (status === 'update') {
            this.Luu(null, status);
          }
        }

      }
    }

  }

  // Ki???m tra n???i dung trong ckeditor
  KTNoiDung() {
    if (this.Noi_dung === '') {
      document.getElementById('err_content').style.display = 'block'
    } else {
      document.getElementById('err_content').style.display = 'none'

    }
  }

  // L??u v??o mongo
  Luu(url, status) {
    this.getthongtintaikhoan()
    this.tintuc.NhanVien_id = this.taikhoan.Nhan_vien_id

    if (url !== null) {
      this.tintuc.Anh_dai_dien = url;
      if (status === 'create') {
        this.tintucService.ThemTinTuc(this.tintuc).subscribe(data_them => {
          if (JSON.stringify(data_them) === '"T???o tin t???c th??nh c??ng!"') {
            this.choosefile = false
            this.modalService.dismissAll()

            // location.reload()
          }
          else {
            window.alert(data_them);
          }
        });
      } else {
        if (status === 'update') {
          this.tintucService.CapNhatTinTuc(this.tintuc).subscribe(data => {
            if (JSON.stringify(data) === '"C???p nh???t tin t???c th??nh c??ng!"') {
              this.choosefile = false
              this.modalService.dismissAll()

              // location.reload()
            }
            else {
              window.alert(data);
            }
          })
        }
      }
    } else {
      this.tintucService.CapNhatTinTuc(this.tintuc).subscribe(data => {
        if (JSON.stringify(data) === '"C???p nh???t tin t???c th??nh c??ng!"') {
          this.choosefile = false
          this.modalService.dismissAll()

          // location.reload()
        }
        else {
          window.alert(data);
        }
      })
    }
  }

  // H???p tho???i x??c nh???n h???y b??? t???o m???i
  open_cancel(content_cancel) {
    this.modalService.open(content_cancel, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false, windowClass: 'my-class' });
  }

  // H???y b??? t???o m???i
  Huy() {
    location.reload()
  }

  // Tin t???c chi ti???t
  open_update(content_update, tintuc) {
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false, size: 'lg' });
    this.tintuc = tintuc
    this.Noi_dung = tintuc.Noi_dung
    this.imagePath[0] = tintuc.Anh_dai_dien
  }

  open_delete(content_delete) {
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false, size: 'lg' });
  }

  XacNhanXoa() {
    this.tintucService.XoaTinTuc(this.tintuc._id).subscribe(dt => {
      this.modalService.dismissAll()
      // location.reload()
    })
  }
}
