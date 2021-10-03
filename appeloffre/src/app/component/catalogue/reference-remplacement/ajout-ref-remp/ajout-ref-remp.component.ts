import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ajout-ref-remp',
  templateUrl: './ajout-ref-remp.component.html',
  styleUrls: ['./ajout-ref-remp.component.css']
})
export class AjoutRefRempComponent implements OnInit {
  referenceremplacement :any;

  constructor( public dialogRef: MatDialogRef<AjoutRefRempComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.referenceremplacement != null) {
      this.referenceremplacement = this.data.referenceremplacement;
    }else{
         this.referenceremplacement = {
        referencerempid:null,
        produitid: null,
        refremplacement: "",
        quantite: null,
      } 
    }
   }

  ngOnInit() {
  }

  ajouter(): void {
    this.dialogRef.close(this.referenceremplacement);
    console.log(this.referenceremplacement);
  }
}
