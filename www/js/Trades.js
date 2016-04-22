function Trades($scope) {

  var self = this;

  $scope.tradeid = function(str,acc,sec) {
    return str+"-"+acc+"-"+sec;
  };

  // list required trades
  $scope.$parent.trades = {};
  $scope.setTrades = function() {
    var dm = new DataManager($scope.$parent.strategies, $scope.$parent.accounts, $scope.$parent.securities);

    trades = {};
    var y = $scope.$parent.strategies;
    for(i in y) {
      var acs2 = $scope.$parent.accounts;
      var acs = Object.keys(acs2).filter(function(x) { return acs2[x].strategy==y[i].name; });
      for(j in acs) {
        for(k in y[i].allocations) {
          if(!!y[i].allocations[k]) {
            if(y[i].allocations[k].allocation!=0 ||
               (acs2[acs[j]].allocations.hasOwnProperty(k) && acs2[acs[j]].allocations[k].allocation!=0)
              ) {
              var x = acs[j];
              var z = y[i].allocations[k];
              var perc = dm.allocDiffCore(x,z);
              if(Math.abs(perc)>=$scope.$parent.config.riskThreshold) {
                var usd = perc/100*$scope.$parent.accounts[x].currentAmount;
                var pxDate = $scope.$parent.securities[z.id].pxDate;
                var shares = usd / $scope.$parent.priceByIdDate(z.id,pxDate);
                var id = $scope.tradeid(y[i].name,x,z.id);
    
                trades[id] = {
                  "id": id,
                  "strategy": y[i].name,
                  "account": x,
                  "security": z.id,
                  "sign": shares<0?"Buy":"Sell",
                  "perc": Math.abs(perc),
                  "usd": Math.abs(usd),
                  "shares": Math.abs(shares)
                };
              }
            } // end if allocation != 0
          }
        }
      }
    }
    $scope.$parent.trades = trades;
    self.setTradesPooledBySecurity();
  };

  $scope.$on("loaded2", function() {
    $scope.setTrades();
  });

  $scope.$on("edited2", function() {
    $scope.setTrades();
  });

  // view trades as: default, pooled by security, filtered for a single account
  $scope.viewAs = "default";

  // pooling trades by security
  $scope.tradesPooledBySecurity = {};
  $scope.tradesPooledBySecurityLength = function() { return Object.keys($scope.tradesPooledBySecurity).length; };
  this.setTradesPooledBySecurity = function() {
    tr2 = $scope.tradesPooledBySecurity;
    var trs = $scope.$parent.trades;

    // zeroing first
    for(tr in trs) {
      trac = $scope.$parent.accounts[trs[tr].account];
      var id = trs[tr].security+'-'+trs[tr].sign+(!trac.fromMF?"":"-"+trac.mfSource); // distinguish sells from buys and lebanon from dubai
      if(tr2.hasOwnProperty(id)) {
        tr2[id].usd = 0;
        tr2[id].shares = 0;
      }
    }

    // accumulating
    eadsName=$scope.$parent.getEadsName()
    for(tr in trs) {
      trac = $scope.$parent.accounts[trs[tr].account];
      var id = trs[tr].security+'-'+trs[tr].sign+(!trac.fromEADS?"":"-"+trac.eadsSource); // distinguish sells from buys and lebanon from dubai
      if(!tr2.hasOwnProperty(id)) {
        tr2[id] = {
          id: id,
          security: trs[tr].security,
          securityName: $scope.$parent.securities[trs[tr].security].name,
          sign: trs[tr].sign,
          usd: trs[tr].usd,
          shares: trs[tr].shares,
          source: !trac.fromEADS?"Non-"+eadsName:eadsName+" "+trac.eadsSource
        };
      } else {
        tr2[id].usd = tr2[id].usd + trs[tr].usd;
        tr2[id].shares = tr2[id].shares + trs[tr].shares;
      }
    }
  };

  // filtering trades for a single account
  $scope.tradesSingleAccount = {};
  $scope.tradesSingleAccountLength = function() { return Object.keys($scope.tradesSingleAccount).length; };
  $scope.setTradesSingleAccount = function() {
    x = $scope.tradesFilterId($scope.viewAsAccount);
    $scope.tradesSingleAccount = {};
    for(i in x) {
      $scope.tradesSingleAccount[x[i]] = $scope.trades[x[i]];
    }
  };
  $scope.tradesFilterId = function(id) {
    // copied from accountsRedeemed in AccountAddEdit
    x = Object.keys($scope.trades).filter(function(y) {
      return $scope.trades[y].account==id;
    });
    return x;
  };


}
