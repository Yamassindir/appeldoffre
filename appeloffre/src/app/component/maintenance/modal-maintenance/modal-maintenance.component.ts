import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-maintenance',
  templateUrl: './modal-maintenance.component.html',
  styleUrls: ['./modal-maintenance.component.css']
})
export class ModalMaintenanceComponent implements OnInit {
  
  maintenance: any;

  constructor(public dialogRef: MatDialogRef<ModalMaintenanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.maintenance != null) {
      this.maintenance = this.data.maintenance;
    }else{
         this.maintenance = {
        maintenanceid: null,
        produitid: "",
        prixmaint: null,
        niveau:null,
        duree : null, 
        type : null,
        nrd:0,
        datemaj: null
      } 
    }

   }

  ngOnInit() {
  }


  ajouter(): void {
    this.dialogRef.close(this.maintenance);
  }

}
