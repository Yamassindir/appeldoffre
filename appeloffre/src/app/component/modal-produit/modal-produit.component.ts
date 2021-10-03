import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-modal-produit',
  templateUrl: './modal-produit.component.html',
  styleUrls: ['./modal-produit.component.css']
})
export class ModalProduitComponent {

  produit: any;

  constructor(
    public dialogRef: MatDialogRef<ModalProduitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.produit != null) {
      this.produit = this.data.produit;
    }else{
         this.produit = {
        produitid: null,
        reference: "",
        prixcat: null,
        datemaj: null
      } 
    }



  }

  ajouter(): void {
    this.dialogRef.close(this.produit);
  }



}