import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-trade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-trade.component.html',
  styleUrls: ['./add-trade.component.css']
})
export class AddTradeComponent implements OnInit {

  trade: any = {
    trade_date: '',
    pair: '',
    trade_type: 'Buy',
    entry_price: '',
    exit_price: '',
    lot_size: '',
    stop_loss: '',
    take_profit: '',
    notes: ''
  };

  isEditMode = false;
  tradeId: string | null = null;
  errorMessage = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const editData = localStorage.getItem('editTrade');

    if (editData) {
      this.trade = JSON.parse(editData);
      this.tradeId = this.trade.id;
      this.isEditMode = true;
      localStorage.removeItem('editTrade');
    }
  }

  saveTrade() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.trade.trade_date || !this.trade.pair || !this.trade.entry_price || !this.trade.exit_price || !this.trade.lot_size) {
      this.errorMessage = 'Please fill required fields';
      return;
    }

    const payload = {
      ...this.trade,
      user_id: userId
    };

    if (this.isEditMode) {
      this.api.updateTrade(this.tradeId!, payload).subscribe({
        next: () => {
          this.router.navigate(['/trades']);
        },
        error: () => {
          this.errorMessage = 'Failed to update trade';
        }
      });
    } else {
      this.api.addTrade(payload).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Failed to save trade';
        }
      });
    }
  }

  advisorMessage = '';
  advisorType: 'good' | 'warn' | 'bad' | '' = '';
  riskDollar = 0;
  rewardDollar = 0;
  rrRatio = 0;

  // rules
  MAX_LOSS = 10;
  MIN_RR = 2;

  evaluateTrade() {
  const entry = Number(this.trade.entry_price);
  const sl = Number(this.trade.stop_loss);
  const tp = Number(this.trade.take_profit);
  const lot = Number(this.trade.lot_size);
  const type = this.trade.trade_type;

  if (!entry || !sl || !tp || !lot) {
    this.advisorMessage = '';
    this.advisorType = '';
    return;
  }

  // Risk & Reward in price
  const riskPrice = Math.abs(entry - sl);
  const rewardPrice = Math.abs(tp - entry);

  // Your rule: 0.01 = $1
  this.riskDollar = riskPrice * 100 * lot;
  this.rewardDollar = rewardPrice * 100 * lot;

  this.rrRatio = this.riskDollar === 0 ? 0 : this.rewardDollar / this.riskDollar;

  // Advisor logic
  if (this.riskDollar > this.MAX_LOSS) {
    this.advisorType = 'bad';
    this.advisorMessage = `❌ Risk too high: $${this.riskDollar.toFixed(2)} (Max $${this.MAX_LOSS})`;
    return;
  }

  if (this.rrRatio < this.MIN_RR) {
    this.advisorType = 'warn';
    this.advisorMessage = `⚠️ Low RR: 1:${this.rrRatio.toFixed(2)} (Min 1:${this.MIN_RR})`;
    return;
  }

  this.advisorType = 'good';
  this.advisorMessage = `✅ Good trade | Risk: $${this.riskDollar.toFixed(2)} | RR 1:${this.rrRatio.toFixed(2)}`;
}


}
