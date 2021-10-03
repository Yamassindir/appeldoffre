import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { FormService } from '../form.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { element } from 'protractor';
import { MatTableDataSource } from '../../lib/table-data-source';
import { MatGroupBy, Grouping } from '../../lib/groupBy';


@Component({
  selector: 'app-demande-maintenance',
  templateUrl: './demande-maintenance.component.html',
  styleUrls: ['./demande-maintenance.component.css']
})
export class DemandeMaintenanceComponent implements OnInit {

  step: FormGroup;
  listeOption: any;
  listeProdid: any;
  listeMaintenances: any;
  niveau: string;
  type: string;
  duree: string;
  displayedColumns: string[] = ['quantite', 'reference', 'designation', 'prixliste', 'prixcat', 'prixmaintenance'];
  dataSource = new MatTableDataSource<any>();

  @Input() listeDevisProd: any[];
  @Output() devisMaintenance = new EventEmitter<any[]>();

  constructor(private httpService: HttpService, private excelService: ExcelExportService,
    private httpclient: HttpClient, private formService: FormService, private _formBuilder: FormBuilder, private matGroupBy: MatGroupBy) {
    this.formService.stepReady(this.step, 'four')
  }

  ngOnInit() {
    this.step = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.getListeOptions();
  }

  getListeOptions() {
    this.httpService.get('http://localhost:8084/Maintenance', {})
      .subscribe(
        data => {
          this.listeOption = data[0];
        });
  }

  getPrixMaintenances() {
    console.log("DevisProduit", this.listeDevisProd);
    this.listeProdid = this.listeDevisProd.map(a => a.produitid);
    let params = new HttpParams();
    params = params.append('pro', this.listeProdid.toString()).append('niv', this.niveau).append('ans', this.duree).append('type', this.type)//.append('nrd', this.Option.nrd)
    if (params != undefined) {
      this.httpService.get("http://localhost:8084/Maintenance/search/ByQuery", { params })
        .subscribe(
          data => {
            this.listeMaintenances = data[0];
            console.log("get Liste Maintenances", this.listeMaintenances);
            this.listeDevisProd.forEach(element => {             
              let index = this.listeMaintenances.indexOf(this.listeMaintenances.find(art => art.produitid == element.produitid));
              if(element.prixmaintenance){
              element.prixmaintenance = this.listeMaintenances[index].prixmaintenance * element.quantite;
              console.log("listeDevisProd",this.listeDevisProd);
            }
            });
            this.matGroupBy.grouping = new Grouping(['type']);
              this.dataSource.groupBy = this.matGroupBy;
              this.dataSource.data = this.listeDevisProd;
            this.devisMaintenance.emit(this.listeDevisProd);
          });
    }
  }
}
