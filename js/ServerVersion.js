function ServerVersion($scope,$http) {

  $scope.versioningRemote.appVersion = "-";
  $scope.versioningRemote.appDate = "-";
  $scope.versioningRemote.dataVersion = "-";
  $scope.versioningRemote.dataDate = "-";

  angular.element(document).ready(function () {
    $scope.getVersion();
    setInterval(function() {
      $scope.$apply(function() {
        $scope.getVersion();
      });
    }, 60000);
  });

  $scope.$on("savedOnServer2",function() { $scope.getVersion(); });

  $scope.getVersion = function() {
        $scope.$parent.gvSt="Getting";
        $http.get("api/ServerVersion.php").
          then(function(response) {
            $scope.versioningRemote.appVersion = response.data.appVersion;
            $scope.versioningRemote.appDate = response.data.appDate;
            $scope.versioningRemote.dataVersion = response.data.dataVersion;
            $scope.versioningRemote.dataDate = response.data.dataDate;
            $scope.$parent.gvSt="None";
          }, function(errResponse) {
            $scope.versioningRemote.appVersion = "N/A";
            $scope.versioningRemote.appDate = "N/A";
            $scope.versioningRemote.dataVersion = "N/A";
            $scope.versioningRemote.dataDate = "N/A";
            $scope.$parent.gvSt="Error";
          });
  };
}
