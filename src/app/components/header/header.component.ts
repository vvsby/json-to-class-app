import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParseService } from '../../services/parse.service';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('code', { static: true }) codeElement: ElementRef;
  inputText: string;
  showResult = '';

  constructor(
    public http: HttpClient,
    public parseService: ParseService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.inputText = this.parseService.getFromLS();
  }
  ngAfterViewInit() { }
  /**
   *  Funtion for converting file in string object! Read only first file!
   * */
  addFiles(fileList: FileList) {
    if (fileList[0].type === 'text/plain' || fileList[0].type === 'application/json') {
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        this.inputText = <string>reader.result;
        this.getText();
      });
      reader.readAsText(fileList[0]);
    } else {
      alert('We expect .json or .txt file. Please, convert your file.');
    }
  }
  copyTextToClipboard() {
    this.parseService.copyTextToClipboard(this.showResult);
  }
  getText() {
    this.showResult = this.parseService.getText(this.inputText);
    const responseText = 'The structure of your file is represented by the type: ' + this.parseService.responseText;
    this._snackBar.open(responseText, '', {
      duration: 3000
    });
  }
  getFromUrl(url: string) {
    const result = this.parseService.getFromUrl(url);
    this.inputText = result ? result : this.inputText;
    this.showResult = this.parseService.getText(this.inputText);
  }
  updateText() {
    this.showResult = this.parseService.updateText();
  }
}

