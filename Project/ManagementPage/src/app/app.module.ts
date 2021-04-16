import { RouterModule, Routes } from '@angular/router';
import { DefautGuard } from './../guard/defaut.guard';
import { ShareModule } from './share/share.module';
import { DefaultModule } from './layout/default/default.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { ErrorComponent } from './modules/error/error.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { DatePipe } from '@angular/common';


// import { AngularFirestore } from '@angular/fire/firestore/firestore';
// import { CKEditorModule } from 'ckeditor4-angular'; Này là full
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DefaultModule,
    HttpClientModule,
    ShareModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbSidebarModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    // BackButtonDisableModule.forRoot({ preserveScrollPosition: true}),
    NgbModule,
    CKEditorModule,
    NbInputModule,
    NbTreeGridModule,

  ],
  providers: [
    DefautGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
