import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  userId!: string;
  stats: any = {};
  equityChart: any;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    const uid = localStorage.getItem('userId');
    if (!uid) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = uid;
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.loadEquityCurve();
  }

  loadStats() {
    this.api.getDashboardStats(this.userId).subscribe((res: any) => {
      this.stats = res.stats;
    });
  }

  loadEquityCurve() {
    this.api.getEquityCurve(this.userId).subscribe((res: any) => {
      const labels = res.curve.map((c: any) => c.date);
      const data = res.curve.map((c: any) => c.equity);

      const ctx: any = document.getElementById('equityChart');

      if (this.equityChart) {
        this.equityChart.destroy();
      }

      this.equityChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Equity Curve',
              data,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          }
        }
      });
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
