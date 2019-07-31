import { Component, OnInit, OnDestroy, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FileService } from './file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {

  @Input() enableMultiple = true;
  @Input() show = true;

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @ViewChild('fileInputFolder', { static: true }) fileInputFolder: ElementRef;
  @Output() fileList: EventEmitter<FileList> = new EventEmitter<FileList>();

  constructor(public fileService: FileService,
  ) {
  }
  addListener(event) {
    event.stopPropagation();
    event.preventDefault();
    this.fileService.drop = true;
  }

  chooseFile() {
    this.fileInput.nativeElement.click();
  }

  chooseFolder() {
    this.fileInputFolder.nativeElement.click();
  }

  getFile($event) {
    if (!$event) {
      return;
    }
    const name = '';
    const type = '';
    let fileList: FileList;
    if ($event.dataTransfer && $event.dataTransfer.files && $event.dataTransfer.files.length > 0) {
      fileList = $event.dataTransfer.files;
    } else if ($event.dataTransfer && $event.dataTransfer.files) {
      console.log('no files attached to $event.dataTransfer');
      return [name, type, undefined, undefined];
    }

    if ($event.target && $event.target.files && $event.target.files.length > 0) {
      fileList = $event.target.files;
    } else if ($event.target && $event.target.files) {
      console.log('no files attached to $event.target');
      return [name, type, undefined, undefined];
    }

    if (fileList) {
      this.fileList.emit(fileList);
    }
    setTimeout(() => { this.fileInput.nativeElement.value = null; }, 0);
  }

  ngOnDestroy(): void {
    this.fileService.enableFullscreenDropZone = false;
  }

  ngOnInit(): void {
    document.addEventListener('dragenter', this.addListener.bind(this));
    this.fileService.enableFullscreenDropZone = true;
    this.fileService.onFileList.subscribe(fileList => {
      {
        this.fileList.emit(fileList);
      }
    });
  }
}
