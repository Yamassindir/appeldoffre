import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormService } from '../form.service';
import { from, of, Observable, zip } from 'rxjs';
import { groupBy, mergeMap, switchMap, flatMap, reduce, map, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatGroupBy, Grouping } from '../../lib/groupBy';
import { MatTableDataSource } from '../../lib/table-data-source';
import { Produit } from 'src/app/modele/produit';

@Component({
  selector: 'app-demande-produit',
  templateUrl: './demande-produit.component.html',
  styleUrls: ['./demande-produit.component.css'],
  providers: [ FormService ]
})
export class DemandeProduitComponent implements OnInit {

  listeFichierExcel: any;
  listeProduitsAEnvoyer: any;
  listeProduits: any;
  listeProduitsDem: any;

  listeDevisProd: any;
  listeGrouped: any;

  
  step: FormGroup

  displayedColumns: string[] = ['quantite', 'reference', 'designation', 'prixliste','prixcat'];
  dataSource = new MatTableDataSource<Produit>();
  

  constructor(private httpService: HttpService, private excelService: ExcelExportService,
    private httpclient: HttpClient, private formService: FormService, private _formBuilder: FormBuilder,
    private matGroupBy: MatGroupBy ) {
    this.formService.stepReady(this.step, 'two');
    
  }


  ngOnInit() {
    this.listeGrouped = [];
    this.listeDevisProd = [];
    this.listeProduitsDem = [];
    this.listeProduits = [];
    this.step = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
      liste : [[]]
    });
  }


  charger(ev){
    this.formService.onFileChange(ev);
  }
  @Output() devis = new EventEmitter<any[]>();


  rechercheFichierExcel(){
    this.formService.rechercheByReferencesFichierExcel();
  }
  generer(){
    this.listeDevisProd=this.formService.generationDevisProduit();
    this.matGroupBy.grouping = new Grouping(['type']);
    this.dataSource.groupBy = this.matGroupBy;
    this.dataSource.data = this.listeDevisProd;
    this.devis.emit(this.listeDevisProd);
  }

}
