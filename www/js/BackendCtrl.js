function BackendCtrl($scope,$http) {

  $scope.getStatus=0;
  $scope.get = function() {
        $scope.getStatus=1;
        $http.get("/the-allocator-config.json").
          then(function(response) {
            $scope.$parent.config = response.data;
            $scope.getStatus=0;
            $scope.$emit("loadedBackend");
          }, function(errResponse) {
            console.error("the-allocator-config.json not available");
            $scope.getStatus=0;
          });
  };

  angular.element(document).ready(function () {
      $scope.get();
  });

}
