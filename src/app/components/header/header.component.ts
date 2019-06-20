import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HighlightResult } from 'ngx-highlightjs';
import { HttpClient } from '@angular/common/http';
import { ClassField, Row, TabForSelect } from '../../classes/classes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('code') codeElement: ElementRef;

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
  otputText: any[];
  classArray: any[] = [];
  classNamesArray: string[] = [];
  showResult = '';
  response: HighlightResult;
  arrayOfClasses: ClassField[];

  constructor(
    public http: HttpClient
  ) { }

  ngOnInit() {
    this.arrayOfClasses = [];
    this.inputText = this.getFromLS();
  }
  ngAfterViewInit() { }
  getText() {
    let parsed;
    try {
      parsed = JSON.parse(this.inputText);
      this.saveToLS(this.inputText);
    } catch (err) {
      alert(err);
    }
    if (parsed) {
      /* let str = ''; */
      this.initArrays();
      // this.createClass(this.getObjectFromArray(parsed), this.checkClassName(this.firstClassName));
      this.createClassRow(this.getObjectFromArray(parsed), this.checkClassName(this.firstClassName));
      /* for (const key in this.classArray) {
        if (key) {
          str += this.classArray[key] + '\r\n';
        }
      } */

      this.showResult = this.getOutputTexFromArray(this.arrayOfClasses); // str;
    }
  }
  updateText() {
    this.showResult = this.getOutputTexFromArray(this.arrayOfClasses);
  }
  getObjectFromArray(obj) {
    return Array.isArray(obj) ? this.getObjectFromArray(obj.shift()) : obj;
  }
  /**
   * Return input string with first big letter
   * @param str input string
   */
  firstBigLetter(str: string) {
    const response = str[0].toUpperCase() + str.substring(1, str.length);
    return response;
  }
  /**
   * Return string type of the object
   * @param obj input object
   */
  getType(obj) {
    const type = typeof obj;
    if (type !== 'object' && type !== 'undefined') {
      return type;
    } else if (obj === null || obj === undefined) {
      return 'any';
    } else if (Array.isArray(obj)) {
      return 'array';
    }
    return 'object';
  }
  /**
   * Main function for parsing
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFields(obj, parentObject?) {
    if (!Array.isArray(obj)) {
      return this.goByFieldsForObject(obj, parentObject);
    } else {
      return this.goByFieldsForArray(obj);
    }
  }
  /**
  * Parse arrays
  * @param obj input object for parsing
  * @param parentObject input parent object for parsing (optional |used for parsing arrays)
  */
  goByFieldsForArray(obj) {
    const typeOfFirstElement = this.goByFields(obj[0]);
    if (typeOfFirstElement !== 'any') {
      return typeOfFirstElement + '[]';
    } else {
      let typeForResponse = 'any';
      obj.forEach(element => {
        const typeOfNextElement = this.goByFields(element);
        if (typeOfNextElement !== 'any') {
          typeForResponse = typeOfNextElement;
        }
      });
      return typeForResponse + '[]';
    }
  }
  /**
   * Parse objects
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFieldsForObject(obj, parentObject?) {
    let response = '';
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key) {
          const type = this.getType(obj[key]);
          if (type === 'any' && parentObject) {
            response += '  ' + key + ': ' + this.findTypeInParent(parentObject, key) + ';\r\n';
          } else {
            if (type !== 'object' && type !== 'array') {
              response += '  ' + key + ': ' + type + ';\r\n';
            } else if (type === 'array') {
              if (this.getType(obj[key][0]) === 'object') {
                const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
                response += '  ' + key + ': ' + className + '[];\r\n';
                this.createClass(obj[key][0], className, obj[key]);
              } else if (this.getType(obj[key][0]) === 'array') { /* переделать */
                const text = this.getTypeFinal(obj[key], key);
                response += '  ' + key + ': ' + text + ';\r\n';
              } else {
                response += '  ' + key + ': ' + this.goByFields(obj[key][0], obj[key]) + '[]' + ';\r\n';
              }
            } else if (obj[key]) {
              const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
              response += '  ' + key + ': ' + className + ';\r\n';
              this.createClass(obj[key], className, obj);
            } else {
              response += '  ' + key + ': any;\r\n';
            }
          }
        }
      }
      return response;
    } else {
      return obj ? typeof obj : 'any';
    }

  }
  /**
   * Main function for parsing
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFieldsRows(obj, parentObject?) {
    if (!Array.isArray(obj)) {
      return this.goByFieldsForObjectRows(obj, parentObject);
    } else {
      return []; // this.goByFieldsForArrayRows(obj);
    }
  }
  /**
   * Parse objects
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFieldsForObjectRows(obj, parentObject?) {
    const response: Row[] = [];
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key) {
          const type = this.getType(obj[key]);
          if (type === 'any' && parentObject) {
            response.push({ name: key, type: this.findTypeInParent(parentObject, key) });
            // response += '  ' + key + ': ' + this.findTypeInParent(parentObject, key) + ';\r\n';
          } else {
            if (type !== 'object' && type !== 'array') {
              response.push({ name: key, type: type });
              // response += '  ' + key + ': ' + type + ';\r\n';
            } else if (type === 'array') {
              if (this.getType(obj[key][0]) === 'object') {
                const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
                response.push({ name: key, type: className + '[]' });
                // response += '  ' + key + ': ' + className + '[];\r\n';
                this.createClassRow(obj[key][0], className, obj[key]);
              } else if (this.getType(obj[key][0]) === 'array') { /* переделать */
                console.log(key);
                console.log(obj[key]);
                const text = this.getTypeFinalRow(obj[key], key);
                console.log(text);
                response.push({ name: key, type: text });
                // response += '  ' + key + ': ' + text + ';\r\n';
              } else {
                response.push({ name: key, type: this.goByFields(obj[key][0], obj[key]) + '[]' });
                // response += '  ' + key + ': ' + this.goByFields(obj[key][0], obj[key]) + '[]' + ';\r\n';
              }
            } else if (obj[key]) {
              const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
              response.push({ name: key, type: className });
              // response += '  ' + key + ': ' + className + ';\r\n';
              this.createClassRow(obj[key], className, obj);
            } else {
              response.push({ name: key, type: 'any' });
              // response += '  ' + key + ': any;\r\n';
            }
          }
        }
      }
      return response;
    } else {
      return [];
    }

  }


  /**
  * Parse arrays
  * @param obj input object for parsing
  * @param parentObject input parent object for parsing (optional |used for parsing arrays)
  */
  goByFieldsForArrayRows(obj) {
    const typeOfFirstElement = this.goByFields(obj[0]);
    if (typeOfFirstElement !== 'any') {
      return typeOfFirstElement + '[]';
    } else {
      let typeForResponse = 'any';
      obj.forEach(element => {
        const typeOfNextElement = this.goByFields(element);
        if (typeOfNextElement !== 'any') {
          typeForResponse = typeOfNextElement;
        }
      });
      return typeForResponse + '[]';
    }
  }
  /**
   * Create new class for the class array
   */
  createClass(obj, name: string, parent?) {
    const className = this.firstBigLetter(name);
    this.classNamesArray.push(className);
    let response = '';
    response = 'class ' + className + ' {\r\n';
    response += this.goByFields(obj, parent);
    response += '}';
    this.classArray[className] = response;
    return className;
  }
  /**
   * Create new class for the class array
   */
  createClassRow(obj, name: string, parent?) {
    const className = this.firstBigLetter(name);
    this.arrayOfClasses.push(new ClassField({ name: className, arrayOfRows: this.goByFieldsRows(obj, parent) }));
    return className;
  }
  /**
   * Get JSON data from URL
   */
  getFromUrl() {
    console.log(this.arrayOfClasses);
    if (this.url) {
      try {
        this.http.get(this.url).subscribe(response => {
          this.inputText = JSON.stringify(response);
          this.getText();
        });
      } catch (err) {
        alert(err);
      }

    } else {
      alert('Empty URL!');
    }
  }
  /**
   * Return classname with 'MustBeRenamed*' mask if class name was defined
   * @param name class name
   */
  checkClassName(name: string) {
    return this.classNamesArray.indexOf(name) < 0 ? name : this.checkClassName(this.templateForDuplicates + name);
  }
  /**
   * Initialize all arrays
   */
  initArrays() {
    this.classArray = [];
    this.classNamesArray = [];
    this.otputText = [];
    this.arrayOfClasses = [];
  }
  /**
   * Return type from other element in array
   * @param parentObject parent array
   * @param keyParent name property for type identification
   */
  findTypeInParent(parentObject?, keyParent?: string) {
    let type = 'any';
    if (Array.isArray(parentObject)) {
      parentObject.forEach(obj => {
        let response = '';
        response = this.goByFields(obj[keyParent]);
        if (response !== 'any') {
          type = response;
        }
      });
    }
    return type;
  }
  getTypeFinal(obj, name) {
    if (Array.isArray(obj)) {
      return this.getTypeFinal(obj[0], name) + '[]';
    }
    let string = 'any';
    if (obj && typeof obj === 'object') {
      string = this.createClass(obj, name + 'Class');
    } else {
      string = typeof obj;
    }
    return string;
  }
  getTypeFinalRow(obj, name) {
    if (Array.isArray(obj)) {
      return this.getTypeFinalRow(obj[0], name) + '[]';
    }
    let string = 'any';
    if (obj && typeof obj === 'object') {
      string = this.createClassRow(obj, name + 'Class');
    } else {
      string = typeof obj;
    }
    return string;
  }
  /**
   * Convert ClassField array into the result code
   * @param obj input ClassField array for convert
   */
  getOutputTexFromArray(obj: ClassField[]) {
    let str = '';
    obj.forEach(classRow => {
      if (this.withInterfaces) {
        str += 'export interface I' + classRow.name + '{\r\n';
        classRow.arrayOfRows.forEach(row => {
          str += this.tab + row.name + ': ' + row.type + ';\r\n';
        });
        str += '}\r\n\r\n';
      }
      str += 'export class ' + classRow.name + (this.withInterfaces ? (' implements I' + classRow.name) : '') + '{\r\n';
      classRow.arrayOfRows.forEach(row => {
        str += this.tab + row.name + ': ' + row.type + ';\r\n';
      });
      str += '\r\n' + this.tab + 'constructor(initObject: ' + (this.withInterfaces ? 'I' : '') + classRow.name + ') {\r\n';
      classRow.arrayOfRows.forEach(row => {
        str += this.tab + this.tab + 'this.' + row.name + ' = initObject && initObject.' + row.name + ';\r\n';
      });
      str += this.tab + '}\r\n';
      str += '}\r\n\r\n';
    });
    return str;
  }
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
  /**
   * Save @inputText to the localstorage
   */
  saveToLS(inputText: string) {
    window.localStorage.setItem('jsonForConvert', inputText);
  }
  /**
   * Read input text from the localstorage
   */
  getFromLS() {
    return window.localStorage.getItem('jsonForConvert') || '';
  }

}
