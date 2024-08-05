
  class ApiService {
    constructor() {
      this.apiUrl = 'http://api.example.com/';
    }
    
    getData = function(url) {
      return $http.get(url);
    };

    getQueryData = function (query) {
      return $http.get(url + '/' + query);
    }
    postData = function(url, data) {
      return $http.post(url, data);
    };

    putData = function(url, data) {
      return $http.put(url, data);
    };

    deleteData = function(url) {
      return $http.delete(url);
    };

    getDataById = function(url, id) {
      return $http.get(url + '/' + id);
    };

    updateDataById = function(url, id, data) {
      return $http.put(url + '/' + id, data);
    };

    deleteDataById = function(url, id) {
      return $http.delete(url + '/' + id);
    };

    postDataWithHeaders = function(url, data, headers) {
      return $http.post(url, data, { headers: headers });
    };
  }
  // }]);