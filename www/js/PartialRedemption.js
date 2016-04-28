function PartialRedemption($scope) {

  $scope.newPartRed={};
  $scope.valueIsValid = function() {
     if(!$scope.newPartRed) return false;
     return !!Number($scope.newPartRed.value) && $scope.newPartRed.accountId && $scope.newPartRed.redOrSub;
  };
  $scope.add = function() {
    var ppp=$scope.$parent.partialRedemptions;
    if(ppp.constructor === Array) {
      if(ppp.length==0) {
        $scope.$parent.partialRedemptions={};
      } else {
        console.error("Invalid format for partial redemptions");
      }
    }
    $scope.$parent.partialRedemptions[$scope.newPartRed.accountId] = {
            id: $scope.newPartRed.accountId,
            value: $scope.newPartRed.value,
            redOrSub: $scope.newPartRed.redOrSub
    };
    $scope.newPartRed=null;
    $scope.setPrTrades();
  };
  $scope.del = function(id) {
    delete $scope.$parent.partialRedemptions[id];
    $scope.setPrTrades();
  };

  $scope.accountsMinusCurrentRedemptions = function() {
     var o = Array_diff(Object.keys($scope.$parent.accounts), Object.keys($scope.$parent.partialRedemptions));
     return o;
  };

  $scope.tradeid = function(str,acc,sec) {
    return str+"-"+acc+"-"+sec;
  };

  $scope.prTrades = {};
  $scope.prTradesLength = function() { return Object.keys($scope.prTrades).length; };
  $scope.setPrTrades = function() {
    // same as setTrades function in Trades.js

    $scope.prTrades = {};
    var prs = $scope.$parent.partialRedemptions;
    var acs = $scope.$parent.accounts;
    var strs = $scope.$parent.strategies;
    for(j in prs) {
      var stri=Object.keys(strs).filter(function(s) { return strs[s].name==acs[j].strategy; });
      if(stri.length!=1) console.error("Why not just 1 strategy returned? "+j);
      stri=strs[stri[0]];
      var redValSigned = prs[j].value * ( prs[j].redOrSub=="Subscription"?1:-1 );
      // var redFrac = redValSigned / acs[j].currentAmount; // redemption fraction
      for(k in acs[j].allocations) {
        var z = acs[j].allocations[k];
        // no need to check this for Method 1
        // if(z.allocation!=0) {
          // Method 1: redeem independently of rebalancing required
          // var perc = redFrac * z.allocation/100 * 100;
          // var usd = perc/100 * acs[j].currentAmount;

          // Method 2: redeem and rebalance at the same time
          var usd = (acs[j].currentAmount + redValSigned)*stri.allocations[k].allocation/100 - z.allocation/100*acs[j].currentAmount;
          var perc = 100*usd/acs[j].currentAmount;

          // Common to method 1 & 2
          var pxDate = $scope.$parent.securities[z.id].pxDate;
          var shares = usd / $scope.$parent.priceByIdDate(z.id,pxDate);
          var id = $scope.tradeid("partialRedemption",j,z.id);

          $scope.prTrades[id] = {
            "id": id,
            "strategy": "partialRedemption",
            "account": j,
            "security": z.id,
            "sign": shares>0?"Buy":"Sell",
            "perc": Math.abs(perc),
            "usd": Math.abs(usd),
            "shares": Math.abs(shares)
          };
        // } // end if allocation != 0
      }
    }
  };

  $scope.$on("loaded2", function() {
    $scope.setPrTrades();
  });

}
