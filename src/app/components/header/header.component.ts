import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HighlightResult } from 'ngx-highlightjs';
import { HttpClient } from '@angular/common/http';
import { ClassField, Row, TabForSelect } from '../../classes/classes';
import { ParseService } from '../../services/parse.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('code', { static: true }) codeElement: ElementRef;

  tab = '  ';
  withInterfaces = true;
  tabArrays: TabForSelect[] = [
    { text: '2 spaces', value: '  ' },
    { text: '4 spaces', value: '    ' },
    { text: 'tab', value: ' ' },
    { text: 'none', value: '' }
  ];
  firstClassName = 'FirstClass';
  templateForDuplicates = 'MustBeRenaimed';
  url: string;
  inputText: string;
  showResult = '';

  constructor(
    public http: HttpClient,
    public parseService: ParseService
  ) { }

  ngOnInit() {
    this.inputText = this.parseService.getFromLS();
  }
  ngAfterViewInit() { }
  /**
   * Copy text from code field to clipboard
   */
  copyTextToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.showResult;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }
  getText() {
    this.showResult = this.parseService.getText(this.inputText);
  }
  getFromUrl() {
    const result = this.parseService.getFromUrl(this.url);
    this.inputText = result ? result : this.inputText;
    this.showResult = this.parseService.getText(this.inputText);
  }
  updateText() {
    this.refreshParameters();
    this.showResult = this.parseService.updateText();
  }
  refreshParameters() {
    this.parseService.templateForDuplicates = this.templateForDuplicates;
    this.parseService.firstClassName = this.firstClassName;
    this.parseService.tab = this.tab;
    this.parseService.withInterfaces = this.withInterfaces;
  }
}
