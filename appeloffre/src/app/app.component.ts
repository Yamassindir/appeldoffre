import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    this.matIconRegistry.addSvgIcon(
      `Atos`,
      `../../../assets/Atos.svg`
    );
    this.matIconRegistry.addSvgIcon(
      "Atos",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./../assets/icons/more.svg")
    );

    
  }


}
