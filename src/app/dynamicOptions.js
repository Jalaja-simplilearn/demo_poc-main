
'use strict';

angular.module('app')
  .controller('DynamicOptionsCtrl',['$scope', '$timeout', '$window', 'ApiService', 'ProductService',function ($scope, $timeout, $window, ApiService, ProductService) {
    var definitions = [{
      name: 'peopleList',
      title: 'people list',
      templateUrl: 'app/template/dynamicOptionsContainer.html',
      size: { width: '800px', minWidth: '600px', },
      includeUrl: 'app/template/peopleList.html'
    }, {
      name: 'peopleThumbnail',
      title: 'people thumbnail',
      templateUrl: 'app/template/dynamicOptionsContainer.html',
      size: { width: '1000px', minWidth: '800px', },
      includeUrl: 'app/template/peopleThumbnail.html'
    }];

    $scope.style = 'peopleList';
    $scope.query = '';
    var timeoutPromise;

    $scope.$watch('query', function(newQuery) {
      if (timeoutPromise) {
        $timeout.cancel(timeoutPromise);
      }

      timeoutPromise = $timeout(function() {
        ApiService.getQueryData(newQuery)
          .then(function(response) {
            $scope.data = response.data;
          });
      }, 500);
    });

    var defaultWidgets = [
      { name: $scope.style }
    ];

    $scope.dashboardOptions = {
      hideToolbar: true,
      defaultWidgets: defaultWidgets,
      storage: $window.localStorage,
      storageId: 'demo_dynamic-options_' + Date.now()
    };

    ApiService.getData().then(function(response) {
        $scope.data = response.data;
    }, function(error) {
        console.error('Error occurred:', error);
    });

    $scope.sendData = function() {
        var data = { id:123, name:'some data' };

        ApiService.postData(data).then(function(response) {
            console.log('Data sent successfully');
        }, function(error) {
            console.error('Error occurred:', error);
        });
    };

    $scope.calculateDiscount = function(price, discount) {
      return ProductService.calculateDiscount(price, discount);
  };
    $scope.toggleWidget = function() {
      $scope.style = ($scope.style === 'peopleList' ? 'peopleThumbnail' : 'peopleList');

      var obj = _.cloneDeep($scope.dashboardOptions);
      obj.defaultWidgets[0].name = $scope.style;
      obj.storageId = 'demo_dynamic-options_' + Date.now();
      $timeout(function() {
        delete $scope.dashboardOptions;
      }, 0);
      $timeout(function() {
        $scope.dashboardOptions = obj;
      }, 0);
    };
  }])
  .controller('PeopleCtrl', function ($scope) {
    $scope.toggleTemplate = function() {
      $scope.widget.includeUrl = ($scope.widget.includeUrl === 'app/template/peopleList.html' ? 'app/template/peopleThumbnail.html' : 'app/template/peopleList.html');
    };

    $scope.removePerson = function(person) {
      var index = _.findIndex($scope.people, function(p) {
        return p.$$hashKey === person.$$hashKey;
      });
      if (index > -1) {
        $scope.people.splice(index, 1);
      }
    };

    function generatePeople() {
      var firstNames = [ 'James', 'Christopher', 'Ronald', 'Mary', 'Lisa', 'Michelle', 'John', 'Daniel', 'Anthony', 'Patricia', 'Nancy', 'Laura' ],
          lastNames = [ 'Smith', 'Anderson', 'Clark', 'Wright', 'Mitchell', 'Johnson', 'Thomas', 'Rodriguez', 'Lopez', 'Perez' ],
          ary = [], f, l;

      while(ary.length < 10) {
        f = Math.floor(Math.random() * (firstNames.length));
        l = Math.floor(Math.random() * (lastNames.length));
        ary.push({
          name: firstNames[f] + ' ' + lastNames[l],
          email: lastNames[l].toLowerCase() + '@company.com',
          phone:  Math.random().toString().slice(2, 12).match(/^(\d{3})(\d{3})(\d{4})/).slice(1).join('-')
        });
        firstNames.splice(f, 1);
        lastNames.splice(l, 1);
      }

      return ary;
    }

    $scope.people = generatePeople();
  });