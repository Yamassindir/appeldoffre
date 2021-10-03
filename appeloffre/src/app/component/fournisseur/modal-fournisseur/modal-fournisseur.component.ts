import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-fournisseur',
  templateUrl: './modal-fournisseur.component.html',
  styleUrls: ['./modal-fournisseur.component.css']
})
export class ModalFournisseurComponent {
  fournisseur: any;

  constructor(public dialogRef: MatDialogRef<ModalFournisseurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.fournisseur != null) {
      this.fournisseur = this.data.fournisseur;
    } else {
      this.fournisseur = {
        fournisseurid: null,
        fournisseurnom: "",
        datemaj: null
      }
    }
  }
  
  ajouter(): void {
    this.dialogRef.close(this.fournisseur);
  }

}