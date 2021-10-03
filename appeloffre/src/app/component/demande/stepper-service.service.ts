import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperServiceService {

  listeFichierExcel: any = [];
  listeProduitsAEnvoyer: any = [];
  listeProduits: any = [];
  listeProduitsDem: any = [];
  listeDevisProd: any = [];
  listeGrouped: any = [];

  constructor() { }
/*

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
      }, {});
      this.listeFichierExcel = [];
      for (let propriete in jsonData) {
        this.listeFichierExcel = this.listeFichierExcel.concat(jsonData[propriete]);
      }
      this.listeProduitsDem = this.listeFichierExcel;
    }
    reader.readAsBinaryString(file);
  }

  //Mise à jour avec xlsx 
  rechercheByReferencesFichierExcel() {
    if (this.listeFichierExcel != null) {
      let listeRefe = this.listeFichierExcel.map(item => item.reference)
        .filter((value, index, self) => self.indexOf(value) === index);
      this.getByListReference(listeRefe);
      let quantiteDemandee = this.listeFichierExcel.map(item => item.quantite);
    }
  }

  //Mise à jour avec xlsx 
  getByListReference(listRef) {
    let params = new HttpParams();
    params = params.append('ref', listRef.toString());
    this.httpclient.get("http://localhost:8084/Prod/search/byRef", { params })
      .subscribe(
        data => {
          this.listeProduits = data;
        });
  }

  generationDevisProduit() {
    this.listeDevisProd = this.listeProduitsDem;
    this.listeDevisProd.forEach(element => {
      let index = this.listeProduits.indexOf(this.listeProduits.find(art => art.reference == element.reference));
      element.type = this.listeProduits[index].type;
      element.prixliste = this.listeProduits[index].prixliste * element.quantite;
      element.designation = this.listeProduits[index].designation;
    });
    console.log(this.listeDevisProd);

    from(this.listeDevisProd)
      .pipe(
        groupBy(produit => produit.type),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
      )
      .subscribe(val => {
        this.listeGrouped.push(val)
      },

      );
    console.log(this.listeGrouped);
    return this.listeDevisProd;
  }
*/
}
