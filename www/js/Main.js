function Main($scope) {

  $scope.strategies = {};
  $scope.accounts = {};
  $scope.securities = {};
  $scope.prices = {};
  $scope.trades = [];
  $scope.config = {
    riskThreshold: 0,
    title1: "The Allocator"
    title2: "by Shadi Akiki"
  };
  $scope.versioning = {};
  $scope.versioningRemote = {};
  $scope.partialRedemptions = {};

  $scope.editingMode = false; // mirroring from SaveLocalRemote
  $scope.dataEdited = false; // mirroring from SaveLocalRemote
  $scope.gvSt = "None"; // mirroring from ServerVersion

  $scope.allocationsSum = function(y) {
    // x: $scope.selected.allocations
    if(y===undefined) return 0;
    if(Object.keys(y).length==0) return 0;

    var o = Object.keys(y).map(function(x) {
      if(!y[x]) return 0; else return y[x].allocation;
    }).reduce(function(a,b) { return a+b; },0);
    return o;
  };


  $scope.classes = function() {
    var dm = new DataManager($scope.strategies, $scope.accounts, $scope.securities);
    return dm.classes();
  };

  // aggregate across classes
  $scope.aggSt = {};
  $scope.aggAc = {};
  $scope.setAggregates = function(sts,fld) {
    var dm = new DataManager($scope.strategies, $scope.accounts, $scope.securities);
    return dm.aggregateStrategies(sts,fld);
  };
  $scope.setAggregates1 = function() {
        $scope.aggSt = $scope.setAggregates($scope.strategies);
        $scope.aggAc = $scope.setAggregates($scope.accounts,"id");
  };

  $scope.$on("loaded", function() {
    $scope.setAggregates1();
    $scope.$broadcast("loaded2");
  });

  $scope.$on("edited",function() {
    $scope.setAggregates1();
    $scope.$broadcast("edited2");
  });

  $scope.$on("savedOnServer",function() {
    $scope.$broadcast("savedOnServer2");
  });

  $scope.pricesLength = function() {
     var tot=0;
     for(pr in $scope.prices) {
       if($scope.prices[pr].hasOwnProperty("history")) {
         tot += Object.keys($scope.prices[pr].history).length;
       }
     }
     return tot;
  };
  $scope.tradesLength = function() { return Object.keys($scope.trades).length; };
  $scope.securitiesLength = function() { return Object.keys($scope.securities).length; };
  $scope.accountsLength = function() { return Object.keys($scope.accounts).length; };
  $scope.strategiesLength = function() { return Object.keys($scope.strategies).length; };
  $scope.partialRedemptionsLength = function() { return Object.keys($scope.partialRedemptions).length; };

  $scope.emitEdited = function() { $scope.$emit("edited"); };

  $scope.priceDateLatestById = function(id) {
          if(!$scope.prices.hasOwnProperty(id)) return "0000-00-00";
          if($scope.prices[id].history.length==0) return "0000-00-00";
          var o = angular.fromJson(angular.toJson(Object.keys($scope.prices[id].history)));
          o.sort();
          o.reverse();
          return o[0];
  };

  $scope.priceByIdDate = function(id,pxDate) {
    var px = 9999999; // proxy for infinity
    if($scope.prices.hasOwnProperty(id))
      if($scope.prices[id].hasOwnProperty("history")) {
        if(Object.keys($scope.prices[id].history).length>0) {
          if(pxDate=="latest") {
            maxDate = $scope.priceDateLatestById(id);
            px = $scope.prices[id].history[maxDate].px;
          } else {
            if($scope.prices[id].history.hasOwnProperty(pxDate))
              px = $scope.prices[id].history[pxDate].px;
          }
        }
      }
    return px;
  };

  $scope.obj2arr = function(input) {
    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }
    return array;
  };

  //-------------------------------
  // StrategiesPerformance functions moved here
  $scope.calcSI = function(s) {
    // s: strategy
    // var s = $scope.strategies[$scope.selected];
    if(!s) return; // still booting
    if(!s.performance) return;

    return ($scope.obj2arr(s.performance).reduce(function(a,b) { return a*(1+b/100); }, 1)-1)*100;
  };

  $scope.calcAnn = function(s) {
    // var s = $scope.strategies[$scope.selected];
    if(!s) return; // still booting
    if(!s.performance) return 0;
    if(Object.keys(s.performance).length==0) return 0;
    res = $scope.calcSI(s)/100+1;
    res = Math.pow(res,1/Object.keys(s.performance).length)-1;
    return res*100;
  };

  $scope.performanceTimestamps = function(base) {
    if(!base) base=$scope.strategies;
    var ts=[];
    for(s in base) {
      for(t in base[s].performance) {
        ts.push(t);
      }
    }
    ts = Array_unique(ts);
    return ts.sort();
  };

  $scope.prevEOY = function(date) {
    // http://stackoverflow.com/a/13572682/4126114
    if(date && !(date instanceof Date)) if(!$scope.dateIsValid(date)) return; // invalid date

    date = !date ? new Date() : ( date instanceof Date ? date : new Date(date) );
    var firstDay = new Date(date.getFullYear(), 0, 1);
    return firstDay.toISOString().substr(0,10); //self.addDays(firstDay,-1);
  };

  $scope.prevEOM = function(date) {
    // http://stackoverflow.com/a/13572682/4126114
    if(date && !(date instanceof Date)) {
      if(!$scope.dateIsValid(date)) {
        return; // invalid date
      }
    }

    date = !date ? new Date() : ( date instanceof Date ? date : new Date(date) );
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.toISOString().substr(0,10); //self.addDays(firstDay,-1);
  };

  $scope.dateIsValid = function(date) {
    if(!date) return false;
    var re = /^\d{4}-\d{2}-\d{2}$/;
    if(date) if(!re.test(date)) return false; // invalid date
    var x = new Date(date);
    if(isNaN(x)) return false;
    return true;
  };

  var vdre = /^\d{4}-\d{2}-\d{2}$/;
  $scope.validDate = function(d) {
    if(!d) return false;
    var o1 = vdre.test(d);
    var o2 = d >= "1990-01-01";
    var o3 = isNaN(Date.parse(d));
    return(o1&&o2&&!o3);
  };

  $scope.perfVector = function(ac) {
      if(!ac) return {performance:[]};
      if(!ac.performance) return {performance: [$scope.perfAtDate(ac.currentDate,ac)]};
      var o = Object.keys(ac.performance).sort().map(function(x) { return $scope.perfAtDate(x,ac); });
      o.push($scope.perfAtDate(ac.currentDate,ac));
      o = {performance: o};
      return o;
  };

  $scope.perfAtDate = function(d,nac) {
      if(!nac) return "-";
      if(d==nac.inception) return "-";
      if($scope.newAccountPerfLength(nac)==0) return (nac.currentAmount/nac.initialInvestment-1)*100;
      var dates = Object.keys(nac.performance).sort();
      var i = dates.indexOf(d);
      if(i==-1) {
        if(d==nac.currentDate) {
          if(!!nac.currentAmount) {
            return (nac.currentAmount/(Number(nac.performance[dates[dates.length-1]].nav)+Number(nac.performance[dates[dates.length-1]].io))-1)*100;
          } else {
            return "-";
          }
        } else {
          return "-";
        }
      }
      if(i==0) return (nac.performance[d].nav/nac.initialInvestment-1)*100;
      return (nac.performance[d].nav/(Number(nac.performance[dates[i-1]].nav)+Number(nac.performance[dates[i-1]].io))-1)*100;
  };

  $scope.newAccountPerfLength = function(ac) {
      if(!ac) return 0;
      if(!ac.performance) return 0;
      return Object.keys(ac.performance).length;
  };

}
