import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
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
    HighlightModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule
  ],
  providers: [
    ParseService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
