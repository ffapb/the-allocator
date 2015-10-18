function Errors($scope) {
// This controller displays header alerts in case of data inconsistencies

  // check that there are no undefined securities in the strategies
  var self = this;
  this.missingSecuritiesCore = function(y,f2c) {
  // e.g.: y = $scope.strategies
    var missing = [];
    for(i in y) {
      for(j in y[i].allocations) {
        if(!!y[i].allocations[j]) {
          if(y[i].allocations[j][f2c]!=0) {
            var x = y[i].allocations[j].id;
            if(Object.keys($scope.$parent.securities).indexOf(x)==-1) {
              missing.push(x);
            }
          }
        }
      }
    }
    if(missing.length>0) {
      missing = Array_unique(missing);
      return missing.join(",");
    }
    return false;
  }

  $scope.missingSecurities = function() {
    var m1 = self.missingSecuritiesCore($scope.$parent.strategies,"allocation");
    var m2 = self.missingSecuritiesCore($scope.$parent.accounts,"numShares");
    if(!m1 && !m2) return false;
    return (!!m1?m1:"")+";"+(!!m2?m2:"");
  };

  // check that there are no undefined strategies in the accounts
  $scope.missingStrategies = function() {
    var missing = [];
    var y = $scope.$parent.accounts;
    for(i in y) {
      var x = y[i].strategy;
      if(Object.keys($scope.$parent.strategies).indexOf(x)==-1) {
        missing.push(x);
      }
    }
    if(missing.length>0) {
      return missing.join(",");
    }
    return false;
  }

  // check that there are no account ID's that are not the same as the account keys
  $scope.invalidAccountKeys = function() {
    var invalids = [];
    var y = $scope.$parent.accounts;
    for(i in y) {
      var x = y[i].id;
      if(i != y[i].id) {
        invalids.push(i);
      }
    }
    if(invalids.length>0) {
      return invalids.join(",");
    }
    return false;
  }

  // check that there are no pxDate values that do not exist in the prices data
  $scope.missingSecurityPxDate = function() {
    var missing = [];
    var y = $scope.$parent.securities;
    for(i in y) {
      var x1 = y[i].pxDate;
      var x2 = x1 + ": " + y[i].name+" ("+i+", "+y[i].isin+")";
      if(x1!="latest") {
        if(!$scope.$parent.prices.hasOwnProperty(i) || !$scope.$parent.prices[i].history.hasOwnProperty(x1)) {
          missing.push(x2);
        }
      } else {
        if(!$scope.$parent.prices.hasOwnProperty(i) || !$scope.$parent.prices[i].history.length==0) {
          missing.push(x2);
        }
      }
    }
    return missing;
  };

  // check that no security has more than 1 currency attached to it in the client portfolios
  $scope.securityMultipleCurrencies = function() {
    // build hash of security to currencies
    var secCurs = {};

    // get 1st from allocations
    for(ac in $scope.$parent.accounts) {
      for(al in $scope.$parent.accounts[ac].allocations) {
        if($scope.$parent.accounts[ac].allocations[al]) {
          cc = $scope.$parent.accounts[ac].allocations[al].currency
          if(cc) {
            if(!secCurs[al]) secCurs[al] = [];
            secCurs[al].push(cc);
          }
        }
      }
    }

    // now get from prices
    for(al in $scope.$parent.prices) {
      for(ac in $scope.$parent.prices[al].history) {
        if($scope.$parent.prices[al].history[ac]) {
          cc = $scope.$parent.prices[al].history[ac].currency
          if(cc) {
            if(!secCurs[al]) secCurs[al] = [];
            secCurs[al].push(cc);
          }
        }
      }
    }

    // make unique
    for(al in secCurs) { secCurs[al] = Array_unique(secCurs[al]); }
    // filter for the securities with more than 1 currency
    swmt1c = Object.keys(secCurs).filter(function(x) { return secCurs[x].length>1; });
    return swmt1c;
  };

}
