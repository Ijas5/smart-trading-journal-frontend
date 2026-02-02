import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.css']
})
export class TradeListComponent implements OnInit {

  trades: any[] = [];
  userId: string | null = null;
  loading = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTrades();
  }

  loadTrades() {
    this.api.getTrades(this.userId!).subscribe({
      next: (res: any) => {
        this.trades = res.trades;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteTrade(tradeId: string) {
    if (!confirm('Delete this trade?')) return;

    this.api.deleteTrade(tradeId).subscribe({
      next: () => {
        this.trades = this.trades.filter(t => t.id !== tradeId);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete');
      }
    });
  }
  editTrade(trade: any) {
  localStorage.setItem('editTrade', JSON.stringify(trade));
  this.router.navigate(['/add-trade'], { queryParams: { edit: 'true' } });
  
}

}
