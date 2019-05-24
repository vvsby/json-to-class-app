import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import hljs from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';
import { HighlightResult } from 'ngx-highlightjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('code')
  codeElement: ElementRef;

  str = '';
  firstClassName = 'FirstClass';
  templateForDuplicates = 'MustBeRenaimed';
  url: string;
  inputText: string;
  otputText: any[];
  classArray: any[] = [];
  classNamesArray: string[] = [];
  showResult = '';
  response: HighlightResult;

  constructor(
    public http: HttpClient
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    hljs.registerLanguage('typescript', typescript);
    hljs.highlightBlock(this.codeElement.nativeElement);
  }
  getText() {
    let parsed;
    try {
      parsed = JSON.parse(this.inputText);
    } catch (err) {
      alert(err);
    }
    if (parsed) {
      let str = '';
      this.initArrays();
      this.createClass(parsed, this.checkClassName(this.firstClassName));
      for (const key in this.classArray) {
        if (key) {
          str += this.classArray[key] + '\r\n';
        }
      }
      this.showResult = str;
    }
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
                console.log(key);
                console.log(obj[key]);
                const text = this.getTypeFinal(obj[key], key);
                console.log(text)
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
   * Get JSON data from URL
   */
  getFromUrl() {
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
    const string = this.createClass(obj, name + 'Class');
    return string;
  }

}
