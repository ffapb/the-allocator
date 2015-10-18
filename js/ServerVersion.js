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
    if(!$scope.$parent.config.api.ServerVersion) {
      console.log("get version not configured");
      return;
    }

    $scope.$parent.gvSt="Getting";
    $scope.versioningRemote.appVersion = "-";
    $scope.versioningRemote.appDate = "-";
    $scope.versioningRemote.dataVersion = "-";
    $scope.versioningRemote.dataDate = "-";

    $http.get($scope.$parent.config.api.ServerVersion).
      then(function(response) {
        $scope.versioningRemote.appVersion = response.data.appVersion;
        $scope.versioningRemote.appDate = response.data.appDate;
        $scope.versioningRemote.dataVersion = response.data.dataVersion;
        $scope.versioningRemote.dataDate = response.data.dataDate;
        $scope.$parent.gvSt="None";
      }, function(errResponse) {
        console.log("http get server version err");
        $scope.versioningRemote.appVersion = "N/A";
        $scope.versioningRemote.appDate = "N/A";
        $scope.versioningRemote.dataVersion = "N/A";
        $scope.versioningRemote.dataDate = "N/A";
        $scope.$parent.gvSt="Error";
      });

  }; // end getVersion
}
