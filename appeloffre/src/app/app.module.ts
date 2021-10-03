import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalProduitComponent } from './component/modal-produit/modal-produit.component';
import { EnteteComponent } from './component/entete/entete.component';
import { ModalConfirmationComponent } from './component/modal-confirmation/modal-confirmation.component';
import { DemandeComponent } from './component/demande/demande.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatBadgeModule
} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from './service/http-service.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import { CatalogueComponent } from './component/catalogue/catalogue.component';
import { ProduitPipe } from './pipe/ProduitPipe';
import { LayoutModule } from '@angular/cdk/layout';
import {CdkTableModule} from '@angular/cdk/table';
import { HomeComponent } from './component/home/home.component';
import { MarcheComponent } from './component/marche/marche.component';
import { MaintenanceComponent } from './component/maintenance/maintenance.component';
import { ServiceComponent } from './component/service/service.component';
import { ModalServiceComponent } from './component/service/modal-service/modal-service.component';
import { ReferenceRemplacementComponent } from './component/catalogue/reference-remplacement/reference-remplacement.component';
import { DemandeProduitComponent } from './component/demande/demande-produit/demande-produit.component';
import { DemandeServiceComponent } from './component/demande/demande-service/demande-service.component';
import { DemandeAbonnementComponent } from './component/demande/demande-abonnement/demande-abonnement.component';
import { DevisComponent } from './component/devis/devis.component';
import { AjoutRefRempComponent } from './component/catalogue/reference-remplacement/ajout-ref-remp/ajout-ref-remp.component';
import { AbonnementComponent } from './component/abonnement/abonnement.component';
import { AjoutAbonnementComponent } from './component/abonnement/ajout-abonnement/ajout-abonnement.component';
import { CreationDemandeComponent } from './component/demande/creation-demande/creation-demande.component';
import { DemandeMaintenanceComponent } from './component/demande/demande-maintenance/demande-maintenance.component';
import { NouveauxCatalogueComponent } from './component/nouveaux-catalogue/nouveaux-catalogue.component';
import { ModalCatalogueComponent } from './component/nouveaux-catalogue/modal-catalogue/modal-catalogue.component';
import { ModalMaintenanceComponent } from './component/maintenance/modal-maintenance/modal-maintenance.component';
import { PrestationComponent } from './component/service/prestation/prestation.component';
import { PrestataireComponent } from './component/service/prestataire/prestataire.component';
import { ModalPrestationComponent } from './component/service/prestation/modal-prestation/modal-prestation.component';
import { ModalPrestataireComponent } from './component/service/prestataire/modal-prestataire/modal-prestataire.component';
import { ClientComponent } from './component/client/client.component';
import { CommercialComponent } from './component/commercial/commercial.component';
import { FournisseurComponent } from './component/fournisseur/fournisseur.component';
import { PhaseComponent } from './component/service/prestation/phase/phase.component';
import { SuiviComponent } from './component/suivi/suivi.component';
import { LoginComponent } from './component/login/login.component';
import { ModalFournisseurComponent } from './component/fournisseur/modal-fournisseur/modal-fournisseur.component';
import { UniquepipePipe } from './pipe/uniquepipe.pipe';
import { ModalPhaseComponent } from './component/service/prestation/phase/modal-phase/modal-phase.component';
import { ProjetComponent } from './component/projet/projet.component';
import { AjoutClientComponent } from './component/client/ajout-client/ajout-client.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalProduitComponent,
    ProduitPipe,
    EnteteComponent,
    ModalConfirmationComponent,
    DemandeComponent,
    CatalogueComponent,
    HomeComponent,
    MarcheComponent,
    MaintenanceComponent,
    ServiceComponent,
    ModalServiceComponent,
    ReferenceRemplacementComponent,
    DevisComponent,
    AjoutRefRempComponent,
    AbonnementComponent,
    AjoutAbonnementComponent,
    CreationDemandeComponent,
    DemandeMaintenanceComponent,
    DemandeProduitComponent,
    DemandeServiceComponent,
    DemandeAbonnementComponent,
    NouveauxCatalogueComponent,
    ModalCatalogueComponent,
    ModalMaintenanceComponent,
    PrestationComponent,
    PrestataireComponent,
    ModalPrestationComponent,
    ModalPrestataireComponent,
    ClientComponent,
    CommercialComponent,
    FournisseurComponent,
    PhaseComponent,
    SuiviComponent,
    LoginComponent,
    ModalFournisseurComponent,
    UniquepipePipe,
    ModalPhaseComponent,
    ProjetComponent,
    AjoutClientComponent
    
  ],
  entryComponents : [AjoutClientComponent,ModalPhaseComponent,ModalFournisseurComponent,ModalPrestationComponent,ModalPrestataireComponent,ModalMaintenanceComponent,ModalCatalogueComponent,
    ModalProduitComponent,AjoutAbonnementComponent,AjoutRefRempComponent,ModalConfirmationComponent,ModalServiceComponent,
    ReferenceRemplacementComponent],
  exports: [
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatIconModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  imports: [
    MatProgressSpinnerModule,
    BrowserModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTabsModule,
    FormsModule,
    BrowserModule,
    MatInputModule,
  FlexLayoutModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    HttpModule,
    HttpClientModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatChipsModule,
    AppRoutingModule,
    MatBadgeModule,
    AppRoutingModule,
    LayoutModule,
    MatStepperModule, 
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
