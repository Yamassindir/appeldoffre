import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-catalogue',
  templateUrl: './modal-catalogue.component.html',
  styleUrls: ['./modal-catalogue.component.css']
})
export class ModalCatalogueComponent implements OnInit {
  catalogue: any;

  constructor(public dialogRef: MatDialogRef<ModalCatalogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.catalogue != null) {
      this.catalogue = this.data.catalogue;
    }else{
         this.catalogue = {
        catalogueid: null,
        marcheid: null
        }
        
      } 
  }
  ajouter(): void {
    this.dialogRef.close(this.catalogue);
  }
}
