import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http-service.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import { ModalFournisseurComponent } from './modal-fournisseur/modal-fournisseur.component';


@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent implements OnInit {
  listeFournisseur: any;
  listeFournisseursAEnvoyer: any;
  gen_id: any;

  constructor(private httpService: HttpService, private httpclient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

   //supprimer  : lien directe au server sans enregistrer
   supprimer(fournisseur: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      this.httpService.delete("http://localhost:8084/Fournisseur/" + fournisseur.fournisseurid, {})
        .subscribe(
          data => {
            let indexSer = this.listeFournisseur.indexOf(fournisseur);
            if (indexSer != -1) {
              this.listeFournisseur.splice(indexSer, 1);
            }
            this.getListeFournisseur();
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
        this.listeFournisseursAEnvoyer.forEach(ser => {
          ser.serviceid = ser.serviceid < 0 ? null : ser.serviceid;
        });
        this.httpService.post("http://localhost:8084/setFournisseur", this.listeFournisseursAEnvoyer)
          .subscribe(
            data => {
              this.getListeFournisseur();
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
  getListeFournisseur() {
      this.httpService.get("http://localhost:8084/Fournisseur", {})
        .subscribe(
          data => {
            this.listeFournisseur = data[0];
            console.log("listeFournisseur", this.listeFournisseur);
          });
    }

  //pour charger que les produits du catalogue choisi il est chargé à init why??
  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    listeObservaleObject.push({ url: 'http://localhost:8084/Fournisseur' , parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listeFournisseur = responseList[0][0];
    });
  }

  //dialogue d'ajout d'un nouveau produit
  openAjoutService(fournisseur: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalFournisseurComponent, {
      width: '250px',
      data: { fournisseur: fournisseur }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.fournisseurid == null) {
          result.fournisseurid = this.gen_id;
          this.listeFournisseur.push(result);
          this.listeFournisseursAEnvoyer.push(result);
        } else {
          let index: number = this.listeFournisseur.indexOf(this.listeFournisseur.find(art => art.fournisseurid == result.fournisseurid));
          let indexEnv: number = this.listeFournisseursAEnvoyer.indexOf(this.listeFournisseursAEnvoyer.find(art => art.fournisseurid == result.fournisseurid));
          this.listeFournisseursAEnvoyer.splice(indexEnv, 1);
          this.listeFournisseursAEnvoyer.push(result);
        }
      }
    });
  }


}
