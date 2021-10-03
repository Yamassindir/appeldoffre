import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/service/http-service.service';
import { MarcheComponent } from '../marche/marche.component';
import { MatDialog } from '@angular/material';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import { AjoutClientComponent } from '../client/ajout-client/ajout-client.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  displayedColumns = ['clientnom', 'commentaire', 'datecrea','actions'];

  marcheid: number;
  listeClient : any;
  mar: string;
  gen_id: any;
  ClientAEnvoyer : any;

  constructor(private httpService:HttpService, private dialog : MatDialog) { }

  ngOnInit() {
    this.ClientAEnvoyer = [];
    this.openDialog();
  }

  openDialog(){
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.marcheid=result.marcheid;
        this.getListeClient(this.marcheid);
        this.chargementDonnees();
      }
    });
  }

  //reception de tous les produits de la base de données
  getListeClient(marcheid) {
    let params = new HttpParams();
    params= params.append('mar',marcheid);
    if(params!=undefined){
    this.httpService.get("http://localhost:8084/Client/search/ByMarche",{params})
      .subscribe(
        data => {
          this.listeClient = data[0];
          console.log("listeClient",this.listeClient);
        });
  }
}
chargementDonnees() {
  let listeObservaleObject: { url: string, parametres: any }[] = [];
  this.mar=this.marcheid.toString();
  listeObservaleObject.push({ url: 'http://localhost:8084/Client/search/ByMarche?mar='+this.mar, parametres: {} });
  this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
    console.log(responseList);
    this.listeClient = responseList[0][0];
  });
}
supprimer(client:any){
  let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
  if(conf){
  this.httpService.delete("http://localhost:8084/Client/" + client.clientid, {}) 
                  .subscribe(
                      data => {
                        let indexPro  = this.listeClient.indexOf(client);
                        if(indexPro != -1){
                            this.listeClient.splice(indexPro,1);
                      }
                      this.getListeClient(this.marcheid);
                      const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                          width: '250px',
                          data: {
                            message: "Client supprimé avec succès",
                            ouiNon: false
                          }
                        });
                      });

  }
}

  //Enregistrer envoie toute les modifications apporter au catalogue 
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
        this.ClientAEnvoyer.forEach(pro => {
          pro.clientid = pro.clientid < 0 ? null : pro.clientid;
          pro.marcheid=this.marcheid;
        });
        this.httpService.post("http://localhost:8084/setClient", this.ClientAEnvoyer)
          .subscribe(
            data => {
              this.getListeClient(this.marcheid);
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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.listeClient.filter = filterValue;
  }

  //dialogue d'ajout d'un nouveau produit
  openAjoutClient(client: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(AjoutClientComponent, {
      width: '250px',
      data: { client: client }
    });
  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      if (result.clientid == null) {
        result.marcheid=this.marcheid;
        result.clientid = this.gen_id;
        this.listeClient.push(result);
        this.ClientAEnvoyer.push(result);
      } else {
        result.marcheid=this.marcheid;
        let index: number = this.listeClient.indexOf(this.listeClient.find(art => art.clientid == result.clientid));
        let indexEnv: number = this.ClientAEnvoyer.indexOf(this.ClientAEnvoyer.find(art => art.clientid == result.clientid));
        this.ClientAEnvoyer.splice(indexEnv, 1);
        this.ClientAEnvoyer.push(result);
    }
  }
});
}
}
