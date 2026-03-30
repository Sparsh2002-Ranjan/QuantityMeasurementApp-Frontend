import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversionService } from '../services/conversion.service';

interface UnitOption { label: string; value: string; }

@Component({
  selector: 'app-arithmetic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="banner">
        <h2>Arithmetic Operations</h2>
      </div>

      <div class="content">

        <!-- Type selector -->
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

        <!-- Operation selector -->
        <p class="section-label">CHOOSE OPERATION</p>
        <div class="op-cards">
          <div class="op-card" [class.active]="operation === 'ADD'"      (click)="operation = 'ADD'">
            <span class="op-symbol">+</span><span>Add</span>
          </div>
          <div class="op-card" [class.active]="operation === 'SUBTRACT'" (click)="operation = 'SUBTRACT'">
            <span class="op-symbol">−</span><span>Subtract</span>
          </div>
          <div class="op-card" [class.active]="operation === 'MULTIPLY'" (click)="operation = 'MULTIPLY'">
            <span class="op-symbol">×</span><span>Multiply</span>
          </div>
          <div class="op-card" [class.active]="operation === 'DIVIDE'"   (click)="operation = 'DIVIDE'">
            <span class="op-symbol">÷</span><span>Divide</span>
          </div>
        </div>

        <!-- Inputs -->
        <div class="inputs-row">

          <!-- Value 1 -->
          <div class="input-box">
            <label>FIRST VALUE</label>
            <input type="number" [(ngModel)]="value1" placeholder="0" />
            <select [(ngModel)]="unit1">
              <option *ngFor="let u of getUnits()" [value]="u.value">{{ u.label }}</option>
            </select>
          </div>

          <!-- Operation symbol in the middle -->
          <div class="op-display">{{ getSymbol() }}</div>

          <!-- Value 2 -->
          <div class="input-box">
            <label>SECOND VALUE</label>
            <input type="number" [(ngModel)]="value2" placeholder="0" />
            <select [(ngModel)]="unit2">
              <option *ngFor="let u of getUnits()" [value]="u.value">{{ u.label }}</option>
            </select>
          </div>

        </div>

        <!-- Result unit picker -->
        <div class="result-unit-row">
          <label>GET ANSWER IN</label>
          <select [(ngModel)]="resultUnit" class="result-unit-select">
            <option *ngFor="let u of getUnits()" [value]="u.value">{{ u.label }}</option>
          </select>
        </div>

        <!-- Calculate button -->
        <button class="calc-btn" (click)="calculate()" [disabled]="loading">
          {{ loading ? 'Calculating...' : 'Calculate' }}
        </button>

        <!-- Result -->
        <div class="result-card" *ngIf="result !== null">
          <span class="res-expression">
            {{ value1 }} {{ getUnitLabel(unit1) }}
            {{ getSymbol() }}
            {{ value2 }} {{ getUnitLabel(unit2) }}
          </span>
          <span class="res-equals">=</span>
          <span class="res-value">{{ result }} {{ getUnitLabel(resultUnit) }}</span>
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

    /* Type cards */
    .type-cards { display: flex; gap: 16px; margin-bottom: 32px; }
    .type-card {
      flex: 1; background: #fff; border: 2px solid #e5e5e5; border-radius: 12px;
      padding: 20px 16px 14px; display: flex; flex-direction: column;
      align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s;
    }
    .type-card:hover { border-color: #5b6ef5; }
    .type-card.active { border-color: #5b6ef5; background: #f0f3ff; }
    .type-card span { font-size: 15px; font-weight: 500; color: #888; }
    .type-card.active span { color: #5b6ef5; font-weight: 600; }
    .type-card svg { color: #bbb; }
    .type-card.active svg { color: #5b6ef5; }

    /* Operation cards */
    .op-cards { display: flex; gap: 12px; margin-bottom: 32px; }
    .op-card {
      flex: 1; background: #fff; border: 2px solid #e5e5e5; border-radius: 10px;
      padding: 16px 8px; display: flex; flex-direction: column;
      align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s;
    }
    .op-card:hover { border-color: #5b6ef5; }
    .op-card.active { border-color: #5b6ef5; background: #f0f3ff; }
    .op-card span { font-size: 13px; color: #888; }
    .op-card.active span { color: #5b6ef5; }
    .op-symbol { font-size: 26px; font-weight: 700; color: #bbb; }
    .op-card.active .op-symbol { color: #5b6ef5; }

    /* Value inputs */
    .inputs-row { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
    .input-box {
      flex: 1; background: #fff; border-radius: 10px;
      padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
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
    .op-display {
      font-size: 32px; color: #5b6ef5; font-weight: 700;
      padding-bottom: 12px; user-select: none; min-width: 32px; text-align: center;
    }

    /* Result unit */
    .result-unit-row {
      background: #fff; border-radius: 10px; padding: 16px 20px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 20px;
    }
    .result-unit-row label {
      font-size: 13px; font-weight: 700; letter-spacing: 0.05em; color: #555; white-space: nowrap;
    }
    .result-unit-select {
      border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px;
      font-size: 14px; color: #444; outline: none; cursor: pointer; flex: 1;
    }

    /* Calculate button */
    .calc-btn {
      width: 100%; padding: 14px; background: #5b6ef5; color: #fff;
      border: none; border-radius: 10px; font-size: 16px; font-weight: 600;
      cursor: pointer; margin-bottom: 24px; transition: background 0.2s;
    }
    .calc-btn:hover { background: #4a5de0; }
    .calc-btn:disabled { opacity: 0.7; cursor: not-allowed; }

    /* Result card */
    .result-card {
      background: #fff; border-radius: 10px; padding: 24px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .res-expression { font-size: 16px; color: #888; }
    .res-equals { font-size: 20px; color: #aaa; }
    .res-value { font-size: 28px; font-weight: 700; color: #5b6ef5; }

    .error-msg {
      background: #fef2f2; color: #dc2626;
      padding: 10px 16px; border-radius: 8px; font-size: 14px;
    }
  `]
})
export class ArithmeticComponent {
  selectedType = 'LENGTH';
  operation = 'ADD';
  value1 = 0;
  unit1 = 'METERS';
  value2 = 0;
  unit2 = 'METERS';
  resultUnit = 'METERS';
  result: number | null = null;
  errorMsg = '';
  loading = false;

  lengthUnits: UnitOption[] = [
    { label: 'Metres',      value: 'METERS' },
    { label: 'Centimetres', value: 'CENTIMETERS' },
    { label: 'Feet',        value: 'FEET' },
    { label: 'Inches',      value: 'INCHES' },
    { label: 'Yards',       value: 'YARDS' }
  ];

  volumeUnits: UnitOption[] = [
    { label: 'Litre',      value: 'LITRE' },
    { label: 'Millilitre', value: 'MILLILITRE' },
    { label: 'Gallon',     value: 'GALLON' }
  ];

  constructor(private conversionService: ConversionService) {}

  getUnits(): UnitOption[] {
    return this.selectedType === 'VOLUME' ? this.volumeUnits : this.lengthUnits;
  }

  getUnitLabel(val: string): string {
    return this.getUnits().find(u => u.value === val)?.label || val;
  }

  getSymbol(): string {
    const map: any = { ADD: '+', SUBTRACT: '−', MULTIPLY: '×', DIVIDE: '÷' };
    return map[this.operation] || '+';
  }

  selectType(type: string) {
    this.selectedType = type;
    this.result = null;
    this.errorMsg = '';
    const units = this.getUnits();
    this.unit1 = units[0].value;
    this.unit2 = units[0].value;
    this.resultUnit = units[0].value;
  }

  calculate() {
    this.errorMsg = '';
    this.result = null;

    if (this.operation === 'DIVIDE' && this.value2 === 0) {
      this.errorMsg = 'Cannot divide by zero.';
      return;
    }

    this.loading = true;
    const payload = {
      type: this.selectedType,
      operation: this.operation,
      value1: this.value1,
      unit1: this.unit1,
      value2: this.value2,
      unit2: this.unit2,
      resultUnit: this.resultUnit
    };

    this.conversionService.arithmetic(payload).subscribe({
      next: (res) => {
        this.result = res.resultValue;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Calculation failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
