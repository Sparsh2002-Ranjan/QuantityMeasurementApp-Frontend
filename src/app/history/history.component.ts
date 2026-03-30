import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionService } from '../services/conversion.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="banner">
        <h2>Conversion History</h2>
      </div>

      <div class="content">
        <div class="loading" *ngIf="loading">Loading history...</div>

        <div class="empty" *ngIf="!loading && history.length === 0">
          <p>No conversions yet. Start converting on the Home or Conversion page!</p>
        </div>

        <div class="table-wrap" *ngIf="!loading && history.length > 0">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>To Unit</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of history; let i = index">
                <td>{{ i + 1 }}</td>
                <td>{{ extractFrom(item.resultString) }}</td>
                <td>{{ item.unit }}</td>
                <td class="result-val">{{ item.resultValue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f0f0f0; }
    .banner { background: #5b6ef5; padding: 28px 40px; text-align: center; }
    .banner h2 { color: #fff; font-size: 22px; font-weight: 500; }
    .content { max-width: 800px; margin: 0 auto; padding: 40px 20px; }

    .loading, .empty {
      text-align: center; padding: 40px;
      color: #888; background: #fff;
      border-radius: 10px; font-size: 15px;
    }

    .table-wrap {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f7f8ff; }
    th {
      text-align: left; padding: 14px 20px;
      font-size: 13px; font-weight: 600;
      color: #888; letter-spacing: 0.04em;
      border-bottom: 1px solid #eee;
    }
    td { padding: 14px 20px; font-size: 14px; color: #444; border-bottom: 1px solid #f5f5f5; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .result-val { font-weight: 700; color: #5b6ef5; }
  `]
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  loading = true;

  constructor(private conversionService: ConversionService) {}

  ngOnInit() {
    this.conversionService.getHistory().subscribe({
      next: (data) => { this.history = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  extractFrom(resultString: string): string {
    if (!resultString) return '';
    return resultString.split('→')[0]?.trim() || resultString;
  }
}
