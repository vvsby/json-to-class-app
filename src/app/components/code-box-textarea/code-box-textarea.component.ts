import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-code-box-textarea',
  templateUrl: './code-box-textarea.component.html',
  styleUrls: ['./code-box-textarea.component.css']
})
export class CodeBoxTextareaComponent implements OnInit {
  @Input() text: string;
  @Output() textChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  update() {
    this.textChange.next(this.text);
  }
}
