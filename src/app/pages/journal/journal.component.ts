import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {

  userId: string | null = null;
  entries: any[] = [];

  journal: any = {
    entry_date: '',
    emotion_before: '',
    emotion_after: '',
    lesson_learned: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadEntries();
  }

  loadEntries() {
    this.api.getJournalEntries(this.userId!).subscribe({
      next: (res: any) => {
        this.entries = res.entries;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  saveEntry() {
    if (!this.journal.entry_date || !this.journal.lesson_learned) {
      this.errorMessage = 'Date and lesson are required';
      return;
    }

    const payload = {
      ...this.journal,
      user_id: this.userId
    };

    this.api.addJournalEntry(payload).subscribe({
      next: () => {
        this.successMessage = 'Journal saved';
        this.errorMessage = '';
        this.journal = {
          entry_date: '',
          emotion_before: '',
          emotion_after: '',
          lesson_learned: ''
        };
        this.loadEntries();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to save journal';
      }
    });
  }
}
