// dynamic-options.component.ts

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-dynamic-options',
  templateUrl: './dynamic-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicOptionsComponent implements OnInit, OnDestroy {
  @Input() style: string = 'peopleList';
  @Input() selectedOption: any;
  @Output() selectedOptionChange = new EventEmitter<any>();

  private destroy$: Subject<void> = new Subject<void>();
  private querySubject: Subject<string> = new Subject<string>();

  public query: string = '';
  public data: any[] = [];
  public selectedData: any = null;
  public dashboardOptions: {
    hideToolbar: boolean;
    defaultWidgets: { name: string }[];
    storage: Storage;
    storageId: string;
  };

  private definitions: any[] = [
    {
      name: 'peopleList',
      title: 'people list',
      templateUrl: 'app/template/dynamicOptionsContainer.html',
      size: { width: '800px', minWidth: '600px', },
      includeUrl: 'app/template/peopleList.html'
    },
    {
      name: 'peopleThumbnail',
      title: 'people thumbnail',
      templateUrl: 'app/template/dynamicOptionsContainer.html',
      size: { width: '1000px', minWidth: '800px', },
      includeUrl: 'app/template/peopleThumbnail.html'
    }
  ];

  constructor(
    private apiService: ApiService,
    private productService: ProductService
  ) {
    this.initDashboardOptions();
  }

  ngOnInit(): void {
    this.setupQueryObservable();
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleWidget(): void {
    this.style = this.style === 'peopleList' ? 'peopleThumbnail' : 'peopleList';
    this.updateDashboardOptions();
  }

  public sendData(): void {
    const data = { id: 123, name: 'some data' };
    this.apiService.postData(data).subscribe({
      next: () => console.log('Data sent successfully'),
      error: (error) => console.error('Error occurred:', error)
    });
  }

  public calculateDiscount(price: number, discount: number): number {
    return this.productService.calculateDiscount(price, discount);
  }

  public onSelectedDataChange(value: any): void {
    this.selectedData = value;
    this.selectedOptionChange.emit(value);
  }

  private fetchData(): void {
    this.apiService.getData().subscribe({
      next: (response) => {
        this.data = response;
        if (this.data.length > 0) {
          this.selectedData = this.data[0];
        }
      },
      error: (error) => console.error('Error occurred:', error)
    });
  }

  private setupQueryObservable(): void {
    this.querySubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe((query: string) => {
      this.apiService.getQueryData(query).subscribe({
        next: (response: any) => this.data = response,
        error: (error) => console.error('Error occurred:', error)
      });
    });
  }
    
  private initDashboardOptions(): void {
    this.dashboardOptions = {
      hideToolbar: true,
      defaultWidgets: [{ name: this.style }],
      storage: localStorage,
      storageId: `demo_dynamic-options_${Date.now()}`
    };
  }

  private updateDashboardOptions(): void {
    this.dashboardOptions = {
      ...this.dashboardOptions,
      defaultWidgets: [{ name: this.style }],
      storageId: `demo_dynamic-options_${Date.now()}`
    };
  }
}
