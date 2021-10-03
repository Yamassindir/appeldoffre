import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../form.service'
import { HttpService } from 'src/app/service/http-service.service';
import { Fournisseur } from 'src/app/modele/fournisseur';
import { HttpClient } from '@angular/common/http';
import { ModalConfirmationComponent } from '../../modal-confirmation/modal-confirmation.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-creation-demande',
  templateUrl: './creation-demande.component.html',
  styleUrls: ['./creation-demande.component.css']
})
export class CreationDemandeComponent implements OnInit {

  step: FormGroup;
  @Input() demande: any = {
    crm: "",
    projet: "",
    couttotal: null,
    prixrecommande: null
  };
  @Input() client: any = {
    clientid: null,
    clientnom: ""
  }
  @Input() fournisseur: any = {
    fournisseurid: null,
    Fournisseurnom: ""
  }
  listeClients: any = [];

  constructor(private _formBuilder: FormBuilder, private httpService: HttpService, private httpclient: HttpClient,
    private formService: FormService, private dialog : MatDialog) {
    this.step = this._formBuilder.group({
      projetnom: ['', Validators.required],
      clientnom: ['', Validators.required],
      nessie: ''
    });
    this.formService.stepReady(this.step, 'one')
  }

  ngOnInit() {
    this.step = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.getClient();
  }
  getClient() {
    this.httpclient.get("http://localhost:8084/Client", {})
      .subscribe(data => {
        this.listeClients = data;
        console.log("listeClients", this.listeClients);
      });
  }
  change(title) {
    this.step.patchValue({ extraName: title })
  }
  setDemande() {
    this.demande.clientid = this.client.clientid;
    this.httpService.post("http://localhost:8084/setDemande", this.demande)
                  .subscribe(data=>{
                    console.log("demandeEnvoyer", data);
                    const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                      width: '250px',
                      data: {
                        message: "la demande est enregistrée avec succès",
                        ouiNon: false
                      }
                    }) 
                  });
  }


}
