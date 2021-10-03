import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { NumberFormatStyle } from '@angular/common';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public writeExcelFile(data:any[]):void{
    const ws_name = 'SomeSheet';
    const wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = XLSX.utils.format_cell;
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    //ajouter un worksheet
    
    //write : nom client ; nom projet ; Date de creation

    //write données : 
      
    // s: CellAddress, e: CellAddress r: Range
   /* for(var R = Range.s.r; R <= Range.e.r; ++R) {
      for(var C = Range.s.c; C <= Range.e.c; ++C) {
        var cell_address = {c:C, r:R};
        var cell_ref = XLSX.utils.encode_cell(cell_address);
        var XLSX.write(data,cell_ref);
      }
    }*/
  }
}
