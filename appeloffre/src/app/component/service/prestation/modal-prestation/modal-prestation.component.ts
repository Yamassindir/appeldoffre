import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-modal-prestation',
  templateUrl: './modal-prestation.component.html',
  styleUrls: ['./modal-prestation.component.css']
})
export class ModalPrestationComponent  {
 
  prestation: any;

  constructor(public dialogRef: MatDialogRef<ModalPrestationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.prestation != null) {
      this.prestation = this.data.prestation;
    }else{
         this.prestation = {
          prestationid: null,
        reference: "",
        prix: null,
        datemaj: null
      } 
    }



  }

  ajouter(): void {
    this.dialogRef.close(this.prestation);
  }


}
