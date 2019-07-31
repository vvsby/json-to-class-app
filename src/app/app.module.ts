import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';

import { HighlightModule } from 'ngx-highlightjs';
import typescript from 'highlight.js/lib/languages/typescript';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { environment } from '../environments/environment';
import { ParseService } from './services/parse.service';
import { FileUploadComponent } from './services/file-upload/file-upload.component';
import { HeaderFormComponent } from './components/header/header-form/header-form.component';
import { CodeBoxTextareaComponent } from './components/code-box-textarea/code-box-textarea.component';
import { CodeBoxCodeComponent } from './components/code-box-code/code-box-code.component';
import { AppRoutingModule } from './app-routing.module';

export function hljsLanguages() {
  return [
    { name: 'typescript', func: typescript }
  ];
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderFormComponent,
    CodeBoxTextareaComponent,
    CodeBoxCodeComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule
  ],
  providers: [
    ParseService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
