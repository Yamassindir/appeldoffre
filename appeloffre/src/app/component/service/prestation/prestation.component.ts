import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MarcheComponent } from '../../marche/marche.component';
import { ModalConfirmationComponent } from '../../modal-confirmation/modal-confirmation.component';
import { ModalPrestationComponent } from './modal-prestation/modal-prestation.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-prestation',
  templateUrl: './prestation.component.html',
  styleUrls: ['./prestation.component.css']
})
export class PrestationComponent implements OnInit {
  listeFichierExcel: any;
  listeMAJ: any;
  listePrestationsAEnvoyer: any;
  listePrestations: any;

  marcheid: number;
  mar: string;
  gen_id: number;

  selectedOptions: string[] = ['phase'];

  constructor(private httpService: HttpService, private excelService: ExcelExportService, private httpclient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.listePrestationsAEnvoyer = [];
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.marcheid = result.marcheid;
        this.getListeServices();
        this.chargementDonnees();
      }
    });
  }


  //supprimer  : lien directe au server sans enregistrer
  supprimer(prestation: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      this.httpService.delete("http://localhost:8084/Prestation/" + prestation.prestationid, {})
        .subscribe(
          data => {
            let indexSer = this.listePrestations.indexOf(prestation);
            if (indexSer != -1) {
              this.listePrestations.splice(indexSer, 1);
            }
            this.getListeServices();
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
        this.listePrestationsAEnvoyer.forEach(ser => {
          ser.prestationid = ser.prestationid < 0 ? null : ser.prestationid;
        });
        this.httpService.post("http://localhost:8084/setPrestation", this.listePrestationsAEnvoyer)
          .subscribe(
            data => {
              this.getListeServices();
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
  getListeServices() {
    this.httpService.get("http://localhost:8084/Prestation", {})
      .subscribe(
        data => {
          this.listePrestations = data[0];
          console.log("listePrestations", this.listePrestations);
        });
  }

  //dialogue d'ajout d'un nouveau produit
  openAjoutPrestation(prestation: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalPrestationComponent, {
      width: '250px',
      data: { prestation: prestation }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.prestationid == null) {
          result.prestationid = this.gen_id;
          this.listePrestations.push(result);
          this.listePrestationsAEnvoyer.push(result);
        } else {
          let index: number = this.listePrestations.indexOf(this.listePrestations.find(art => art.prestationid == result.prestationid));
          let indexEnv: number = this.listePrestationsAEnvoyer.indexOf(this.listePrestationsAEnvoyer.find(art => art.prestationid == result.prestationid));
          this.listePrestationsAEnvoyer.splice(indexEnv, 1);
          this.listePrestationsAEnvoyer.push(result);
        }
      }
    });
  }

  //exportation vers Excel 
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.listePrestations, 'Catalogue');
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
      this.listePrestationsAEnvoyer = this.listePrestationsAEnvoyer.concat(this.listeFichierExcel);
    }
    reader.readAsBinaryString(file);
  }



  rechercheByReferencesFichierExcel() {
    if (this.listeFichierExcel != null) {
      let listeRefe = this.listeFichierExcel.map(item => item.prestationref)
        .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe);
    }
  }

  getByListReference(listRef) {
    let params = new HttpParams();
    params = params.append('ref', listRef.toString());
    this.httpclient.get("http://localhost:8084/Prestation/search/byDesignation", { params })
      .subscribe(
        data => {
          this.listeMAJ = data;
          this.listeFichierExcel.forEach(element => {
            if (this.listeMAJ[0] != undefined) {
              if (element.prestationref == this.listeMAJ[0].prestationref) {
                element.prestationid = this.listeMAJ[0].prestationid;
              }
            }
          });
        });
    this.listePrestationsAEnvoyer.push(this.listeFichierExcel);
    this.listePrestations.push(this.listeFichierExcel);
    //this.enregistrer();
    this.httpService.post("http://localhost:8084/setPrestation", this.listeFichierExcel);
  }

  //pour charger que les produits du catalogue choisi il est chargé à init why??
  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    listeObservaleObject.push({ url: 'http://localhost:8084/Prestation', parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listePrestations = responseList[0][0];
      //this.listeCatalogues = responseList[1][0]._embedded.catalogues;
      //this.listeCatalogues.forEach((cata: any) => {
      //cata.listProduits = this.listeProduits.filter(produit => produit.catalogueid == cata.catalogueid);
      //  });
    });
  }

}
