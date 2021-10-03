import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import { ModalMaintenanceComponent } from './modal-maintenance/modal-maintenance.component';
import { MarcheComponent } from '../marche/marche.component';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  listeMaintenanceAEnvoyer: any[];
  catalogueid: number;
  listeMaintenances: any;
  cat: string;
  gen_id: any;
  listeFichierExcel: any;
  listeProduitsAEnvoyer: any;
  listeMAJ: any = [];
  listeProduits: any;
  listeTeste: any = [];
  i: number = 0;
  listePr: any = [];
  returnList: any[];
  propriete: string[];

  constructor(private httpService: HttpService, private excelService: ExcelExportService, private httpclient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.listeMaintenanceAEnvoyer = [];
    this.openDialog();
  }



  //choix du marché et du catalogue
  openDialog() {
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.catalogueid = result.catalogueid;
        this.getListeProduit();
        this.getListeMaintenance(this.catalogueid);
        this.chargementDonnees();
      }
    });
  }

  //supprimer  : lien directe au server sans enregistrer
  supprimer(maintenance: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      this.httpService.delete("http://localhost:8084/Maintenance/" + maintenance.maintenanceid, {})
        .subscribe(
          data => {
            let indexPro = this.listeMaintenances.indexOf(maintenance);
            if (indexPro != -1) {
              this.listeMaintenances.splice(indexPro, 1);
            }
            this.getListeMaintenance(this.catalogueid);
            const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
              width: '250px',
              data: {
                message: "Maintenance supprimée avec succès",
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
        this.listeMaintenanceAEnvoyer.forEach(pro => {
          pro.maintenanceid = pro.maintenanceid < 0 ? null : pro.maintenanceid;
          pro.catalogueid = this.catalogueid;
        });
        this.httpService.post("http://localhost:8084/setMaintenance", this.listeMaintenanceAEnvoyer)
          .subscribe(
            data => {
              this.getListeMaintenance(this.catalogueid);
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
  }

  //reception de tous les produits de la base de données
  getListeMaintenance(catalogueid) {
    let params = new HttpParams();
    params = params.append('cat', catalogueid);
    if (params != undefined) {
      this.httpService.get("http://localhost:8084/Maintenance/search/ByCatalogue", { params })
        .subscribe(
          data => {
            this.listeMaintenances = data[0];
            console.log("listeMaintenances", this.listeMaintenances);
          });
    }
  }

  getListeProduit() {
    this.httpService.get("http://localhost:8084/Prod", {})
      .subscribe(
        data => {
          this.listeProduits = data[0];
          console.log("listeProduits", this.listeProduits);
          this.listeProduits.forEach(element => {
            this.listeMaintenances.reference = element.reference,
              this.listeMaintenances.designation = element.designation
          });
          console.log("listeMaintenances", this.listeMaintenances);

          let liste = this.listeProduits.map(item => {
            item.reference,
              item.produitid,
              item.designation
          })
            .filter((value, index, self) => self.indexOf(value) === index);
          console.log(liste);

        });
  }

  //dialogue d'ajout d'un nouveau maintenance
  openAjoutMaintenance(maintenance: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalMaintenanceComponent, {
      width: '250px',
      data: { maintenance: maintenance }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.maintenanceid == null) {
          result.catalogueid = this.catalogueid;
          result.maintenanceid = this.gen_id;
          this.listeMaintenances.push(result);
          this.listeMaintenanceAEnvoyer.push(result);
        } else {
          result.catalogueid = this.catalogueid;
          let index: number = this.listeMaintenances.indexOf(this.listeMaintenances.find(art => art.maintenanceid == result.maintenanceid));
          let indexEnv: number = this.listeMaintenanceAEnvoyer.indexOf(this.listeMaintenanceAEnvoyer.find(art => art.maintenanceid == result.maintenanceid));
          this.listeMaintenanceAEnvoyer.splice(indexEnv, 1);
          this.listeMaintenanceAEnvoyer.push(result);
        }
      }
    });
  }

  //
  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    this.cat = this.catalogueid.toString();
    listeObservaleObject.push({ url: 'http://localhost:8084/Maintenance/search/ByCatalogue?cat=' + this.cat, parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listeMaintenances = responseList[0][0];
    });
  }

  //exportation vers Excel 
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.listeMaintenances, 'Maintenance');
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

      //this.listeMaintenanceAEnvoyer =this.listeMaintenanceAEnvoyer.concat(this.listeFichierExcel);
      //this.listeMaintenances.push(this.listeFichierExcel);
    }
    reader.readAsBinaryString(file);
    console.log("listeFichierExcel", this.listeFichierExcel);
  }

  //transforme la forme de forme compréhensible par le coté serveur en table facile à exploité par l'utilisateur.
  toUser() {
    this.listeTeste[this.i]={}
    this.listeMaintenances.forEach(maint => {
      if((this.listeTeste[this.i].produitid !== maint.produitid)){
        this.i += 1;
        this.listeTeste[this.i] = {
          produitid : maint.produitid
        };
          this.listeTeste[this.i].produitid = maint.produitid;
          this.listeTeste[this.i][maint["be"] + " " + maint["duree"]+ " " + maint["niveau"]+ " " + maint["type"]]=maint['prixmaintenance'];
          
      } else {
          this.listeTeste[this.i].produitid = maint.produitid;
          this.listeTeste[this.i][maint["be"] + " " + maint["duree"]+ " " + maint["niveau"]+ " " + maint["type"]]=maint['prixmaintenance'];
      }  
    });
    console.log("listeTeste",this.listeTeste);
    this.propriete=Object.keys(this.listeTeste[2]);
  }


  //transforme la forme de la table excel en forme compréhensible par le coté serveur
  toTable() {
    for (let propriete in this.listeFichierExcel) {
      for (let p in this.listeFichierExcel[propriete]) {
        let s = p.split(" ");
        if ((p !== "reference") && (p !== "designation")) {
          this.listeMAJ[this.i] = {};
          this.listeMAJ[this.i].reference = this.listeFichierExcel[propriete]["reference"];
          this.listeMAJ[this.i].prixmaintenance = this.listeFichierExcel[propriete][p];
          this.listeMAJ[this.i].be = s[0];
          this.listeMAJ[this.i].duree = s[1];
          this.listeMAJ[this.i].niveau = s[2];
          this.listeMAJ[this.i].type = s[3];
          if (this.listeMAJ[this.i].reference == this.returnList[propriete].reference) { this.listeMAJ[this.i].produitid = this.returnList[propriete].produitid; }
          delete this.listeMAJ[this.i].reference;
          this.i += 1;
        }
      }
    }
    console.log(this.returnList);
    console.log("listeMAJ", this.listeMAJ);
    this.listeMaintenanceAEnvoyer = this.listeMAJ;
  }

  //Mise à jour avec xlsx 
  rechercheByReferencesFichierExcel() {
    if (this.listeFichierExcel != null) {
      let listeRefe = this.listeFichierExcel.map(item => item.reference)
        .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe, this.catalogueid);
      console.log(this.returnList);
    }
  }
  //Mise à jour avec xlsx 
  getByListReference(listRef, catalogueid) {
    this.returnList = [];
    let params = new HttpParams();
    params = params.append('ref', listRef.toString()).append('cat', catalogueid)
    this.httpclient.get("http://localhost:8084/Prod/search/ByReferenceAndCatalogue", { params }).subscribe(
      data => {
        console.log(data)
        this.returnList = data
      });
  }
  isNumber(val) { return typeof val === 'number'; }
}

