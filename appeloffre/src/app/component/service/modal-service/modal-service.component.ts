import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-service',
  templateUrl: './modal-service.component.html',
  styleUrls: ['./modal-service.component.css']
})
export class ModalServiceComponent {
 
  service: any;

  constructor(
    public dialogRef: MatDialogRef<ModalServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.service != null) {
      this.service = this.data.service;
    }else{
         this.service = {
          serviceid: null,
        reference: "",
        prix: null,
        datemaj: null
      } 
    }



  }

  ajouter(): void {
    this.dialogRef.close(this.service);
  }



}
