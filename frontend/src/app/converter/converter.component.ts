import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {combineLatest, distinctUntilChanged, filter, merge, Subject, takeUntil} from "rxjs";
import {Currencies} from "../helpers/currencies";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass']
})
export class ConverterComponent implements OnInit {

  @Input() rate!: number;
  @Output() currencyChanged = new EventEmitter<{from: string, to: string}>();
  currencies = Currencies;
  form!: FormGroup;
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      fromAmount: 0,
      fromCurrency: null,
      toAmount: 0,
      toCurrency: null
    });

    const controlValueChanges =
      (controlName: string) => this.form.get(controlName)!.valueChanges.pipe(distinctUntilChanged());

    merge([
      controlValueChanges('fromAmount'),
      controlValueChanges('toAmount'),
    ]).pipe(takeUntil(this.destroy$))
      .subscribe( _ => {
          this.form.get('fromAmount')!.updateValueAndValidity({emitEvent: false});
          this.form.get('toAmount')!.updateValueAndValidity({emitEvent: false});
        }
      );

    combineLatest([
      controlValueChanges('fromCurrency'),
      controlValueChanges('toCurrency')
    ]).pipe(
      filter(([from, to]) => Boolean(from) && Boolean(to)),
      takeUntil(this.destroy$)
    ).subscribe(([from, to]) => this.currencyChanged.emit({from, to}));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  convertToAmount() {
    return  String((this.form.get('toAmount')?.value * (1/this.rate)).toFixed(2));
  }

  convertFromAmount() {
    return String((this.form.get('fromAmount')?.value * this.rate).toFixed(2));
  }
}
