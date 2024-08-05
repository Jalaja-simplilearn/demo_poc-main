// dynamic-options.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DynamicOptionsComponent } from './dynamic-options.component';
import { ApiService } from '../services/api.service';
import { ProductService } from '../services/product.service';
import { of, throwError } from 'rxjs';

describe('DynamicOptionsComponent', () => {
  let component: DynamicOptionsComponent;
  let fixture: ComponentFixture<DynamicOptionsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getData', 'getQueryData', 'postData']);
    productServiceSpy = jasmine.createSpyObj('ProductService', ['calculateDiscount']);

    TestBed.configureTestingModule({
      declarations: [ DynamicOptionsComponent ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dashboard options on construction', () => {
    expect(component.dashboardOptions).toBeDefined();
    expect(component.dashboardOptions.hideToolbar).toBeTrue();
    expect(component.dashboardOptions.defaultWidgets).toEqual([{ name: 'peopleList' }]);
  });

  it('should toggle widget style', () => {
    component.style = 'peopleList';
    component.toggleWidget();
    expect(component.style).toBe('peopleThumbnail');
    component.toggleWidget();
    expect(component.style).toBe('peopleList');
  });

  it('should send data', () => {
    apiServiceSpy.postData.and.returnValue(of({}));
    component.sendData();
    expect(apiServiceSpy.postData).toHaveBeenCalledWith({ id: 123, name: 'some data' });
  });

  it('should calculate discount', () => {
    productServiceSpy.calculateDiscount.and.returnValue(80);
    const result = component.calculateDiscount(100, 20);
    expect(result).toBe(80);
    expect(productServiceSpy.calculateDiscount).toHaveBeenCalledWith(100, 20);
  });

  it('should fetch data on init', fakeAsync(() => {
    const mockData = [{ id: 1, name: 'Test' }];
    apiServiceSpy.getData.and.returnValue(of(mockData));
    component.ngOnInit();
    tick();
    expect(component.data).toEqual(mockData);
    expect(component.selectedData).toEqual(mockData[0]);
  }));

  it('should handle error when fetching data', fakeAsync(() => {
    apiServiceSpy.getData.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    component.ngOnInit();
    tick();
    expect(console.error).toHaveBeenCalled();
  }));

  it('should update selected data and emit change', () => {
    spyOn(component.selectedOptionChange, 'emit');
    const newValue = { id: 2, name: 'New Test' };
    component.onSelectedDataChange(newValue);
    expect(component.selectedData).toEqual(newValue);
    expect(component.selectedOptionChange.emit).toHaveBeenCalledWith(newValue);
  });
  
  it('should update dashboard options when toggling widget', () => {
    component.style = 'peopleList';
    component.toggleWidget();
    expect(component.dashboardOptions.defaultWidgets).toEqual([{ name: 'peopleThumbnail' }]);
    expect(component.dashboardOptions.storageId).toContain('demo_dynamic-options_');
  });

  it('should set up query observable', fakeAsync(() => {
    const mockQueryData = [{ id: 2, name: 'Query Result' }];
    apiServiceSpy.getQueryData.and.returnValue(of(mockQueryData));
    component.ngOnInit();
    (component as any).querySubject.next('test query');
    tick(500);
    expect(apiServiceSpy.getQueryData).toHaveBeenCalledWith('test query');
    expect(component.data).toEqual(mockQueryData);
  }));

  it('should handle error in query observable', fakeAsync(() => {
    apiServiceSpy.getQueryData.and.returnValue(throwError(() => new Error('Query error')));
    spyOn(console, 'error');
    component.ngOnInit();
    (component as any).querySubject.next('test query');
    tick(500);
    expect(console.error).toHaveBeenCalled();
  }));

  it('should complete observables on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
