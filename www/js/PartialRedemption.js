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
    for(j in prs) {
      redFrac = prs[j].value * ( prs[j].redOrSub=="Subscription"?-1:1 ) / $scope.$parent.accounts[j].currentAmount; // redemption fraction
      for(k in acs[j].allocations) {
        if(acs[j].allocations[k].allocation!=0) {
          var x = j;
          var z = acs[j].allocations[k];
          var perc = redFrac * z.allocation/100 * 100;

          var usd = perc/100 * acs[x].currentAmount;
          var pxDate = $scope.$parent.securities[z.id].pxDate;
          var shares = usd / $scope.$parent.priceByIdDate(z.id,pxDate);
          var id = $scope.tradeid("partialRedemption",x,z.id);

          $scope.prTrades[id] = {
            "id": id,
            "strategy": "partialRedemption",
            "account": x,
            "security": z.id,
            "sign": shares<0?"Buy":"Sell",
            "perc": Math.abs(perc),
            "usd": Math.abs(usd),
            "shares": Math.abs(shares)
          };
        } // end if allocation != 0
      }
    }
  };

  $scope.$on("loaded2", function() {
    $scope.setPrTrades();
  });

}
