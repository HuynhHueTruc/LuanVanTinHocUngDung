import { KhuyenmaiService } from 'src/services/KhuyenMai/khuyenmai.service';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { Router } from '@angular/router';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  href = '';
  sanpham_id;
  dssanpham: SanPhamModel;
  sanphamdetail: SanPhamModel[] = [];
  dskhuyenmai: KhuyenMaiModel[] = [];
  arrKhuyenMai: KhuyenMaiModel[] = [];
  khuyenmai: KhuyenMaiModel;

  checkAll = false;
  checked = [];
  lengthdssanpham = 0;
  lengthchecked = 0;
  tong_tien = 0;
  So_luong = 0;
  constructor(private giohangService: GiohangService, private router: Router, private sanphamService: SanphamService,
              private khuyenmaiService: KhuyenmaiService) { }

  ngOnInit(): void {
    this.href = this.router.url;
    this.sanpham_id = this.href.replace('/detail/', '');
    this.getdssanpham();
  }

  getdssanpham() {
    let sd = 0;
    // const arrImg = [];
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;
      for (const i in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty(i)) {
          if (this.dssanpham[i]._id === this.sanpham_id) {
            this.sanphamdetail.push(this.dssanpham[i]);
          }
        }
      }
      this.getdskhuyenmai();
    });
  }

   // Lấy danh sách khuyến mãi
   getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
    });
  }

  // Mở Dialog xác nhận xóa giỏ hàng
  open_delete(content_delete, sanpham_id) {

  }

  // Đồng ý xóa các sản phẩm trong giỏ hàng
  XacNhan() {

  }

  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.lengthdssanpham; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.lengthdssanpham; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }

  // Bỏ chọn tất cả checkbox
  UnChecked() {
    this.checkAll = true;
    this.KTCheckedAll();
  }


  // Hàm kiểm tra checked tại các item
  KTChecked(i: string) {
    this.lengthchecked = 0;
    this.checked[i] = !this.checked[i];
    if (this.checkAll) {
      this.checkAll = false;
    }

    // Kiểm tra có checkbox nào được check hay không, nếu có thì hiển thị divbutton
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt]) {
          this.lengthchecked += 1;
          document.getElementById('divbutton').style.display = 'block';
          // break;
        } else {
          document.getElementById('divbutton').style.display = 'none';
        }
      }
    }
    // Nếu các checkbox đều được check thì checbox chechkAll cũng được check
    if (this.lengthchecked === this.checked.length) {
      this.checkAll = true;
    }
    // Mở divbutton khi có checkbox được check
    if (this.lengthchecked > 0) {
      document.getElementById('divbutton').style.display = 'block';

    }
  }

    // Tăng số lượng sản phẩm đặt mua
    ThemSoLuong(){
      if (this.So_luong < this.sanphamdetail[0].So_luong){
        this.So_luong += 1;
      }else{
        this.So_luong = this.sanphamdetail[0].So_luong;
      }
    }

    // Giảm số lượng sản phẩm đặt mua
    GiamSoLuong(){
      if (this.So_luong !== 1){
        this.So_luong -= 1;
      }
    }

    // Kiểm tra số lượng nhập vào thẻ input
    KiemTraSoLuong(){
      if (this.So_luong <= 0){
       const sl = document.getElementById('So_luong') as HTMLInputElement;
       sl.value = '';
      }
    }

    // Trả về số lượng mặt định khi con trỏ chuột nằm ngoài input trong khi giá trị input chưa hợp lệ
    So_luong_mac_dinh(){
      if (this.So_luong === null){
        this.So_luong = 1;
      }
      if (this.So_luong > this.sanphamdetail[0].So_luong){
        this.So_luong = this.sanphamdetail[0].So_luong;
      }
    }

}
