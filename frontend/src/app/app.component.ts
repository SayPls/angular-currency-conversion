import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ExchangeApiService} from "./service/exchange-api.service";
import {Rate} from "./model/rate";
import {Currencies} from "./helpers/currencies";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy, OnInit {

  currentEurRate = {} as Rate;
  currentUsdRate = {} as Rate;
  destroy$ = new Subject<void>();
  @Output() rate!: number;

  constructor(private exchangeService: ExchangeApiService) {}

  ngOnInit(): void {
       this.loadRateFormUSD();
       this.loadRateFormEUR();
    }

  loadRate($event: { from: string; to: string }) {
    this.exchangeService.getRates($event.from, $event.to)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.rate = resp.conversion_rate
    });
  }

  loadRateFormUSD() {
    this.exchangeService.getRates(Currencies[0],Currencies[3])
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => this.currentUsdRate = resp);
  }

  loadRateFormEUR() {
    this.exchangeService.getRates(Currencies[1],Currencies[3])
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => this.currentEurRate = resp);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
