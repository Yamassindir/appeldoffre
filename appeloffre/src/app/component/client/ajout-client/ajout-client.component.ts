import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ajout-client',
  templateUrl: './ajout-client.component.html',
  styleUrls: ['./ajout-client.component.css']
})
export class AjoutClientComponent implements OnInit {
  client: {
    clientid: any;
    commentaire: string;
    clientnom: string;
    datecrea: any;
  };

  constructor(public dialogRef: MatDialogRef<AjoutClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.client != null) {
      this.client = this.data.client;
    } else {
      this.client = {
        clientid: null,
        commentaire: "",
        clientnom: "",
        datecrea: null
      }
    }
  }

  ngOnInit() {
  }

  ajouter(): void {
    console.log(this.client);
    
    this.dialogRef.close(this.client);
  }


}