import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  summary: any = {};
  userId: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadSummary();
  }

  loadSummary() {
    this.api.getWeeklySummary(this.userId!).subscribe({
      next: (res: any) => {
        this.summary = res.summary;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getWinRate() {
    const total = Number(this.summary.total_trades || 0);
    const wins = Number(this.summary.wins || 0);
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  }
}

