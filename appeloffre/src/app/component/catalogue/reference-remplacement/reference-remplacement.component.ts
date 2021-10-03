import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from 'src/app/service/http-service.service';
import { AjoutRefRempComponent } from './ajout-ref-remp/ajout-ref-remp.component';
import { ModalConfirmationComponent } from '../../modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-reference-remplacement',
  templateUrl: './reference-remplacement.component.html',
  styleUrls: ['./reference-remplacement.component.css']
})
export class ReferenceRemplacementComponent implements OnInit {

  listeProduitRemplacement: any;
  produitid: number;
  referenceRemplacement: any;



  displayedColumns: string[] = ['refremplacement', 'quantite', 'actions'];
  gen_id: number = 0;
  proid: any;

  constructor(private httpService: HttpService, private excelService: ExcelExportService, private httpclient: HttpClient,
    public dialog: MatDialog, public dialogRef: MatDialogRef<ReferenceRemplacementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.produit != null) {
      this.produitid = this.data.produit.produitid;
    }
  }

  ngOnInit() {
    this.listeProduitRemplacement = [];
    this.chargementDonnees();
  }

  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    this.proid = this.produitid.toString();
    listeObservaleObject.push({ url: 'http://localhost:8084/ReferenceRemplacement/search/ByProduit?pro=' + this.proid, parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listeProduitRemplacement = responseList[0][0];
    });
  }

  //get des refs de remplacement
  getListeProduitRemplacement() {
    let params = new HttpParams();
    params = params.append('pro', this.produitid.toString());
    if (params != undefined) {
      this.httpService.get('http://localhost:8084/ReferenceRemplacement/search/ByProduit', { params })
        .subscribe(
          data => {
            this.listeProduitRemplacement = data[0];
          }, err => {
            console.log(err);
          });
    }
  }

  openAjoutRefRemplacement(referenceRemplacement: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(AjoutRefRempComponent, {
      width: '250px',
      data: { referenceRemplacement: referenceRemplacement }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.referencerempid == null) {
          result.produitid = this.produitid;
          result.referencerempid = this.gen_id;
          this.listeProduitRemplacement.push(result);
          //this.listeProduitsAEnvoyer.push(result);
          console.log(this.listeProduitRemplacement);
        } else {
          result.produitid = this.produitid;
          //let index: number = this.listeProduitRemplacement.indexOf(this.listeProduits.find(art => art.produitid == result.produitid));
          let indexEnv: number = this.listeProduitRemplacement.indexOf(this.listeProduitRemplacement.find(art => art.referencerempid == result.referencerempid));
          this.listeProduitRemplacement.splice(indexEnv, 1);
          this.listeProduitRemplacement.push(result);
          console.log(this.listeProduitRemplacement);
        }
      }
    });
  }

  supprimer(referenceremp: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      this.httpService.delete("http://localhost:8084/ReferenceRemplacement/" + referenceremp.referencerempid, {})
        .subscribe(
          data => {
            let indexPro = this.listeProduitRemplacement.indexOf(referenceremp);
            if (indexPro != -1) {
              this.listeProduitRemplacement.splice(indexPro, 1);
            }
            this.getListeProduitRemplacement();
            const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
              width: '250px',
              data: {
                message: "Référence de remplacement supprimée avec succès",
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
        this.listeProduitRemplacement.forEach(pro => {
          pro.referencerempid = pro.referencerempid < 0 ? null : pro.referencerempid;
          pro.produitid = this.produitid;
        });
        this.httpService.post("http://localhost:8084/setReferenceRemplacement", this.listeProduitRemplacement)
          .subscribe(
            data => {
              this.getListeProduitRemplacement();
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

  appliquer(): void {
    this.enregistrer();
    this.dialogRef.close(this.listeProduitRemplacement);
  }

}
