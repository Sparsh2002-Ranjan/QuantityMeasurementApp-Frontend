import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversionService } from '../services/conversion.service';

interface UnitOption { label: string; value: string; }

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="banner">
        <h2>Quantity Conversion</h2>
      </div>

      <div class="content">
        <p class="section-label">CHOOSE TYPE</p>
        <div class="type-cards">
          <div class="type-card" [class.active]="selectedType === 'LENGTH'" (click)="selectType('LENGTH')">
            <svg width="28" height="44" viewBox="0 0 32 52" fill="none">
              <rect x="10" y="1" width="12" height="50" rx="2" stroke="currentColor" stroke-width="2"/>
              <line x1="10" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2"/>
              <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" stroke-width="1.5"/>
              <line x1="10" y1="26" x2="16" y2="26" stroke="currentColor" stroke-width="2"/>
              <line x1="10" y1="34" x2="14" y2="34" stroke="currentColor" stroke-width="1.5"/>
              <line x1="10" y1="42" x2="16" y2="42" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Length</span>
          </div>
          <div class="type-card" [class.active]="selectedType === 'TEMPERATURE'" (click)="selectType('TEMPERATURE')">
            <svg width="20" height="44" viewBox="0 0 24 52" fill="none">
              <rect x="9" y="2" width="6" height="34" rx="3" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="42" r="7" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="14" x2="9" y2="14" stroke="currentColor" stroke-width="1.5"/>
              <line x1="6" y1="22" x2="9" y2="22" stroke="currentColor" stroke-width="1.5"/>
              <line x1="6" y1="30" x2="9" y2="30" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Temperature</span>
          </div>
          <div class="type-card" [class.active]="selectedType === 'VOLUME'" (click)="selectType('VOLUME')">
            <svg width="28" height="44" viewBox="0 0 32 52" fill="none">
              <rect x="8" y="2" width="16" height="42" rx="2" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5"/>
              <line x1="8" y1="22" x2="14" y2="22" stroke="currentColor" stroke-width="1.5"/>
              <line x1="8" y1="32" x2="16" y2="32" stroke="currentColor" stroke-width="1.5"/>
              <rect x="11" y="44" width="10" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Volume</span>
          </div>
        </div>

        <div class="inputs-row">
          <div class="input-box">
            <label>FROM</label>
            <input type="number" [(ngModel)]="fromValue" (ngModelChange)="onConvert()" />
            <select [(ngModel)]="fromUnit" (ngModelChange)="onConvert()">
              <option *ngFor="let u of getUnits()" [value]="u.value">{{ u.label }}</option>
            </select>
          </div>

          <div class="swap-btn" (click)="swap()">⇄</div>

          <div class="input-box">
            <label>TO</label>
            <input type="number" [value]="result ?? ''" readonly />
            <select [(ngModel)]="toUnit" (ngModelChange)="onConvert()">
              <option *ngFor="let u of getUnits()" [value]="u.value">{{ u.label }}</option>
            </select>
          </div>
        </div>

        <div class="result-row" *ngIf="result !== null">
          <div class="result-card">
            <span class="from-label">{{ fromValue }} {{ getLabel(fromUnit) }}</span>
            <span class="eq">=</span>
            <span class="to-label">{{ result }} {{ getLabel(toUnit) }}</span>
          </div>
        </div>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f0f0f0; }
    .banner { background: #5b6ef5; padding: 28px 40px; text-align: center; }
    .banner h2 { color: #fff; font-size: 22px; font-weight: 500; }
    .content { max-width: 700px; margin: 0 auto; padding: 40px 20px; }
    .section-label { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; color: #555; margin-bottom: 14px; }

    .type-cards { display: flex; gap: 16px; margin-bottom: 36px; }
    .type-card {
      flex: 1; background: #fff; border: 2px solid #e5e5e5; border-radius: 12px;
      padding: 24px 16px 16px; display: flex; flex-direction: column;
      align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s;
    }
    .type-card:hover { border-color: #5b6ef5; }
    .type-card.active { border-color: #5b6ef5; background: #f0f3ff; }
    .type-card span { font-size: 15px; font-weight: 500; color: #888; }
    .type-card.active span { color: #5b6ef5; font-weight: 600; }
    .type-card svg { color: #bbb; }
    .type-card.active svg { color: #5b6ef5; }

    .inputs-row { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; }
    .input-box {
      flex: 1; background: #fff; border-radius: 10px; padding: 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .input-box label {
      display: block; font-size: 12px; font-weight: 600;
      letter-spacing: 0.05em; color: #888; margin-bottom: 10px;
    }
    .input-box input {
      border: none; outline: none; font-size: 28px; font-weight: 600;
      color: #222; width: 100%; background: transparent;
      padding: 0 0 8px 0; border-bottom: 1px solid #eee; display: block;
    }
    .input-box select {
      border: none; outline: none; font-size: 14px; color: #888;
      background: transparent; padding: 10px 0 0 0; cursor: pointer; width: 100%;
    }
    .swap-btn { font-size: 24px; color: #aaa; cursor: pointer; user-select: none; }
    .swap-btn:hover { color: #5b6ef5; }

    .result-card {
      background: #fff; border-radius: 10px; padding: 20px 28px;
      display: flex; gap: 16px; align-items: center; justify-content: center;
      font-size: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .from-label { color: #555; }
    .eq { color: #aaa; }
    .to-label { font-weight: 700; color: #5b6ef5; font-size: 22px; }
    .error-msg { background: #fef2f2; color: #dc2626; padding: 10px 16px; border-radius: 8px; font-size: 14px; }
  `]
})
export class ConversionComponent {
  selectedType = 'LENGTH';
  fromValue = 1;
  fromUnit = 'METERS';
  toUnit = 'CENTIMETERS';
  result: number | null = null;
  errorMsg = '';

  lengthUnits: UnitOption[] = [
    { label: 'Metres', value: 'METERS' },
    { label: 'Centimetres', value: 'CENTIMETERS' },
    { label: 'Feet', value: 'FEET' },
    { label: 'Inches', value: 'INCHES' },
    { label: 'Yards', value: 'YARDS' }
  ];
  temperatureUnits: UnitOption[] = [
    { label: 'Celsius', value: 'CELSIUS' },
    { label: 'Fahrenheit', value: 'FAHRENHEIT' },
    { label: 'Kelvin', value: 'KELVIN' }
  ];
  volumeUnits: UnitOption[] = [
    { label: 'Litre', value: 'LITRE' },
    { label: 'Millilitre', value: 'MILLILITRE' },
    { label: 'Gallon', value: 'GALLON' }
  ];

  constructor(private conversionService: ConversionService) {}

  getUnits(): UnitOption[] {
    switch (this.selectedType) {
      case 'TEMPERATURE': return this.temperatureUnits;
      case 'VOLUME': return this.volumeUnits;
      default: return this.lengthUnits;
    }
  }

  getLabel(val: string): string {
    return this.getUnits().find(u => u.value === val)?.label || val;
  }

  selectType(type: string) {
    this.selectedType = type;
    this.result = null;
    this.errorMsg = '';
    const units = this.getUnits();
    this.fromUnit = units[0].value;
    this.toUnit = units[1]?.value || units[0].value;
    this.fromValue = 1;
  }

  onConvert() {
    this.errorMsg = '';
    if (this.fromUnit === this.toUnit) { this.result = this.fromValue; return; }
    const payload = {
      type: this.selectedType,
      thisQuantityDTO: { value: this.fromValue, unit: this.fromUnit },
      thatQuantityDTO: { value: 0, unit: this.toUnit }
    };
    this.conversionService.convert(payload).subscribe({
      next: (res) => { this.result = res.resultValue; },
      error: () => { this.errorMsg = 'Conversion failed. Please try again.'; }
    });
  }

  swap() {
    [this.fromUnit, this.toUnit] = [this.toUnit, this.fromUnit];
    this.onConvert();
  }
}
