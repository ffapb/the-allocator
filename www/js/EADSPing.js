function EADSPing($scope,$http) {

  $scope.pingStatus=0;
  $scope.pingEads = function() {
        if(!$scope.$parent.getEads()) return;

        var base = $scope.$parent.getEads() + "?type=accounts&prefix=";
        $scope.pingStatus=1;
        $http.get(
            base+"AB1343" // example account to test with
          ).
          then(function(response) {
            $scope.$parent.eadsAvail = true;
            $scope.pingStatus=0;
          }, function(errResponse) {
            $scope.$parent.eadsAvail = false;
            $scope.pingStatus=0;
          });
  };

  angular.element(document).ready(function () {
      $scope.pingEads();
  });

}
