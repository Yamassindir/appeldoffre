import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-phase',
  templateUrl: './modal-phase.component.html',
  styleUrls: ['./modal-phase.component.css']
})
export class ModalPhaseComponent {

  phase: any;

  constructor(public dialogRef: MatDialogRef<ModalPhaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (this.data.phase != null) {
      this.phase = this.data.phase;
    }else{
         this.phase = {
          phaseid: null,
        phasenom: ""
      } 
    }



  }

  ajouter(): void {
    this.dialogRef.close(this.phase);
  }


}