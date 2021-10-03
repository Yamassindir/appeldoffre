import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CatalogueComponent } from './component/catalogue/catalogue.component';
import { HomeComponent } from './component/home/home.component';
import { MarcheComponent } from './component/marche/marche.component';
import { ServiceComponent } from './component/service/service.component';
import { AbonnementComponent } from './component/abonnement/abonnement.component';
import { DemandeComponent } from './component/demande/demande.component';
import { NouveauxCatalogueComponent } from './component/nouveaux-catalogue/nouveaux-catalogue.component';
import { MaintenanceComponent } from './component/maintenance/maintenance.component';
import { PrestationComponent } from './component/service/prestation/prestation.component';
import { PrestataireComponent } from './component/service/prestataire/prestataire.component';
import { SuiviComponent } from './component/suivi/suivi.component';
import { LoginComponent } from './component/login/login.component';
import { ClientComponent } from './component/client/client.component';
import { PhaseComponent } from './component/service/prestation/phase/phase.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'home', component: HomeComponent },
  { path: 'marche', component: MarcheComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'abonnement', component: AbonnementComponent }, 
  { path: 'demande', component: DemandeComponent }, 
  { path: 'Nouveauxcatalogues', component: NouveauxCatalogueComponent }, 
  { path: 'phase', component: PhaseComponent }, 
  { path: 'maintenance', component: MaintenanceComponent }, 
  { path: 'prestation', component: PrestationComponent }, 
  { path: 'prestataire', component: PrestataireComponent },
  { path: 'suivi', component: SuiviComponent },
  { path: 'login', component: LoginComponent },
  { path: 'client', component: ClientComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})





export class AppRoutingModule {


}
