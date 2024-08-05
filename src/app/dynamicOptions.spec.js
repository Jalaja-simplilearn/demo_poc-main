describe('Controller: DynamicOptionsCtrl', function() {

    var $scope, $timeout, $window, apiService, ProductFactory;
  
    beforeEach(module('app'));
  
    beforeEach(inject(function($rootScope, $controller, _$timeout_, _$window_, _apiService_, _ProductFactory_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $window = _$window_;
      apiService = _apiService_;
      ProductFactory = _ProductFactory_;
  
      spyOn(apiService, 'getData').and.returnValue(Promise.resolve([{ id: 1, name: 'Test' }]));
      spyOn(apiService, 'postData').and.returnValue(Promise.resolve({}));
  
      $controller('DynamicOptionsCtrl', {
        $scope: $scope,
        $timeout: $timeout,
        $window: $window,
        apiService: apiService,
        ProductFactory: ProductFactory
      });
    }));
  
    describe('the controller properties', function() {
  
      it('should have properties in scope', function() {
        expect($scope.style).toEqual('peopleList');
        expect($scope.dashboardOptions.hideToolbar).toEqual(true);
        expect($scope.dashboardOptions.defaultWidgets[0].name).toEqual('peopleList');
        expect($scope.dashboardOptions.storage).toBeDefined();
        expect($scope.dashboardOptions.storageId).toContain('demo_dynamic-options_');
      });
  
    });
  
    describe('the sendData method', function() {
  
      it('should send data', function() {
        $scope.sendData();
        expect(apiService.postData).toHaveBeenCalled();
      });
  
    });
  
    describe('the calculateDiscount method', function() {
  
      it('should calculate discount', function() {
        spyOn(ProductFactory, 'calculateDiscount').and.returnValue(50);
        var discount = $scope.calculateDiscount(100, 50);
        expect(discount).toEqual(50);
      });
  
    });
  
    describe('the toggleWidget method', function() {
  
      it('should toggle widget style', function() {
        $scope.toggleWidget();
        expect($scope.style).toEqual('peopleThumbnail');
        $scope.toggleWidget();
        expect($scope.style).toEqual('peopleList');
      });
  
    });
  
  });