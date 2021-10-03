import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/service/http-service.service';
import { FormService } from '../form.service';
import { HttpClient } from '@angular/common/http';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { MatTableDataSource } from '../../lib/table-data-source';
import { MatGroupBy, Grouping } from '../../lib/groupBy';
import { DemandeService } from 'src/app/modele/demandeServices';
import { Prestataire } from 'src/app/modele/Prestataire';
import { Prestation } from 'src/app/modele/Prestation';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-demande-service',
  templateUrl: './demande-service.component.html',
  styleUrls: ['./demande-service.component.css']
})
export class DemandeServiceComponent implements OnInit {

  step: FormGroup;
  listePrestataires: any;
  listePrestation: any;
  listePhase: any;
  listeDemandeSerevice: DemandeService[];
  demandeService: DemandeService;

  // Flags that control the expansion panel
  f_firstPanel = false;
  f_secondPanel = false

  //'profil','fonction','SCR','marge','Centre'
  dcDemandeService: string[] = ['tache', 'Designation', 'Prix', 'edit'];
  dcPrestation: string[] = ['tache', 'Designation', 'Prix', 'edit'];
  dcPrestataire: string[] = ['quantite', 'profil', 'fonction', 'centreingenierie', 'prixprestataire']

  dsPrestation = new MatTableDataSource<any>();
  dsPrestataire = new MatTableDataSource<Prestataire>();
  dsDemandeService = new MatTableDataSource<DemandeService>();

  panelOpenState = false;
  selectedPrestation: Prestation = {
    prestationid : null,
    prestationref : '',
    designation : '',
    phaseid : null,
    prix : null,
    prestataire : [{
      profil : '',
      fonction : '',
      prixprestataire : null,
      centreingenierie : '',
      marge : null,
      quantite : null,
      prix : null,
    }]
  };
  selectedPrestataire: any = {
    prestataire: []
  };
  prestataireAjoute: any;

  constructor(private httpService: HttpService, private excelService: ExcelExportService, private matGroupBy: MatGroupBy,
    private httpclient: HttpClient, private formService: FormService, private _formBuilder: FormBuilder) {
    this.formService.stepReady(this.step, 'five');
    this.dsPrestation = new MatTableDataSource<any>();
  }
  @Output() devisService = new EventEmitter<any[]>();

  ngOnInit() {
    this.step = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
    this.getPhase();
    this.getPrestataire();
    this.f_firstPanel = true;
    this.selectedPrestation.prestataire = []
  }

  getPhase() {
    this.httpclient.get("http://localhost:8084/Phase", {})
      .subscribe(data => {
        this.listePhase = data;
        console.log(this.listePhase);
        this.getPrestation();
      });
  }

  getPrestation() {
    this.httpclient.get("http://localhost:8084/Prestation", {})
      .subscribe(data => {
        this.listePrestation = data;
        //affecter phasenom where phaseid == phaseid
        this.listePrestation.forEach(element => {
          let index = this.listePhase.find(art => art.phaseid == element.phaseid);
          if (index && element) {
            element.phasenom = index.phasenom;
            this.genererPrestation();
          }
          element.prestataire= [];
          element.prix = 0;
        });
        console.log(this.listePrestation);
      });
  }
  getPrestataire() {
    this.httpclient.get("http://localhost:8084/Prestataire", {})
      .subscribe(data => {
        this.listePrestataires = data;
        console.log(this.listePrestataires);
      });
  }

  genererPrestation() {
    this.matGroupBy.grouping = new Grouping(['phasenom']);
    this.dsPrestation.groupBy = this.matGroupBy;
    this.dsPrestation.data = this.listePrestation;
  }



  updateTableDemandeServices() {
   this.dsPrestation.data = this.listePrestation;
    console.log("koulchi", this.listePrestation);
    this.devisService.emit(this.listePrestation);
  }
  finishEdit() {
    this.f_firstPanel = true;
    this.f_secondPanel = false;
    this.selectedPrestation.prestataire.forEach(element => {
      element.prix = element.quantite * ((1+element.marge) * element.prixprestataire);
    });
    const index = this.findIndexofDemandeService();
    this.listePrestation[index] = this.selectedPrestation;
    this.listePrestation[index].prix = this.listePrestation[index].prestataire.reduce((acc, val) => acc += val.prix, 0)
    console.log(this.listePrestation[index]);
    this.updateTableDemandeServices();
    this.selectedPrestation = null;
  }

  findIndexofDemandeService(): number {
    const index = this.listePrestation.
      findIndex(t => t.prestationid === this.selectedPrestation.prestationid);
    console.log("indexofDemande",index);
    console.log(this.selectedPrestation);
    return index;
  }

  cancelEdit() {
    this.f_firstPanel = true;
    this.f_secondPanel = false;
    this.selectedPrestation = null;
  }

  addPrestataire() {
    console.log("a ajouté",this.prestataireAjoute);
    this.selectedPrestation.prestataire.push(this.prestataireAjoute);
    this.dsPrestataire.data = this.selectedPrestation.prestataire;
    console.log('dsPrestataire', this.dsPrestataire.data);
    console.log('selectedprestataire', this.selectedPrestation);
    
  }

  //il nous faut la quantité
  editDemandeService(Prestation: Prestation) {
    this.selectedPrestation = Prestation;
    this.dsPrestataire.data = this.selectedPrestation.prestataire;
    console.log("selectedPrestation", this.selectedPrestation);
    this.f_firstPanel = false;
    this.f_secondPanel = true;
    //  this.dsProfil.data = this.selectedDemandeService.profil;
  }

}
