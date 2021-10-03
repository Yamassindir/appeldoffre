import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { MarcheComponent } from '../marche/marche.component';
import { FormService } from './form.service';
import { Prestation } from 'src/app/modele/Prestation';
import { MatTableDataSource } from '../lib/table-data-source';
import { MatGroupBy, Grouping } from '../lib/groupBy';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css'],
  providers: [FormService]
})
export class DemandeComponent implements OnInit {

  dcPrestation: string[] = ['tache', 'Designation', 'Prix'];
  dcProdMaint: string[] = ['quantite', 'reference', 'designation', 'prixliste', 'prixcat', 'prixmaintenance'];
  dcMaintencance: string[] = ['maintenance', 'prix'];
  dcService: string[] = ['service', 'prix'];

  isLinear = false;
  myForm: Array<string>;

  listeDevis: any[];
  listePrestation: any[];
  listeMaintenance: any[];

  dsProdMaint = new MatTableDataSource<any>();
  dsPrestation = new MatTableDataSource<Prestation>();

  constructor(public formService: FormService, private matGroupBy: MatGroupBy,
    private fb: FormBuilder) { }

  ngOnInit() {
    //this.myForm = this.formService.mainForm.value  
  }

  getProduits(event) {
    this.listeDevis = event;
  }
  getServices(event) {
    this.listePrestation = event;
  }
  getMaintenance(event) {
    this.listeMaintenance = event;
  }
  logger() {
    console.log(this.listeDevis);
    console.log(this.listeMaintenance);
    this.matGroupBy.grouping = new Grouping(['type']);
    this.dsProdMaint.groupBy = this.matGroupBy;
    this.dsProdMaint.data = this.listeMaintenance;
    console.log(this.listePrestation);
    this.matGroupBy.grouping = new Grouping(['phasenom']);
    this.dsPrestation.groupBy = this.matGroupBy;
    this.dsPrestation.data = this.listePrestation;
  }




}
