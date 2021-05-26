import { OrderTrackingComponent } from './modules/order-tracking/order-tracking.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { DetailComponent } from './modules/detail/detail.component';
import { ServiceComponent } from './modules/service/service.component';
import { SupportsComponent } from './modules/supports/supports.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { ContentComponent } from './modules/content/content.component';
import { TypetreeComponent } from './modules/typetree/typetree.component';
import { ForgotpasswordComponent } from './modules/forgotpassword/forgotpassword.component';
import { StoreComponent } from './modules/store/store.component';
import { ProductComponent } from './modules/product/product.component';
import { CartComponent } from './modules/cart/cart.component';
import { ChangepasswordComponent } from './modules/changepassword/changepassword.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { CustomerinfoComponent } from './modules/customerinfo/customerinfo.component';
import { DefautGuard } from './../guard/defaut.guard';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { PostsComponent } from './modules/posts/posts.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';
import { NgModule, Component } from '@angular/core';
// import { Routes, RouterModule, CanActivate } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IvyCarouselModule } from 'angular-responsive-carousel';


const routes: Routes = [
  // Tự động chuyển sang trang Login khi load, set pathMatch: 'full' để tránh vòng lặp tìm path vô hạn
  { path: '', redirectTo: '/default', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'default', component: DefaultComponent,
    children:
    [
      { path: '', component: ContentComponent },
      { path: 'typetree/:_id', component: TypetreeComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'product/:_id', component: ProductComponent },
      { path: 'supports', component: SupportsComponent },
      { path: 'service', component: ServiceComponent },

    ]
  },
  {
    path: 'customerinfo', component: CustomerinfoComponent,
    children:
    [
      { path: '', component: ProfileComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'changepassword', component: ChangepasswordComponent }
    ]
  },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'store', component: StoreComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'order_tracking', component: OrderTrackingComponent },
  { path: 'detail/:_id', component: DetailComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
  // { path: 'tree/:id', component: TypetreeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' },), IvyCarouselModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponent = [DefaultComponent,
// TypetreeComponent];
