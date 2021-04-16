import { AreaComponent } from './modules/charts/area/area.component';
import { CategoryComponent } from './modules/category/category.component';
import { OrderComponent } from './modules/order/order.component';
import { ReceiptComponent } from './modules/receipt/receipt.component';
import { CartComponent } from './modules/cart/cart.component';
import { ForgotpasswordComponent } from './modules/forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './modules/changepassword/changepassword.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { StaffinfoComponent } from './modules/staffinfo/staffinfo.component';
import { ProductComponent } from './modules/product/product.component';
import { PaymentComponent } from './modules/payment/payment.component';
import { SupplierComponent } from './modules/supplier/supplier.component';
import { TypeoftreeComponent } from './modules/typeoftree/typeoftree.component';
import { SalesComponent } from './modules/sales/sales.component';
import { BillofsaleComponent } from './modules/billofsale/billofsale.component';
import { ShippingtypeComponent } from './modules/shippingtype/shippingtype.component';
import { CustomerComponent } from './modules/customer/customer.component';
import { PostsComponent } from './modules/posts/posts.component';
import { MainComponent } from './modules/main/main.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DefautGuard } from './../guard/defaut.guard';
import { DefaultComponent } from './layout/default/default.component';
import { LoginComponent } from './modules/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { StaffComponent } from './modules/staff/staff.component';
import { StoreComponent } from './modules/store/store.component';

const routes: Routes = [
  // Tự động chuyển sang trang Login khi load, set pathMatch: 'full' để tránh vòng lặp tìm path vô hạn
 { path: '', redirectTo: '/login', pathMatch: 'full' },
 { path: 'login', component: LoginComponent},
 { path: 'forgotpassword', component: ForgotpasswordComponent},
 { path: 'default', component: DefaultComponent, canActivate: [DefautGuard],
                    children: [
                      {path: '', component: OrderComponent},
                      {path: 'posts', component: PostsComponent},
                      {path: 'staff', component: StaffComponent},
                      {path: 'staffinfo', component: StaffinfoComponent,
                        children: [
                          {path: '', component: ProfileComponent},
                          {path: 'profile', component: ProfileComponent},
                          {path: 'changepassword', component: ChangepasswordComponent},
                        ]},
                      {path: 'reciept', component: ReceiptComponent},
                      {path: 'customer', component: CustomerComponent},
                      {path: 'shippingtype', component: ShippingtypeComponent},
                      {path: 'billofsale', component: BillofsaleComponent},
                      {path: 'cart', component: CartComponent},
                      {path: 'sales', component: SalesComponent},
                      {path: 'typeoftree', component: TypeoftreeComponent},
                      {path: 'supplier', component: SupplierComponent},
                      {path: 'payment', component: PaymentComponent},
                      {path: 'product', component: ProductComponent},
                      {path: 'store', component: StoreComponent},
                      {path: 'category', component: CategoryComponent},
                      {path: 'area', component: AreaComponent}

                    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
