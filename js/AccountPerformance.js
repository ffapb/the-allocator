function AccountPerformance($scope) {
    // https://en.wikipedia.org/wiki/Time-weighted_return

  $scope.newAccPerf = {};
  $scope.add = function() {
    s = $scope.$parent.newAccount;
    if(!s) return; // still booting

    if(!s.performance) {
      s.performance = {};
    }
    // d: date, io: in/outflow, nav after in/out
    s.performance[$scope.newAccPerf.d] = {
        d: $scope.newAccPerf.d,
        io: Number($scope.newAccPerf.io),
        nav: Number($scope.newAccPerf.nav)
    };

    $scope.newAccPerf={};
    $scope.$emit("edited");
  };

  $scope.isinvalid = function() {
    if(!$scope.newAccPerf) return true;
    var d = $scope.newAccPerf.d;
    var io = $scope.newAccPerf.io;
    var nav = $scope.newAccPerf.nav;
    if(!d) return 1;
    if(d <= $scope.$parent.newAccount.inception) return 2;
    if(d >= $scope.$parent.newAccount.currentDate) return 5;
    if(!!$scope.$parent.newAccount.performance && Object.keys($scope.$parent.newAccount.performance).indexOf(d)!=-1) return 3;
    if(!$scope.$parent.validDate(d)) return 4;
    if(!io||!nav) return 1;
    return false;
  };

  $scope.del = function(ts) {
    base=$scope.$parent.newAccount;
    delete base.performance[ts];
    $scope.$emit("edited");
  };

}
