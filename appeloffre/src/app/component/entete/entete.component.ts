import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entete',
  templateUrl: './entete.component.html',
  styleUrls: ['./entete.component.css']
})
export class EnteteComponent implements OnInit {
  currentPage:string;
  constructor() {
    this.currentPage = "Produit"; 
    
}

  ngOnInit() {
  }

}
