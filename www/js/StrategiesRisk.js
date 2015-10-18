function StrategiesRisk($scope) {

  // for risk tab
  $scope.showDiff = false;
  $scope.allocDiff = function(ac,al,forceShowDiff) {
    var dm = new DataManager($scope.$parent.strategies, $scope.$parent.accounts, $scope.$parent.securities);
    if($scope.showDiff||forceShowDiff) {
      return dm.allocDiffCore(ac,al);
    } else {
      if(!$scope.accounts[ac].hasOwnProperty("allocations") ||
          !$scope.accounts[ac].allocations.hasOwnProperty(al.id)
          ) {
        return 9999999999;
      }
      return $scope.accounts[ac].allocations[al.id].allocation;
    }
  };
  $scope.allocSumDiff = function(ac) {
    if($scope.showDiff) {
      var o = $scope.$parent.allocationsSum($scope.$parent.strategies[$scope.selected].allocations) - 
        $scope.$parent.allocationsSum($scope.accounts[ac].allocations);
      return -1*o;
    } else {
      return $scope.$parent.allocationsSum($scope.accounts[ac].allocations);
    }
  };

  $scope.allocAll0 = function(al) {
    if(al.allocation!=0) return false;
    var ac = $scope.selectedAccounts();
    for(var i in ac) {
      if($scope.allocDiff(ac[i],al)!=0) return false;
    }
    return true;
  };

  $scope.allocColor = function(d) {
    // var d = $scope.allocDiff(ac,al);
    if(d>0) {
      return Math.abs(d) >= $scope.$parent.config.riskThreshold ? 'green' : 'lightgreen';
    }

    if(d<0) {
      return Math.abs(d) >= $scope.$parent.config.riskThreshold ? 'red' : 'pink';
    }

    return 'lightgrey';
  };

}
