function StrategiesPerformance($scope) {

  $scope.add = function(s) {
    //var s = $scope.$parent.strategies[$scope.$parent.selected];
    if(!s) s = $scope.$parent.strategies[$scope.$parent.selected];
    if(!s) return; // still booting

    // y: year, s: strategy, v: value
    var y = $scope.newStratPerf.y;
    var v = Number($scope.newStratPerf.v);

    if(!s.hasOwnProperty("performance")) {
      s.performance = {};
    }
    s.performance[y] = v;

    $scope.newStratPerf={};
    $scope.$emit("edited");
  };

  $scope.isinvalid = function() {
    if(!$scope.newStratPerf) return true;
    var y = $scope.newStratPerf.y;
    var v = $scope.newStratPerf.v;
    if(!y||!v) return true;
    return false;
  };

  $scope.del = function(ts,base) {
    if(!base) base=$scope.$parent.strategies[$scope.$parent.selected];
    delete base.performance[ts];
    $scope.$emit("edited");
  };

}
