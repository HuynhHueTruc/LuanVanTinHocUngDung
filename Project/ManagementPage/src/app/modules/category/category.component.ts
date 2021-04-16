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
  constructor(private danhmucService: DanhmucService, private modalService: NgbModal, private loaicayService: LoaicayService) { }

  ngOnInit(): void {
    this.getdsdanhmuc()
    this.getdsloaicay()
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
      this.dsdanhmuc = res.danhmucs;
      this.dsdanhmucsearch = res.danhmucs;
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

  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      ;
  }

  // Hàm tìm kiếm theo tên hoặc id
  SearchByKeyWord() {
    this.dsdanhmuc = this.dsdanhmucsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdsdanhmuc();
    } else {
      this.dsdanhmuc = this.dsdanhmuc.filter(res => {
        const ten = this.removeAccents(res.Ten_danh_muc);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/·/g, '');
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
    if (target === 'Cũ nhất') {
      this.getdsdanhmuc();
    } else {
      if (target === 'Mới nhất') {
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
  // Đóng dialog
  DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }

  // Kiểm tra trùng id trong mảng danhmucnho
  KiemTraTrungDMN_id(tendanhmucnho) {
    let bool = true
    // for (const i in this.danhmuc.Danh_muc_nho) {
    //   if (this.danhmuc.Danh_muc_nho[i].Ten_danh_muc_nho === tendanhmucnho){
    //     bool = false
    //     return bool
    //   }else{
    //     bool = true
    //   }
    // }
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

  //Nếu không có Loai-cay thì không hiển thị tiêu đề Loại cây trong table
  KiemTraLoaiCay(danhmuc) {
    for (const i in danhmuc.Danh_muc_nho) {
      if (danhmuc.Danh_muc_nho[i].Loai_cay === undefined) {
        return false
      } else {
        return true
      }

    }
  }

  // Nếu không có Loai_cay thì không hiển thị nội dung trống trong table
  KiemTraLoaiCay_id(eachDMN) {
    if (eachDMN.Loai_cay === undefined) {
      return false
    } else {
      return true
    }
  }

  ThemDanhMucNho(content_update) {
    if (this.subdanhmucnho.Ten_danh_muc_nho === '') {
      alert('Vui lòng nhập tên danh mục nhỏ!')
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

  // Xóa danh mục nhỏ
  XoaDanhMucNho(e, index, content_delete) {
    for (const i in this.danhmuc.Danh_muc_nho) {
      if (this.danhmuc.Danh_muc_nho[i].DMN_id === e.DMN_id) {
        this.danhmuc.Danh_muc_nho.splice(Number.parseInt(index), 1)
      }
    }
  }


  CapNhatDanhMuc() {
    this.danhmucService.CapNhatDanhMucNho(this.danhmuc).subscribe()
    this.DongModal()

  }
}
