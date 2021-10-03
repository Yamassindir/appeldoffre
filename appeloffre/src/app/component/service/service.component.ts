import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { MatDialog } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MarcheComponent } from '../marche/marche.component';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import { ModalServiceComponent } from './modal-service/modal-service.component';
import { Service } from 'src/app/modele/service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  name = 'This is XLSX TO JSON CONVERTER';

  marcheid: number;
  eanRecherche: string;
  listeService: any;
  listeCatalogueBdd: any = [];
  listeCatalogues: any;
  listeServicesAEnvoyer: any;
  gen_id: number = 0;
  href: string = "http://localhost:8084/Service";
  listeFichierExcel: any;
  listeMAJ: any;
  mar: string;


  constructor(private httpService: HttpService, private excelService: ExcelExportService, private httpclient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.listeServicesAEnvoyer = [];
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.marcheid = result;
        this.getListeServices(this.marcheid);
        this.chargementDonnees();
      }
    });
  }

  //supprimer  : lien directe au server sans enregistrer
  supprimer(service: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      console.log('liste à envoyer', this.href + "/" + service.serviceid)
      this.httpService.delete("http://localhost:8084/Service/" + service.serviceid, {})
        .subscribe(
          data => {
            let indexSer = this.listeService.indexOf(service);
            if (indexSer != -1) {
              this.listeService.splice(indexSer, 1);
            }
            this.getListeServices(this.marcheid);
            const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
              width: '250px',
              data: {
                message: "Service supprimé avec succès",
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
        this.listeServicesAEnvoyer.forEach(ser => {
          ser.serviceid = ser.serviceid < 0 ? null : ser.serviceid;
        });
        this.httpService.post("http://localhost:8084/setService", this.listeServicesAEnvoyer)
          .subscribe(
            data => {
              this.getListeServices(this.marcheid);
              const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                width: '250px',
                data: {
                  message: "les modifications sont envoyées avec succès",
                  ouiNon: false
                }
              });
            });
      }
    });
    //remettre à 0 la liste à envoyer
    //this.listeProduitsAEnvoyer = [];
  }

  //reception de tous les produits de la base de données
  getListeServices(marcheid) {
    let params = new HttpParams();
    params = params.append('mar', marcheid);
    if (params != undefined) {
      this.httpService.get("http://localhost:8084/Service/search/ByMarche", { params })
        .subscribe(
          data => {
            this.listeService = data[0];
            console.log("listeService", this.listeService);
          });
    }
  }

  //dialogue d'ajout d'un nouveau produit
  openAjoutService(service: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalServiceComponent, {
      width: '250px',
      data: { service: service }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.serviceid == null) {
          result.marcheid = this.marcheid;
          result.serviceid = this.gen_id;
          this.listeService.push(result);
          this.listeServicesAEnvoyer.push(result);
        } else {
          result.marcheid = this.marcheid;
          let index: number = this.listeService.indexOf(this.listeService.find(art => art.serviceid == result.serviceid));
          let indexEnv: number = this.listeServicesAEnvoyer.indexOf(this.listeServicesAEnvoyer.find(art => art.serviceid == result.serviceid));
          this.listeServicesAEnvoyer.splice(indexEnv, 1);
          this.listeServicesAEnvoyer.push(result);
        }
      }
    });
  }

  //exportation vers Excel 
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.listeService, 'Catalogue');
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
      }, {});
      this.listeFichierExcel = [];
      for (let propriete in jsonData) {
        this.listeFichierExcel = this.listeFichierExcel.concat(jsonData[propriete]);
      }
      this.listeServicesAEnvoyer = this.listeServicesAEnvoyer.concat(this.listeFichierExcel);
    }
    reader.readAsBinaryString(file);
  }


  rechercheByReferencesFichierExcel() {
    if (this.listeFichierExcel != null) {
      let listeRefe = this.listeFichierExcel.map(item => item.serviceref)
        .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe, this.marcheid);
    }
  }

  getByListReference(listRef, marcheid) {
    let params = new HttpParams();
    params = params.append('ref', listRef.toString()).append('mar', marcheid);
    this.httpclient.get("http://localhost:8084/Service/search/ByServicerefAndMarche", { params })
      .subscribe(
        data => {
          this.listeMAJ = data;
          this.listeFichierExcel.forEach(element => {
            if (this.listeMAJ[0] != undefined) {
              if (element.serviceref == this.listeMAJ[0].serviceref) {
                element.serviceid = this.listeMAJ[0].serviceid;
              }
            }
          });
        });
    this.listeServicesAEnvoyer.push(this.listeFichierExcel);
    this.listeService.push(this.listeFichierExcel);
    this.httpService.post("http://localhost:8084/setService", this.listeFichierExcel);
  }

  //pour charger que les produits du catalogue choisi il est chargé à init why??
  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    this.mar = this.marcheid.toString();
    listeObservaleObject.push({ url: 'http://localhost:8084/Service/search/ByMarche?mar=' + this.mar, parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listeService = responseList[0][0];
      //this.listeCatalogues = responseList[1][0]._embedded.catalogues;
      //this.listeCatalogues.forEach((cata: any) => {
      //cata.listProduits = this.listeProduits.filter(produit => produit.catalogueid == cata.catalogueid);
      //  });
    });
  }

}

