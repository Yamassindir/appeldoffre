import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subject, Observable, from, of, zip, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { groupBy, mergeMap, switchMap, flatMap, reduce, map, toArray } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FormService {


  private creationDemandeSource: Subject<FormGroup> = new Subject();
  stepDemande: Observable<FormGroup> = this.creationDemandeSource.asObservable();

  private demandeProduitSource: Subject<FormGroup> = new Subject();
  stepProduit: Observable<FormGroup> = this.demandeProduitSource.asObservable();

  private demandeAbonnementSource: Subject<FormGroup> = new Subject();
  stepAbonnement: Observable<FormGroup> = this.demandeAbonnementSource.asObservable();

  private demandeMaintenanceSource: Subject<FormGroup> = new Subject();
  stepMaintenance: Observable<FormGroup> = this.demandeMaintenanceSource.asObservable();

  private demandeServiceSource: Subject<FormGroup> = new Subject();
  stepService: Observable<FormGroup> = this.demandeServiceSource.asObservable();

  mainForm: FormGroup = this._formBuilder.group({
    projetnom: '',
    clientnom: '',
    extraName: '',
    nessie: '',
    listeDevisProd: []
  })

  listeFichierExcel: any = [];
  listeProduitsAEnvoyer: any = [];
  listeProduits: any = [];
  listeProduitsDem: any = [];
  listeGrouped: any = [];
  listeDevisProd: any;






  constructor(
    private _formBuilder: FormBuilder, private httpService: HttpService, private excelService: ExcelExportService,
    private httpclient: HttpClient
  ) {


    this.stepDemande.subscribe(form =>
      form.valueChanges.subscribe(val => {
        this.mainForm.value.projetnom = val.projetnom;
      })
    )
    /* this.stepProduit.subscribe(form =>
       form.valueChanges.subscribe(val => {
 
       })
     )
     this.stepAbonnement.subscribe(form =>
       form.valueChanges.subscribe(val => {
 
       })
     )
     this.stepMaintenance.subscribe(form =>
       form.valueChanges.subscribe(val => {
 
       })
     )
     this.stepService.subscribe(form =>
       form.valueChanges.subscribe(val => {
 
       })
     )*/
  }
  stepReady(form: FormGroup, part) {
    switch (part) {
      case 'one': { this.creationDemandeSource.next(form) }
      case 'two': { this.demandeProduitSource.next(form) }
      case 'tree': { this.demandeAbonnementSource.next(form) }
      case 'four': { this.demandeMaintenanceSource.next(form) }
      case 'five': { this.demandeServiceSource.next(form) }
    }
  }



  // chargement et lecture d'un fichier excel
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        console.log(initial);
        return initial;
      }, {});
      this.listeFichierExcel = [];
      for (let propriete in jsonData) {
        this.listeFichierExcel = this.listeFichierExcel.concat(jsonData[propriete]);
      }
      this.listeProduitsDem = this.listeFichierExcel;
    }
    reader.readAsBinaryString(file);
  }

  //Mise à jour avec xlsx 
  rechercheByReferencesFichierExcel() {
    if (this.listeFichierExcel != null) {
      let listeRefe = this.listeFichierExcel.map(item => item.reference)
        .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe);
    }
  }

  //Mise à jour avec xlsx 
  getByListReference(listRef) {
    let params = new HttpParams();
    params = params.append('ref', listRef.toString());
    this.httpclient.get("http://localhost:8084/Prod/search/byRef", { params })
      .subscribe(
        data => {
          this.listeProduits = data;
        });
  }

  generationDevisProduit() {
    this.listeDevisProd = this.listeProduitsDem;
    this.listeDevisProd.forEach(element => {
      let index =this.listeProduits.find(art => art.reference == element.reference);
      if(index && element){
        element.type = index.type;
        element.prixliste = index.prixliste * element.quantite;
        element.prixcat = index.prixcat * element.quantite;
        element.designation = index.designation;
        element.produitid = index.produitid;
      }else{
         alert("La référence"+ element.reference + "n'est pas présente dans aucun catalogue");
      }
    });
    from(this.listeDevisProd)
      .pipe(
        groupBy(produit => produit.type),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
      )
      .subscribe(val => {
        this.listeGrouped.push(val)
      },
      );
    console.log("grouped", this.listeGrouped);
    return this.listeDevisProd;
  }





}
