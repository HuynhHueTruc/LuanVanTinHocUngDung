import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { LoaicayService } from '../../../services/LoaiCay/loaicay.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  danhmuc: DanhMucModel
  dsdanhmuc: DanhMucModel[] = [];
  dsdanhmucsearch: DanhMucModel[] = [];
  dsloaicay: LoaiCayModel
  keyword: string;
  danhmucnhotmp = []
  subdanhmucnho: DanhMucNhoModel
  dropdownSettings: IDropdownSettings;
  loaicaytmp = []
  Ten_loai_cay = ''
  danhmucs: DanhMucModel[] = []
  p: number = 1
  hienthi = false
  constructor(private danhmucService: DanhmucService, private modalService: NgbModal, private loaicayService: LoaicayService) { }

  ngOnInit(): void {
    this.danhmucService.getRefeshPage().subscribe(() => {
      this.getdsdanhmuc()
    })
    this.getdsdanhmuc()

    this.dropdownSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_loai_cay',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  getdsdanhmuc() {
    this.danhmucService.getListDanhMuc().subscribe((res: any) => {
      // this.dsdanhmuc = res.danhmucs;
      this.dsdanhmucsearch = res.danhmucs;
      this.danhmucs = res.danhmucs
      this.getdsloaicay()
      this.ChuyenTrang(this.p)
      
    })
  }

  getdsloaicay() {
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays
    })
  }


  KiemTraDanhMucNho(i) {
    if (this.dsdanhmuc[i].Danh_muc_nho[0] === undefined) {
      return false
    } else {
      return true
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
    this.dsdanhmuc = this.dsdanhmucsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdsdanhmuc();
    } else {
      this.dsdanhmuc = this.dsdanhmuc.filter(res => {
        const ten = this.removeAccents(res.Ten_danh_muc);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/??/g, '');
        if (ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });
    }
  }

  SearchByOption(value) {
    this.dsdanhmuc = this.dsdanhmucsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'C?? nh???t') {
      this.getdsdanhmuc();
    } else {
      if (target === 'M???i nh???t') {
        this.dsdanhmuc.reverse();
      }
    }
  }

  open_update(content_update, eachDanhMuc) {
    this.danhmuc = eachDanhMuc
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
  }

  open_category_plus(content_info_category_plus) {
    this.subdanhmucnho = new DanhMucNhoModel()
    this.subdanhmucnho.Ten_danh_muc_nho = ''
    this.subdanhmucnho.Loai_cay = ''
    this.subdanhmucnho.DMN_id = ''
    this.loaicaytmp = []
    this.modalService.open(content_info_category_plus, {
      ariaLabelledBy: 'mmodal-basic-title-info-mail-plus',
      backdrop: 'static', keyboard: false
    });
  }
  // ????ng dialog
  DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }

  // Ki???m tra tr??ng id trong m???ng danhmucnho
  KiemTraTrungDMN_id(tendanhmucnho) {
    let bool = true

    for (const i in this.dsdanhmuc) {
      for (const j in this.dsdanhmuc[i].Danh_muc_nho) {
        if (this.dsdanhmuc[i].Danh_muc_nho[j].Ten_danh_muc_nho === tendanhmucnho) {
          bool = false
          return bool
        } else {
          bool = true
        }
      }
    }
    return bool
  }

  //N???u kh??ng c?? Loai-cay th?? kh??ng hi???n th??? ti??u ????? Lo???i c??y trong table
  KiemTraLoaiCay(danhmuc) {
    for (const i in danhmuc.Danh_muc_nho) {
      if (danhmuc.Danh_muc_nho[i].Loai_cay === undefined || danhmuc.Danh_muc_nho[i].Loai_cay === '') {
        return false
      } else {
        return true
      }

    }
  }

  // N???u kh??ng c?? Loai_cay th?? kh??ng hi???n th??? n???i dung tr???ng trong table
  KiemTraLoaiCay_id(eachDMN) {
    if (eachDMN.Loai_cay === undefined || eachDMN.Loai_cay === '') {
      return false
    } else {
      for (const i in this.dsloaicay){
        if (this.dsloaicay[i]._id === eachDMN.Loai_cay){
          this.Ten_loai_cay = this.dsloaicay[i].Ten_loai_cay
        }
      }
      return true
    }
  }

  ThemDanhMucNho(content_update) {
    if (this.subdanhmucnho.Ten_danh_muc_nho === '') {
      alert('Vui l??ng nh???p t??n danh m???c nh???!')
    } else {
      if (this.loaicaytmp[0] !== undefined) {
        this.subdanhmucnho.Loai_cay = this.loaicaytmp[0]._id
      }
      if (this.KiemTraTrungDMN_id(this.subdanhmucnho.Ten_danh_muc_nho)) {
        this.danhmuc.Danh_muc_nho.push(this.subdanhmucnho)
        this.modalService.dismissAll();
        this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
      } else {
        document.getElementById('errSubCategory').style.display = 'block'
      }
    }

  }

  // X??a danh m???c nh???
  XoaDanhMucNho(e, index, content_delete) {
    for (const i in this.danhmuc.Danh_muc_nho) {
      if (this.danhmuc.Danh_muc_nho[i].DMN_id === e.DMN_id) {
        this.danhmuc.Danh_muc_nho.splice(Number.parseInt(index), 1)
      }
    }
  }


  CapNhatDanhMuc() {
    this.danhmucService.CapNhatDanhMucNho(this.danhmuc).subscribe(dt => {
      this.modalService.dismissAll()
    })

  }

    
  HienThiMa() {
    this.hienthi = true
    document.getElementById('AnMa').style.display = 'block'
    document.getElementById('HienThiMa').style.display = 'none'
  }

  AnMa() {
    this.hienthi = false
    document.getElementById('AnMa').style.display = 'none'
    document.getElementById('HienThiMa').style.display = 'block'

  }

  ChuyenTrang(number) {
    this.dsdanhmuc = []
    for (let i = 0; i < 5; i++) {
      if ((this.danhmucs[((number - 1) * 5) + i]) !== undefined) {
        this.dsdanhmuc.push(this.danhmucs[((number - 1) * 5) + i]);
      }
    }
  }
}
