import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/service/http-service.service';
import { FormService } from '../form.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demande-abonnement',
  templateUrl: './demande-abonnement.component.html',
  styleUrls: ['./demande-abonnement.component.css'],
  providers: [ FormService ]
})
export class DemandeAbonnementComponent implements OnInit {

  liste :any;

  @Input() listeDevisProd: any[];

  affichInp(){
    console.log("this.listeDevisProd",this.listeDevisProd);
  }

  
  step: FormGroup;
  constructor(private httpService: HttpService,private excelService:ExcelExportService,
    private httpclient:HttpClient,private formService: FormService,private _formBuilder: FormBuilder) { 
 
     
    }

  ngOnInit() {
    this.step = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  onClick(){
    console.log(this.formService);
  }
     

}
