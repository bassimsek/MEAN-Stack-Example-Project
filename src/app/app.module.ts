import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatListModule,
  MatIconModule,
  MatOptionModule,
  MatTableModule,
  MatSelectModule,
  MatSortModule,
  MatDialogModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { SendMessageComponent } from './posts/send-message/send-message.component';
import { HeaderComponent } from './header/header.component';
import { OutboxComponent } from './posts/outbox/outbox.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MyUserInfoComponent } from './auth/my-user-info/my-user-info.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { WelcomeComponent } from './posts/welcome/welcome.component';
import { InboxComponent } from './posts/inbox/inbox.component';
import { ShowUsersComponent } from './admin/show-users/show-users.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { ShowLogsComponent } from './admin/show-logs/show-logs.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SendMessageComponent,
    HeaderComponent,
    OutboxComponent,
    InboxComponent,
    LoginComponent,
    SignupComponent,
    MyUserInfoComponent,
    ChangePasswordComponent,
    ShowUsersComponent,
    ShowLogsComponent,
    CreateUserComponent,
    UpdateUserComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatListModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    HttpClientModule
  ],
  // HTTP_INTERCEPTOR'a ek olarak kendi tanımladığımız interceptoru kullandık asagida
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
  /* entryComponents array router ya da selector'la oluşturulmayan componentlerı bir sekilde
  hazır bulundurmak icin kullanılıyor */
})
export class AppModule { }
