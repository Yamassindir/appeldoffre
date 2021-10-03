import { Component, OnInit } from '@angular/core';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import { HttpParams, HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { HttpService } from 'src/app/service/http-service.service';
import { ModalCatalogueComponent } from './modal-catalogue/modal-catalogue.component';
import { MarcheComponent } from '../marche/marche.component';

@Component({
  selector: 'app-nouveaux-catalogue',
  templateUrl: './nouveaux-catalogue.component.html',
  styleUrls: ['./nouveaux-catalogue.component.css']
})
export class NouveauxCatalogueComponent implements OnInit {
  
  marcheid: any;
  gen_id: any;
  mar: any;
  listeCataloguesAEnvoyer: any;
  listeCatalogues : any;

  constructor(private httpService: HttpService, private httpclient:HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    this.listeCataloguesAEnvoyer = [];
    this.listeCatalogues=[];
    this.openDialog();
  }
  openDialog() {
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.marcheid = result.marcheid;
        this.getListeCatalogues(this.marcheid);
        this.chargementDonnees();
      }
    });
  }



  //supprimer  : lien directe au server sans enregistrer
  supprimer(catalogue: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
    if (conf) {
      this.httpService.delete("http://localhost:8084/Catalogue/" + catalogue.catalogueid, {})
        .subscribe(
          data => {
            let indexPro = this.listeCatalogues.indexOf(catalogue);
            if (indexPro != -1) {
              this.listeCatalogues.splice(indexPro, 1);
            }
            this.getListeCatalogues(this.marcheid);
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
        this.listeCataloguesAEnvoyer.forEach(pro => {
          pro.catalogueid = pro.catalogueid < 0 ? null : pro.catalogueid;
          pro.marcheid = this.marcheid;
        });
        this.httpService.post("http://localhost:8084/setCatalogue", this.listeCataloguesAEnvoyer)
          .subscribe(
            data => {
              this.getListeCatalogues(this.marcheid);
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
  getListeCatalogues(marcheid) {
    let params = new HttpParams();
    params = params.append('mar', marcheid);
    if (params != undefined) {
      this.httpService.get("http://localhost:8084/Catalogue/search/ByMarche", { params })
        .subscribe(
          data => {
            this.listeCatalogues = data[0];
          });
    }
  }
  //dialogue d'ajout d'un nouveau produit
  openAjoutCatalogue(produit: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalCatalogueComponent, {
      width: '250px',
      data: { produit: produit }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.catalogueid == null) {
          result.marcheid = this.marcheid;
          result.catalogueid = this.gen_id;
          this.listeCatalogues.push(result);
          this.listeCataloguesAEnvoyer.push(result);
        } else {
          result.marcheid = this.marcheid;
          let index: number = this.listeCatalogues.indexOf(this.listeCatalogues.find(art => art.catalogueid == result.catalogueid));
          let indexEnv: number = this.listeCataloguesAEnvoyer.indexOf(this.listeCataloguesAEnvoyer.find(art => art.catalogueid == result.catalogueid));
          this.listeCataloguesAEnvoyer.splice(indexEnv, 1);
          this.listeCataloguesAEnvoyer.push(result);
        }
      }
    });
  }
   //pour charger que les produits du catalogue choisi il est chargé à init why??
   chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    this.mar=this.marcheid.toString();
    listeObservaleObject.push({ url: 'http://localhost:8084/Catalogue/search/ByMarche?mar='+this.mar, parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listeCatalogues = responseList[0][0];
    });
  }
}
