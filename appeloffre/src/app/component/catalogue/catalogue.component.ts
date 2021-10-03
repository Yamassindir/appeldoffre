import { Component, OnInit } from '@angular/core';
import { Produit } from '../../modele/produit';
import { HttpService } from '../../service/http-service.service';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import { MatIconModule } from '@angular/material/icon';
import { Demande } from 'src/app/modele/demande';
import { forkJoin } from 'rxjs';
import { ModalProduitComponent } from '../modal-produit/modal-produit.component';
import {MatTableDataSource} from '@angular/material/table';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient,HttpParams } from '@angular/common/http';
import { MarcheComponent } from '../marche/marche.component';
import { ReferenceRemplacementComponent } from './reference-remplacement/reference-remplacement.component';


//import * as jspdf from 'jspdf';
//import html2canvas from 'html2canvas';



@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  name = 'This is XLSX TO JSON CONVERTER';
  feuil:string='feuil';

  catalogueid: number;
  eanRecherche: string;
  listeProduits: any;
  listeCatalogueBdd: any = [];
  listeProduitsAEnvoyer: any ;
  gen_id: number = 0;
  href : string="http://localhost:8084/Prod";
  listeFichierExcel: any;
  listeMAJ:any;
  cat: string;
  listeProduitRemplacement:any;


  
  constructor(private httpService: HttpService,private excelService:ExcelExportService, private httpclient:HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.listeProduitsAEnvoyer = [];
    this.openDialog();
  }

  //dialog pour visualiser ou modifier des refs de remplacement
  openRefRemplacement(produit) {
    const dialogRef = this.dialog.open(ReferenceRemplacementComponent, {
      width: '300px',
      data: { produit: produit }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listeProduitRemplacement=result;
    });
  }

  //choix du marché et du catalogue
  openDialog(){
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.catalogueid=result.catalogueid;
        this.getListeProduits(this.catalogueid);
        this.chargementDonnees();
      }
    });
  }

  

  

  //supprimer  : lien directe au server sans enregistrer
  supprimer(produit:any){
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if(conf){
    console.log('liste à envoyer',this.href+"/"+produit.produitid)
    this.httpService.delete("http://localhost:8084/Prod/" + produit.produitid, {})
                    .subscribe(
                        data => {
                          let indexPro  = this.listeProduits.indexOf(produit);
                          if(indexPro != -1){
                              this.listeProduits.splice(indexPro,1);
                        }
                        this.getListeProduits(this.catalogueid);
                        const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                            width: '250px',
                            data: {
                              message: "Produit supprimé avec succès",
                              ouiNon: false
                            }
                          });
                        });
  
    }
  }

    //Enregistrer envoie toute les modifications apporter au catalogue (listeProduitAEnvoyer)
    enregistrer() {
      const dialogRef = this.dialog.open(ModalConfirmationComponent, {
          width: '250px',
          data: {
          message: "Voulez-vous vraiment envoyer cette demande ?",
          ouiNon: true
          }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.listeProduitsAEnvoyer.forEach(pro => {
            pro.produitid = pro.produitid < 0 ? null : pro.produitid;
            pro.catalogueid=this.catalogueid;
          });
          this.httpService.post("http://localhost:8084/setProduit", this.listeProduitsAEnvoyer)
            .subscribe(
              data => {
                this.getListeProduits(this.catalogueid);
                const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                  width: '250px',
                  data: {
                    message: "les modifications sont envoyées avec succès",
                    ouiNon: false
                  }
                });
              }
            );
        }
    });
    //remettre à 0 la liste à envoyer
    //this.listeProduitsAEnvoyer = [];
  }

  //reception de tous les produits de la base de données
  getListeProduits(catalogueid) {
    let params = new HttpParams();
    params= params.append('cat',catalogueid);
    if(params!=undefined){
    this.httpService.get("http://localhost:8084/Produit/search/ByCatalogue",{params})
      .subscribe(
        data => {
          this.listeProduits = data[0];
          console.log("listproduit",this.listeProduits);
        });
  }
}

  //dialogue d'ajout d'un nouveau produit
  openAjoutProduit(produit: any) {
        this.gen_id--;
        const dialogRef = this.dialog.open(ModalProduitComponent, {
          width: '250px',
          data: { produit: produit }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          if (result.produitid == null) {
            result.catalogueid=this.catalogueid;
            result.produitid = this.gen_id;
            this.listeProduits.push(result);
            this.listeProduitsAEnvoyer.push(result);
          } else {
            result.catalogueid=this.catalogueid;
            let index: number = this.listeProduits.indexOf(this.listeProduits.find(art => art.produitid == result.produitid));
            let indexEnv: number = this.listeProduitsAEnvoyer.indexOf(this.listeProduitsAEnvoyer.find(art => art.produitid == result.produitid));
            this.listeProduitsAEnvoyer.splice(indexEnv, 1);
            this.listeProduitsAEnvoyer.push(result);
        }
      }
    });
  }

  //exportation vers Excel 
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.listeProduits, 'Catalogue');
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
        return initial;
      },  {});

      this.listeFichierExcel = [];

      for(let propriete in jsonData){ 
        this.listeFichierExcel = this.listeFichierExcel.concat(jsonData[propriete]);
      }

      this.listeProduitsAEnvoyer =this.listeProduitsAEnvoyer.concat(this.listeFichierExcel);
      this.listeProduits.push(this.listeFichierExcel);
    }
    reader.readAsBinaryString(file);
  }


  //Mise à jour avec xlsx 
  rechercheByReferencesFichierExcel(){
    if(this.listeFichierExcel != null){
      let listeRefe = this.listeFichierExcel.map(item => item.reference)
    .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe,this.catalogueid);  
    }
  }
  //Mise à jour avec xlsx 
  getByListReference(listRef,catalogueid) {
      let params = new HttpParams();
          params = params.append('ref',listRef.toString()).append('cat',catalogueid);
      this.httpclient.get("http://localhost:8084/Prod/search/ByReferenceAndCatalogue",{ params }) 
      .subscribe(
        data => {
          this.listeMAJ=data;
          console.log("listeproduit",this.listeProduits);
          console.log("listeMAJ",this.listeMAJ);
          console.log("listeproduitAEnvoyer",this.listeProduitsAEnvoyer);
          console.log("listeExcel",this.listeFichierExcel);
          /*this.listeFichierExcel.forEach(element => {
              if(this.listeMAJ[0].reference!=undefined && element.reference==this.listeMAJ[0].reference){
                element.produitid=this.listeMAJ[0].produitid;
              } else {
                this.listeProduits.push(this.listeFichierExcel);
              }
          });*/
        });
        
        //this.enregistrer();
        //this.httpService.post("http://localhost:8084/setProduit", this.listeFichierExcel);
      }
  
    //pour charger que les produits du catalogue choisi il est chargé à init why??
    chargementDonnees() {
      let listeObservaleObject: { url: string, parametres: any }[] = [];
      this.cat=this.catalogueid.toString();
      listeObservaleObject.push({ url: 'http://localhost:8084/Produit/search/ByCatalogue?cat='+this.cat, parametres: {} });
      this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
        console.log(responseList);
        this.listeProduits = responseList[0][0];
      });
    }


}
