import { Component, OnInit } from '@angular/core';
import { ModalConfirmationComponent } from 'src/app/component/modal-confirmation/modal-confirmation.component';
import { MatDialog } from '@angular/material';
import { HttpService } from 'src/app/service/http-service.service';
import { HttpClient } from '@angular/common/http';
import { ModalPhaseComponent } from './modal-phase/modal-phase.component';

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class PhaseComponent implements OnInit {

  displayedColumns = ['phasenom', 'actions'];
  listePhase: any;
  listePhaseAEnvoyer: any;
  gen_id: any;

  constructor(private httpService: HttpService, private httpclient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.listePhaseAEnvoyer = [];
    this.getListePhase();
    this.chargementDonnees();
  }

  //reception de tous les produits de la base de données
  getListePhase() {

    this.httpService.get("http://localhost:8084/Phase", {})
      .subscribe(
        data => {
          this.listePhase = data[0];
          console.log("listePhase", this.listePhase);
        });
  }
  chargementDonnees() {
    let listeObservaleObject: { url: string, parametres: any }[] = [];
    listeObservaleObject.push({ url: 'http://localhost:8084/Phase', parametres: {} });
    this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
      console.log(responseList);
      this.listePhase = responseList[0][0];
    });
  }
  supprimer(phase: any) {
    let conf = confirm("Etes-vous sûre de vouloir supprimer cette phase");
    if (conf) {
      this.httpService.delete("http://localhost:8084/Phase/" + phase.phaseid, {})
        .subscribe(
          data => {
            let indexPro = this.listePhase.indexOf(phase);
            if (indexPro != -1) {
              this.listePhase.splice(indexPro, 1);
            }
            this.getListePhase();
            const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
              width: '250px',
              data: {
                message: "phase supprimée avec succès",
                ouiNon: false
              }
            });
          });

    }
  }

  //Enregistrer envoie toute les modifications apporter au catalogue (listePhaseAEnvoyer)
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
        this.listePhaseAEnvoyer.forEach(pro => {
          pro.phaseid = pro.phaseid < 0 ? null : pro.phaseid;
        });
        this.httpService.post("http://localhost:8084/setPhase", this.listePhaseAEnvoyer)
          .subscribe(
            data => {
              this.getListePhase();
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
  //dialogue d'ajout d'un nouveau produit
  openAjoutPhase(phase: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(ModalPhaseComponent, {
      width: '250px',
      data: { phase: phase }
    });
  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      if (result.phaseid == null) {
        result.phaseid = this.gen_id;
        this.listePhase.push(result);
        this.listePhaseAEnvoyer.push(result);
      } else {
        let index: number = this.listePhase.indexOf(this.listePhase.find(art => art.phaseid == result.phaseid));
        let indexEnv: number = this.listePhaseAEnvoyer.indexOf(this.listePhaseAEnvoyer.find(art => art.phaseid == result.phaseid));
        this.listePhaseAEnvoyer.splice(indexEnv, 1);
        this.listePhaseAEnvoyer.push(result);
    }
  }
});
}



}
