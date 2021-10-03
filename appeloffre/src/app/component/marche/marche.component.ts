import { Component, OnInit, Inject } from '@angular/core';
import { HttpService } from 'src/app/service/http-service.service';
import { Marche } from 'src/app/modele/marche';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Catalogue } from 'src/app/modele/catalogue';

@Component({
  selector: 'app-marche',
  templateUrl: './marche.component.html',
  styleUrls: ['./marche.component.css']
})
export class MarcheComponent implements OnInit {
  listeMarche: any;
  listeCatalogue: Catalogue[];
  catalogueid:number;
  marcheid : number;
  id:number;

  constructor(private httpService: HttpService,private excelService:ExcelExportService, private httpclient:HttpClient,
    public dialog: MatDialog,public dialogRef: MatDialogRef<MarcheComponent>,
    @Inject(MAT_DIALOG_DATA) id) { 
      if (this.id != null) {
        this.id = this.id;
      }else{
           this.id = null;
      }
    }

  ngOnInit() {
    this.getListeMarches();
  }
  appliquer(): void {
    this.dialogRef.close({catalogueid : this.catalogueid, marcheid : this.marcheid});
  }
 
  getListeMarches() {
    this.httpService.get('http://localhost:8084/Marche',{})
      .subscribe(
        data => {
          this.listeMarche = data[0];
        }
      );
  }

  getListeCatalogueParMarche(marcheid) {
    let params = new HttpParams();
    params= params.append('mar',marcheid);
    if(params!=undefined){
    this.httpclient.get('http://localhost:8084/Catalogue/search/ByMarche',{params})
      .subscribe(
        data => {
          this.listeCatalogue = data;
        },err=>{
          console.log(err);
        }
      );
    }
  }
 
}
