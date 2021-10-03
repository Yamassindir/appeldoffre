import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal-prestataire',
  templateUrl: './modal-prestataire.component.html',
  styleUrls: ['./modal-prestataire.component.css']
})
export class ModalPrestataireComponent  {
 
  prestataire: any;

  constructor(public dialogRef: MatDialogRef<ModalPrestataireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.prestataire != null) {
      this.prestataire = this.data.prestataire;
    }else{
         this.prestataire = {
          prestataireid: null,
        reference: "",
        prix: null,
        datemaj: null
      } 
    }



  }

  ajouter(): void {
    this.dialogRef.close(this.prestataire);
  }



}
