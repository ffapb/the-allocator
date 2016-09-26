function Main($scope) {

  $scope.strategies = {};
  $scope.accounts = {};
  $scope.securities = {};
  $scope.prices = {};
  $scope.trades = [];
  $scope.configSource="/the-allocator-config.json";
  $scope.configInit = {
    riskThreshold: 0,
    title1: "The Allocator",
    title2: "by Shadi Akiki",
    api: {
      ServerVersion: "",
      EADS: "",
      EPDS: "",
      excel: "",
      EadsName: "",
      EpdsName: "",
      RemoteDownload: "",
      RemoteSave: ""
    }
  };
  $scope.config = angular.fromJson(angular.toJson($scope.configInit));

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
    $scope.calculatePricesSortedByDate();
    $scope.$broadcast("loaded2");
  });

  $scope.$on("edited",function() {
    $scope.setAggregates1();
    $scope.calculatePricesSortedByDate();
    $scope.$broadcast("edited2");
  });

  $scope.$on("savedOnServer",function() { $scope.$broadcast("savedOnServer2"); });
  $scope.$on("loadedBackend",function() { $scope.$broadcast("loadedBackend2"); });

  $scope.pricesLength = function() {
     var tot=0;
     for(pr in $scope.prices) {
       if($scope.prices[pr].hasOwnProperty("history")) {
         tot += Object.keys($scope.prices[pr].history).length;
       }
     }
     return tot;
  };

  $scope.pricesSortField = 'ID';
  $scope.psfOptions = ['ID','Name','Price date'];
  $scope.psfArr = [];
  $scope.calculatePricesSortedByDate = function() {
    $scope.psfArr = [];
    for(pr1a in $scope.prices) {
      pr1 = $scope.prices[pr1a];
      for(pr2a in pr1.history) {
        pr2 = pr1.history[pr2a];
        $scope.psfArr.push({
          id:pr1.id,
          name: $scope.securities[pr1.id].name,
          isin: $scope.securities[pr1.id].isin,
          pxDate: pr2.pxDate,
          source: pr2.source,
          px: pr2.px,
          currency: pr2.currency
        });
      }
    }
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
  $scope.perfDtRange = function(strat,type) {
    // strat = strategies[selected]
    var defOut = {"min":"0000-00-00","max":"9999-99-99", "d0":"N/A", "d1": "N/A"};

    if(!strat) return defOut;
    if(!strat.performance) return defOut;
    var dates=Object.keys(strat.performance);
    if(type=="end" && dates.length<2) return defOut;

    //dates=dates.filter(function(x) { return !!Number(x); });
    dates.sort();
    var d0 = dates[0];
    var d1 = d0;
    if(type=="end") {
      d0=dates[dates.length-1];
      d1=dates[dates.length-2];
      d1=Number(d1)+1+"";
    }
    return {"min":d1+"-01-01","max":d1+"-12-31","d0":d0,"d1":d1};
  };

  $scope.calcSI = function(s) {
    // s: strategy
    // var s = $scope.strategies[$scope.selected];
    if(!s) return; // still booting
    if(!s.performance) return;
    
    var o = $scope.obj2arr(s.performance).reduce(function(a,b) { return a*(1+b/100); }, 1);
    
    // correct for perfStart
    o=o/$scope.calcCorrector(s,"start",s.perfStart);
    // correct for perfEnd
    o=o/$scope.calcCorrector(s,"end",s.perfEnd);
    // final
    o=100*(o-1);
    return o;
  };

  $scope.calcCorrector=function(s,type,perfDt) {
    // correct for perfStart or perfEnd
    // type: "start"
    var psr = $scope.perfDtRange(s,type);
    if(!!perfDt && $scope.dateIsValid(perfDt) && perfDt>=psr.min && perfDt<=psr.max) {
      var comp = type=="start"?psr.min:psr.max;
      var ndays = moment(perfDt).diff(moment(comp),"days");
      ndays = Math.abs(ndays);
      var o =Math.pow((100+s.performance[psr.d0])/100,ndays/365);
      return o;
    }
    return 1;
  };

  $scope.calcAnn = function(s) {
    // var s = $scope.strategies[$scope.selected];
    if(!s) return; // still booting
    if(!s.performance) return 0;
    if(Object.keys(s.performance).length==0) return 0;
    res = $scope.calcSI(s)/100+1;
    res = Math.pow(res,1/Object.keys(s.performance).length);
    res=100*(res-1);
    return res;
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

  $scope.getEadsName = function() {
    if(!$scope.config.api.EadsName) return "EADS";
    return $scope.config.api.EadsName;
  };

  $scope.getEpdsName = function() {
    if(!$scope.config.api.EpdsName) return "EPDS";
    return $scope.config.api.EpdsName;
  };

  $scope.getEads=function() {
    if(!$scope.config.api.EADS) {
      console.log("EADS not configured");
      return false;
    }
    console.log("EADS now configured");
    return $scope.config.api.EADS;
  };

}
