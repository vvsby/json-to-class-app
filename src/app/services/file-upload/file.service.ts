import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  drop = false;
  enableFullscreenDropZone = false;
  fileList: FileList;
  onFileList: EventEmitter<FileList> = new EventEmitter<FileList>();
  constructor() { }

  getFileList($event) {
    if (!$event) {
      return;
    }
    let fileList: FileList;
    if ($event.dataTransfer && $event.dataTransfer.files && $event.dataTransfer.files.length > 0) {
      fileList = $event.dataTransfer.files;
    }

    if ($event.target && $event.target.files && $event.target.files.length > 0) {
      fileList = $event.target.files;
    }
    if (fileList) {
      this.fileList = fileList;
      this.onFileList.emit(this.fileList);
    }
  }
}
