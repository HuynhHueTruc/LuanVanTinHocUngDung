import { NotFoundComponent } from './../../modules/not-found/not-found.component';
import { AreaComponent } from './../../modules/charts/area/area.component';
import { CategoryComponent } from './../../modules/category/category.component';
import { OrderComponent } from './../../modules/order/order.component';
import { ReceiptComponent } from './../../modules/receipt/receipt.component';
import { ForgotpasswordComponent } from './../../modules/forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './../../modules/changepassword/changepassword.component';
import { ProfileComponent } from './../../modules/profile/profile.component';
import { StaffinfoComponent } from './../../modules/staffinfo/staffinfo.component';
import { PostsComponent } from './../../modules/posts/posts.component';
import { StoreComponent } from './../../modules/store/store.component';
import { ProductComponent } from './../../modules/product/product.component';
import { SupplierComponent } from './../../modules/supplier/supplier.component';
import { TypeoftreeComponent } from './../../modules/typeoftree/typeoftree.component';
import { SalesComponent } from './../../modules/sales/sales.component';
import { ShippingtypeComponent } from './../../modules/shippingtype/shippingtype.component';
import { CustomerComponent } from './../../modules/customer/customer.component';
import { PaymentComponent } from './../../modules/payment/payment.component';
import { BillofsaleComponent } from './../../modules/billofsale/billofsale.component';
import { StaffComponent } from './../../modules/staff/staff.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './../../modules/dashboard/dashboard.component';
import { MainComponent } from './../../modules/main/main.component';
import { DefaultComponent } from './default.component';
import { ShareModule } from './../../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbThemeModule, NbSidebarModule, NbLayoutModule, NbTreeGridModule, NbCardModule } from '@nebular/theme';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HighchartsChartModule } from 'highcharts-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgOtpInputModule } from 'ng-otp-input';
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    DefaultComponent,
    MainComponent,
    DashboardComponent,
    StaffComponent,
    BillofsaleComponent,
    PaymentComponent,
    CustomerComponent,
    ShippingtypeComponent,
    SalesComponent,
    TypeoftreeComponent,
    SupplierComponent,
    ProductComponent,
    StoreComponent,
    PostsComponent,
    StaffComponent,
    StaffinfoComponent,
    ProfileComponent,
    ChangepasswordComponent,
    ForgotpasswordComponent,
    ReceiptComponent,
    OrderComponent,
    CategoryComponent,
    AreaComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    NbThemeModule.forRoot(),
    ShareModule,
    NbSidebarModule,
    NbLayoutModule,
    RouterModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    HighchartsChartModule,
    CKEditorModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NbTreeGridModule,
    NbCardModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SmartTableModule,
    NbCardModule,
    NgxPaginationModule
  ]
})
export class DefaultModule { }
