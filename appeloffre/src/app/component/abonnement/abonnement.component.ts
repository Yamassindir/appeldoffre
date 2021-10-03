import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { HttpService } from 'src/app/service/http-service.service';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MarcheComponent } from '../marche/marche.component';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';
import * as XLSX from 'xlsx';
import { AjoutAbonnementComponent } from './ajout-abonnement/ajout-abonnement.component';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.css']
})
export class AbonnementComponent implements OnInit {

  constructor(private httpService: HttpService,private excelService:ExcelExportService, private httpclient:HttpClient,
    public dialog: MatDialog) { }
  
    displayedColumns = ['abonnementref', 'designation', 'duree', 'prixabonnement','actions'];
    
    marcheid: number;
    listeAbonnement:any;
    mar: string;
    listeFichierExcel: any;
    listeAbonnementAEnvoyer:any; // undefined error ??
    listeMAJ:any;
    gen_id:number=0;
  
    ngOnInit() {
    this.listeAbonnementAEnvoyer = [];
    this.openDialog();
  }

  openDialog(){
    const dialogRef = this.dialog.open(MarcheComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.marcheid=result.marcheid;
        this.getListeAbonnement(this.marcheid);
        this.chargementDonnees();
      }
    });
  }

  //reception de tous les produits de la base de données
  getListeAbonnement(marcheid) {
    let params = new HttpParams();
    params= params.append('mar',marcheid);
    if(params!=undefined){
    this.httpService.get("http://localhost:8084/Abonnement/search/ByMarche",{params})
      .subscribe(
        data => {
          this.listeAbonnement = data[0];
          console.log("listeAbonnement",this.listeAbonnement);
        });
  }
}
chargementDonnees() {
  let listeObservaleObject: { url: string, parametres: any }[] = [];
  this.mar=this.marcheid.toString();
  listeObservaleObject.push({ url: 'http://localhost:8084/Abonnement/search/ByMarche?mar='+this.mar, parametres: {} });
  this.httpService.getHttpObservableArray(listeObservaleObject).subscribe(responseList => {
    console.log(responseList);
    this.listeAbonnement = responseList[0][0];
  });
}
supprimer(abonnement:any){
  let conf = confirm("Etes-vous sûre de vouloir supprimer cette référence");
  if(conf){
  this.httpService.delete("http://localhost:8084/Abonnement/" + abonnement.abonnementid, {}) 
                  .subscribe(
                      data => {
                        let indexPro  = this.listeAbonnement.indexOf(abonnement);
                        if(indexPro != -1){
                            this.listeAbonnement.splice(indexPro,1);
                      }
                      this.getListeAbonnement(this.marcheid);
                      const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                          width: '250px',
                          data: {
                            message: "Abonnement supprimé avec succès",
                            ouiNon: false
                          }
                        });
                      });

  }
}

  //Enregistrer envoie toute les modifications apporter au catalogue (listeAbonnementAEnvoyer)
  enregistrer() {
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
        width: '250px',
        data: {
        message: "Voulez-vous vraiment envoyer cette demande ?",
        ouiNon: true
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listeAbonnementAEnvoyer.forEach(pro => {
          pro.abonnementid = pro.abonnementid < 0 ? null : pro.abonnementid;
          pro.marcheid=this.marcheid;
        });
        this.httpService.post("http://localhost:8084//setAbonnement", this.listeAbonnementAEnvoyer)
          .subscribe(
            data => {
              this.getListeAbonnement(this.marcheid);
              const dialogRefOk = this.dialog.open(ModalConfirmationComponent, {
                width: '250px',
                data: {
                  message: "les modifications sont envoyées avec succès",
                  ouiNon: false
                }
              });
            }
          );
      }
  });
  //remettre à 0 la liste à envoyer
  //this.listeAbonnementAEnvoyer = [];
}

 //exportation vers Excel 
 exportAsXLSX():void {
  this.excelService.exportAsExcelFile(this.listeAbonnementAEnvoyer, 'Catalogue');
}

// chargement et lecture d'un fichier excel
onFileChange(ev) {
  let workBook = null;
  let jsonData = null;
  const reader = new FileReader();
  const file = ev.target.files[0];
  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' });
    jsonData = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      return initial;
    },  {});
    for(let propriete in jsonData){
      this.listeFichierExcel = this.listeFichierExcel.concat(jsonData[propriete]);
    }
    this.listeAbonnementAEnvoyer =this.listeAbonnementAEnvoyer.concat(this.listeFichierExcel);
    this.listeAbonnement.push(this.listeFichierExcel);
  }
  reader.readAsBinaryString(file);
}


//Mise à jour avec xlsx 
rechercheByReferencesFichierExcel(){
  if(this.listeFichierExcel != null){
    let listeRefe = this.listeFichierExcel.map(item => item.reference)
  .filter((value, index, self) => self.indexOf(value) === index);
    this.getByListReference(listeRefe,this.marcheid);  
  }
}
//Mise à jour avec xlsx 
getByListReference(listRef,marcheid) {
    let params = new HttpParams();
        params = params.append('ref',listRef.toString()).append('mar',marcheid);
    this.httpclient.get("http://localhost:8084/Abonnement/search/ByAbonnementrefAndMarche",{ params }) 
    .subscribe(
      data => {
        this.listeMAJ=data;
        console.log("listeAbonnement",this.listeAbonnement);
        console.log("listeMAJ",this.listeMAJ);
        console.log("listeAbonnementAEnvoyer",this.listeAbonnementAEnvoyer);
        console.log("listeExcel",this.listeFichierExcel);
        /*this.listeFichierExcel.forEach(element => {
            if(this.listeMAJ[0].reference!=undefined && element.reference==this.listeMAJ[0].reference){
              element.produitid=this.listeMAJ[0].produitid;
            } else {
              this.listeAbonnement.push(this.listeFichierExcel);
            }
        });*/
      });
      
      //this.enregistrer();
      //this.httpService.post("http://localhost:8084/setProduit", this.listeFichierExcel);
    }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.listeAbonnement.filter = filterValue;
  }

  //dialogue d'ajout d'un nouveau produit
  openAjoutAbonnement(abonnement: any) {
    this.gen_id--;
    const dialogRef = this.dialog.open(AjoutAbonnementComponent, {
      width: '250px',
      data: { abonnement: abonnement }
    });
  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      if (result.abonnementid == null) {
        result.marcheid=this.marcheid;
        result.abonnementid = this.gen_id;
        this.listeAbonnement.push(result);
        this.listeAbonnementAEnvoyer.push(result);
      } else {
        result.marcheid=this.marcheid;
        let index: number = this.listeAbonnement.indexOf(this.listeAbonnement.find(art => art.abonnementid == result.abonnementid));
        let indexEnv: number = this.listeAbonnementAEnvoyer.indexOf(this.listeAbonnementAEnvoyer.find(art => art.abonnementid == result.abonnementid));
        this.listeAbonnementAEnvoyer.splice(indexEnv, 1);
        this.listeAbonnementAEnvoyer.push(result);
    }
  }
});
}

}




