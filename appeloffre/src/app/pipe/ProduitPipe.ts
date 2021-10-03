import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'produitPipe' })
export class ProduitPipe implements PipeTransform {
  transform(allProduits: any[], ...args :any[]) {
    if (allProduits != undefined && args[0] != undefined) {

      let listProd = args[1];
      let returnList  = [];
      let listProduitTrouves = listProd.filter(prod => prod.reference.toUpperCase() == args[0].toUpperCase());

      listProduitTrouves.forEach(element => {
      returnList = returnList.concat(allProduits.filter(produit => produit.reference.toUpperCase() == element.reference.toUpperCase()));
      console.log("pipe");
      console.log(returnList);
      });
      
      return returnList;
    } else {
      return allProduits;
    }
  }
}