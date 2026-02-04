import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/api/auth/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/api/auth/login`, data);
  }

  addTrade(data: any) {
    return this.http.post(`${this.baseUrl}/api/trades`, data);
  }

  getTrades(userId: string) {
    return this.http.get(`${this.baseUrl}/api/trades/${userId}`);
  }
  getDashboardStats(userId: string) {
  return this.http.get(`${this.baseUrl}/api/dashboard/${userId}`);
}
deleteTrade(tradeId: string) {
  return this.http.delete(`${this.baseUrl}/api/trades/${tradeId}`);
}
addJournalEntry(data: any) {
  return this.http.post(`${this.baseUrl}/api/journal`, data);
}

getJournalEntries(userId: string) {
  return this.http.get(`${this.baseUrl}/api/journal/${userId}`);
}

getWeeklySummary(userId: string) {
  return this.http.get(`${this.baseUrl}/api/summary/weekly/${userId}`);
}

getEquityCurve(userId: string) {
  return this.http.get(`${this.baseUrl}/api/equity/${userId}`);
}

updateTrade(tradeId: string, data: any) {
  return this.http.put(`${this.baseUrl}/api/trades/${tradeId}`, data);
}






}
