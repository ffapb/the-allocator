function SecuritiesPriceDates($scope) {

  $scope.setAllPriceDatesLatest = function() {
    for(sec in $scope.$parent.securities) {
      $scope.$parent.securities[sec].pxDate="latest";
    }
    $scope.$emit("edited");
  };

  $scope.allPriceDatesLatest = function() {
    for(sec in $scope.$parent.securities) {
      if($scope.$parent.securities[sec].pxDate!="latest") return false;
    }
    return true;
  };

  $scope.priceDates = function() {
    var pxDates=[];
    for(pr in $scope.$parent.prices) {
      for(hh in $scope.$parent.prices[pr].history) {
        pxDates.push($scope.$parent.prices[pr].history[hh].pxDate);
      }
    }
    pxDates=Array_unique(pxDates).sort().reverse();
    return pxDates;
  };

  $scope.priceDatesUse = "";
  $scope.useLastAvailable = true;
  $scope.setAllPriceDates = function() {
    pxd = $scope.priceDatesUse;
    console.log("use",pxd);
    // iterate over all securities
    for(sec in $scope.$parent.securities) {
        if($scope.$parent.prices[sec].history.hasOwnProperty(pxd)) {
          // since date is available, then use it
          $scope.$parent.securities[sec].pxDate=pxd;
        } else {
          if($scope.useLastAvailable) {
            // take last date available
            var hh2 = Object.keys($scope.$parent.prices[sec].history).filter(function(hh) {
              return hh <= pxd;
            });
            if(hh2.length>0) {
              hh2 = hh2.sort().reverse()[0];
              $scope.$parent.securities[sec].pxDate = hh2;
            } else {
              // if no available dates were from before pxd
              // just set to pxd, and let the app complain to the user
              $scope.$parent.securities[sec].pxDate = pxd;
            }
          } else {
              // if user doesn't want to use whatever is availble
              // just set to pxd, and let the app complain to the user
              $scope.$parent.securities[sec].pxDate = pxd;
          }
        }
    } 
    $scope.$emit("edited");
  };

  $scope.delSecuritiesOnlyInPricesAll = function() {
          var anyDeleted = false;
          for(sec in $scope.$parent.securities) {
            anyDeleted = anyDeleted || $scope.delSecuritiesOnlyInPricesSingle(sec);
          }

          if(anyDeleted) $scope.$emit("edited");
  };

  $scope.delSecuritiesOnlyInPricesSingle = function(sec) {
    if(!$scope.strategyUsingSecurity(sec)&&
       !$scope.accountUsingSecurity(sec)&&
        $scope.pricesUsingSecurity(sec)) {
      delete $scope.$parent.securities[sec]; 
      delete $scope.$parent.prices[sec]; 
      return true;
    }
    return false;
  };

  $scope.existsSecuritiesOnlyInPrices = function() {
          for(sec in $scope.$parent.securities) {
            if(!$scope.strategyUsingSecurity(sec)&&
               !$scope.accountUsingSecurity(sec)&&
                $scope.pricesUsingSecurity(sec)) {
              return true;
            }
          }
          return false;
  };

}
