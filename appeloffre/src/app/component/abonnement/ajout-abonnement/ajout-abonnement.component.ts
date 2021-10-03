import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ajout-abonnement',
  templateUrl: './ajout-abonnement.component.html',
  styleUrls: ['./ajout-abonnement.component.css']
})
export class AjoutAbonnementComponent implements OnInit {
  abonnement: any;

  constructor(public dialogRef: MatDialogRef<AjoutAbonnementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.abonnement != null) {
      this.abonnement = this.data.abonnement;
    }else{
         this.abonnement = {
        abonnementid: null,
        designation : "",
        abonnementref: "",
        prixabonnement: null,
        datemaj: null
      } 
    }  
   }

  ngOnInit() {
  }

    ajouter(): void {
      this.dialogRef.close(this.abonnement);
    }


}
