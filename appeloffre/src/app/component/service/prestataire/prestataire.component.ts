import { Component, OnInit } from '@angular/core';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { HttpService } from 'src/app/service/http-service.service';
import { MatDialog } from '@angular/material';
import { MarcheComponent } from '../../marche/marche.component';
import { ModalConfirmationComponent } from '../../modal-confirmation/modal-confirmation.component';
import { HttpParams, HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ModalPrestataireComponent } from './modal-prestataire/modal-prestataire.component';

@Component({
  selector: 'app-prestataire',
  templateUrl: './prestataire.component.html',
  styleUrls: ['./prestataire.component.css']
})
export class PrestataireComponent implements OnInit {

  listeMAJ: any;
  listePrestatairesAEnvoyer: any;
  listePrestataires: any;

  mar: string;
  gen_id: number;
  marcheid: number;


  constructor(private httpService: HttpService, private excelService: ExcelExportService, private httpclient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.listePrestatairesAEnvoyer = [];
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.marcheid = result.marcheid;
        this.getListePrestataires();
        this.chargementDonnees();
      }
    });
  }


  //supprimer  : lien directe au server sans enregistrer
  supprimer(prestataire: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      this.httpService.delete("http://localhost:8084/Prestataire/" + prestataire.prestataireid, {})
        .subscribe(
          data => {
            let indexSer = this.listePrestataires.indexOf(prestataire);
            if (indexSer != -1) {
              this.listePrestataires.splice(indexSer, 1);
            }
            this.getListePrestataires();
            const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
              width: '250px',
              data: {
                message: "Prestataire supprimé avec succès",
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
        message: "Voulez-vous vraiment envoyer ces modifications ?",
        ouiNon: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listePrestatairesAEnvoyer.forEach(ser => {
          ser.prestataireid = ser.prestataireid < 0 ? null : ser.prestataireid;
        });
        this.httpService.post("http://localhost:8084/setPrestataire", this.listePrestatairesAEnvoyer)
          .subscribe(
            data => {
              this.getListePrestataires();
              const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                width: '250px',
                data: {
                  message: "les modifications sont enregistrées avec succès",
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
  getListePrestataires() {

    this.httpService.get("http://localhost:8084/Prestataire", {})
      .subscribe(
        data => {
          this.listePrestataires = data[0];
          console.log("listePrestataires", this.listePrestataires);
        });
  }

  //dialogue d'ajout d'un nouveau produit
  openAjoutPrestataire(prestataire: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalPrestataireComponent, {
      width: '250px',
      data: { prestataire: prestataire }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.prestataireid == null) {
          result.prestataireid = this.gen_id;
          this.listePrestataires.push(result);
          this.listePrestatairesAEnvoyer.push(result);
        } else {
          let index: number = this.listePrestataires
            .indexOf(this.listePrestataires
              .find(art => art.prestataireid == result.prestataireid));
          let indexEnv: number = this.listePrestatairesAEnvoyer
            .indexOf(this.listePrestatairesAEnvoyer
              .find(art => art.prestataireid == result.prestataireid));
          this.listePrestatairesAEnvoyer.splice(indexEnv, 1);
          this.listePrestatairesAEnvoyer.push(result);
        }
      }
    });
  }

  //exportation vers Excel 
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.listePrestataires, 'Catalogue Prestataires');
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

      for (let propriete in jsonData) {
        this.listeFichierExcel = this.listeFichierExcel.concat(jsonData[propriete]);
      }
      this.listePrestatairesAEnvoyer = this.listePrestatairesAEnvoyer.concat(this.listeFichierExcel);
    }
    reader.readAsBinaryString(file);
  }



  rechercheByReferencesFichierExcel() {
    if (this.listeFichierExcel != null) {
      let listeRefe = this.listeFichierExcel.map(item => item.prestataireref)
        .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe);
    }
  }

  getByListReference(listRef) {
    let params = new HttpParams();
    params = params.append('ref', listRef.toString());
    this.httpclient.get("http://localhost:8084/Prestataire/search/ByProfil", { params })
      .subscribe(
        data => {
          this.listeMAJ = data;
          this.listeFichierExcel.forEach(element => {  
            if (this.listeMAJ[0] != undefined) {
              if (element.prestataireref == this.listeMAJ[0].prestataireref) {
                element.prestataireid = this.listeMAJ[0].prestataireid;
              }
            }
          });
        });
    this.listePrestatairesAEnvoyer.push(this.listeFichierExcel);
    this.listePrestataires.push(this.listeFichierExcel);
    //this.enregistrer();
    this.httpService.post("http://localhost:8084/setPrestataire", this.listeFichierExcel);
  }
  listeFichierExcel(listeFichierExcel: any) {
    throw new Error("Method not implemented.");
  }

  //pour charger que les produits du catalogue choisi il est chargé à init why??
  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    listeObservaleObject.push({ url: 'http://localhost:8084/Prestataire', parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listePrestataires = responseList[0][0];
    });
  }

}
