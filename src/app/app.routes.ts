import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddTradeComponent } from './pages/add-trade/add-trade.component';
import { TradeListComponent } from './pages/trade-list/trade-list.component';
import { JournalComponent } from './pages/journal/journal.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-trade', component: AddTradeComponent },
  { path: 'trades', component: TradeListComponent },
  { path: 'journal', component: JournalComponent },
  { path: 'summary', loadComponent: () => import('./pages/summary/summary.component').then(m => m.SummaryComponent) }

];
