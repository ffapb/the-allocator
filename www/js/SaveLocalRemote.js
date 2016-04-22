function SaveLocalRemote($scope,$http) {

  $scope.editingMode = false;
  $scope.updateEditingMode = function() {
    $scope.$parent.editingMode = $scope.editingMode;
  };

  this.data2json = function() {
    var o1 = {
      "strategies": $scope.$parent.strategies,
      "accounts": $scope.$parent.accounts,
      "securities": $scope.$parent.securities,
      "prices": $scope.$parent.prices,
      "partialRedemptions": $scope.$parent.partialRedemptions //,
      //"config": $scope.$parent.config
  // don't save this //            "versioning": $scope.$parent.versioning
    };

    // 2015-10-11: I WAS PROFILING MY JAVASCRIPT CODE, AND I FOUND THAT THE EXTEND WAS TAKING THE MOST TIME
    // RE-TESTING THE NEED FOR THE EXTEND BELOW SHOWED THAT IT WAS NO LONGER NECESSARY.
    // I'M NOT SURE HOW THIS GOT FIXED ALL ALONE, BUT WHATEVER.
    // I'M COMMENTING IT OUT NOW

    // 2015-10-01?: Deep copy in javascript
    // http://stackoverflow.com/a/122704
//    var o2 = jQuery.extend(true, {}, o1);
/*
    // preprocess
    // For some reason, the "strategies.allocations" array is not being converted to json with angular.toJson of angular 1.4.3
    // Just deep copying it alone before stringifying the object
    for(s in o2.strategies) {
      // Deep copy in javascript
      // http://stackoverflow.com/a/122704
      o2.strategies[s].allocations = jQuery.extend(true, {}, o2.strategies[s].allocations);
    }
*/

    o2 = o1;

    //
    o2 = angular.toJson(o2);

/*    
    // Testing for deep copy above
    console.log(
      "data2json",
      $scope.$parent.strategies["Balanced"].allocations["BGF GHY"],
      angular.fromJson(angular.toJson($scope.$parent.strategies["Balanced"].allocations["BGF GHY"])),
      angular.fromJson(angular.toJson({"bla":$scope.$parent.strategies["Balanced"].allocations})).bla["BGF GHY"],
      angular.fromJson(o2).strategies["Balanced"].allocations["BGF GHY"]
    );
*/
    return o2;
  };


  var self = this;
  $scope.saveLocal = function() {
    window.localStorage.setItem("d2j",self.data2json());
    $scope.takeSnapshot();
    window.localStorage.setItem("d2v",angular.toJson($scope.$parent.versioning));
  };
  $scope.sosStatus = "None";
  $scope.saveOnServer = function() {
    if(!$scope.$parent.config.api.RemoteSave) {
      console.error("Server saving is not configured");
      return;
    }

    console.log("Save on server",self.unComplementData());
    $scope.sosStatus = "Uploading";
    $http({
      url: $scope.$parent.config.api.RemoteSave,
      method: "POST",
      data: {
        data: angular.toJson(self.unComplementData()), //  self.data2json(),
        dataVersion: $scope.$parent.versioning.dataVersion // the version of the parent node in the tree of data (think in terms of repository)
      }
    }).success(function(data,status,headers,config) {
      if(!!data.error) {
        $scope.sosStatus="Error uploading";
        alert(data.error);
        return;
      }
      console.log("Saved to server",data);
      $scope.$parent.versioning.dataVersion = data.dataVersion;
      $scope.$parent.versioning.dataDate = data.dataDate;
      $scope.$emit("savedOnServer");
      $scope.takeSnapshot(true);
      window.localStorage.setItem("d2v",angular.toJson($scope.$parent.versioning));
      $scope.sosStatus = "None";
    }).error(function(data,status,headers,config) {
      console.log("Error saving to server",data,status,headers,config);
      $scope.sosStatus="Error uploading";
    });
  };

  $scope.reset = function() {
    $scope.$parent.strategies = {};
    $scope.$parent.accounts = {};
    $scope.$parent.securities = {};
    $scope.$parent.prices = {};
    $scope.$parent.trades = [];
    $scope.$parent.partialRedemptions = {};
    //$scope.$parent.config = $scope.$parent.configInit;
    $scope.$parent.versioning = {};
  };

  $scope.clearLocal = function() {
    window.localStorage.clear();
    $scope.reset();
    $scope.takeSnapshot();
  };

  this.getLocal = function() {
    var d2j = window.localStorage.getItem("d2j");
    if(d2j!=null) {
      d2j = angular.fromJson(d2j);
      $scope.$parent.strategies = d2j.strategies;
      $scope.$parent.accounts = d2j.accounts;
      $scope.$parent.securities = d2j.securities;
      $scope.$parent.prices = d2j.prices;
      if(d2j.partialRedemptions) $scope.$parent.partialRedemptions = d2j.partialRedemptions;
      //$scope.$parent.config = d2j.config;
      self.complementData();
    }

    var d2v = window.localStorage.getItem("d2v");
    if(d2v!=null) {
      $scope.$parent.versioning = angular.fromJson(d2v);
    }
  };
  $scope.getRemote = function() {
    if(!$scope.$parent.config.api.RemoteDownload) {
      console.error("Server Download is not configured");
      return;
    }
    $scope.sosStatus="Loading";
    $http.get($scope.$parent.config.api.RemoteDownload,{params:{asEads:true}}).
      success(function(data,status,headers,config) {
        console.log("Loaded from server",data);
        $scope.reset();
        $scope.$parent.strategies = data.strategies;
        $scope.$parent.accounts = data.accounts;
        $scope.$parent.securities = data.securities;
        $scope.$parent.prices = data.prices;
        $scope.$parent.partialRedemptions = data.partialRedemptions;
        //$scope.$parent.config = data.config;

        // complementing the data is necessary since the server data is uncomplemented when uploaded
        self.complementData();

        // if data from server is same as local copy, but version number is different, automatically save the new version number
        // I'm not sure why this is happening, but whatever
        console.log(!$scope.edited(), data.versioning.dataVersion, $scope.$parent.versioning.dataVersion);
        willAutosave = !$scope.edited() && data.versioning.dataVersion!=$scope.$parent.versioning.dataVersion;
        $scope.$parent.versioning = data.versioning;
        if(willAutosave) {
          console.log("Autosaving");
          window.localStorage.setItem("d2v",angular.toJson($scope.$parent.versioning));
        }

        $scope.takeSnapshot(true);

        // conclude
        $scope.sosStatus="None";
      }).error(function(data,status,headers,config) {
        console.log("Error loading from server");
        $scope.sosStatus="Error downloading";
      });
  };

  $scope.dataSnapshot={local:"",remote:""};

  $scope.editedFlag = -1; // -1: unknown, 0: false, 1: true
  $scope.edited = function(remote) {
    if(self.editedFlag != -1) return self.editedFlag;

    var dataCurrent = self.data2json();
    if(!remote) {
      var o = dataCurrent != $scope.dataSnapshot.local;
      return o;
    } else {
      var o = dataCurrent != $scope.dataSnapshot.remote;
      $scope.$parent.dataEdited = o;
      return o;
    }
  };

  $scope.takeSnapshot = function(remote) {
    if(!!remote) {
      $scope.dataSnapshot.remote = self.data2json();
    } else {
      $scope.dataSnapshot.local = self.data2json();
    }
  };

  $scope.emptyAllocationAccount = function(id) {
    return {
      "id": id,
      "avgCost": 0,
      "numShares": 0,
      "totalCost": 0,
      "totalPaid": 0
    };
  };

  $scope.emptyAllocationStrategy = function(id) {
    return {
      "id": id,
      "allocation": 0
    };
  };

  this.complementData = function() {
    self.editedFlag = -1;
    self.complementDataCore();

    // conclusive calls
    setTimeout(
      function() {
        $( "#tabset1" ).tabs("refresh");
        for(var i in $scope.$parent.accounts) {
          $( "#tabset2-"+i ).tabs();
        }
      }, 100);
    $scope.$emit("loaded");

  };

  this.complementDataCore = function() {
    // It is important that this stay a reference to the original associative arrays
    // so that the app works properly (and not angular.fromJson(angular.toJson(data)) and then setting)
    din = $scope.$parent;

    // prepare to complement data below
    ids = Object.keys($scope.$parent.securities); //.map(function(x) { return x.id; });
  
    // use the manual class instead of the original class field in the security
     ids.forEach(function(id) {
      var sec = $scope.$parent.securities[id];
      sec.class = !!sec.classManual?sec.classManual:sec.classOriginal;
    });

    // delete strategy allocations in security IDs that are not in securities for some reason
    for(aci in $scope.$parent.strategies) {
      ac = $scope.$parent.strategies[aci].allocations;
      for(i in ac) {
        if(!ac[i]) {
          delete ac[i];
        } else {
          if(ids.indexOf(ac[i].id)==-1) delete ac[i];
        }
      }
    }

    // complement strategy data with zeros for zero positions and with security metadata
    for(aci in $scope.$parent.strategies) {
      if(!$scope.$parent.strategies[aci].allocations) $scope.$parent.strategies[aci].allocations = {};
      ac = $scope.$parent.strategies[aci].allocations;
      ids.forEach(function(id) {
        if(!ac.hasOwnProperty(id)||!ac[id]) {
          ac[id] = $scope.emptyAllocationStrategy(id);
        }
        ac[id].class = $scope.$parent.securities[id].class;
        ac[id].name = $scope.$parent.securities[id].name;
      });
    }

    // complement client data with zeros for zero positions
    for(aci in $scope.$parent.accounts) {
      $scope.$parent.accounts[aci].total = { "nav": 0, "cost": 0, "paid": 0, "weightedPerf": 0, "fundsUsd": 0};
      ac = $scope.$parent.accounts[aci].allocations;
      // part 1
      ids.forEach(function(id) {
        if(!ac.hasOwnProperty(id) || !ac[id]) {
          ac[id] = $scope.emptyAllocationAccount(id);
        }
        var pxDate = $scope.$parent.securities[id].pxDate;
        var px = $scope.$parent.priceByIdDate(id,pxDate);
        
        $scope.$parent.accounts[aci].total.fundsUsd += px * ac[id].numShares * (!!ac[id].rate2usd ? ac[id].rate2usd : 1);
      });

      $scope.$parent.accounts[aci].currentAmount = $scope.$parent.accounts[aci].total.fundsUsd + $scope.$parent.accounts[aci].cash;
      $scope.$parent.accounts[aci].ytd = ($scope.$parent.accounts[aci].currentAmount / $scope.$parent.accounts[aci].navYearStart - 1)* 100;
      $scope.$parent.accounts[aci].mtd = ($scope.$parent.accounts[aci].currentAmount / $scope.$parent.accounts[aci].navMonthStart - 1)* 100;
      $scope.$parent.accounts[aci].returnSI = $scope.$parent.calcSI($scope.$parent.perfVector($scope.$parent.accounts[aci]));
      $scope.$parent.accounts[aci].returnAnn = $scope.$parent.calcAnn($scope.$parent.perfVector($scope.$parent.accounts[aci]));

      // part 2
      ids.forEach(function(id) {
        var pxDate = $scope.$parent.securities[id].pxDate;
        var px = $scope.$parent.priceByIdDate(id,pxDate);
        ac[id].allocation = px * ac[id].numShares * (!!ac[id].rate2usd ? ac[id].rate2usd : 1) / $scope.$parent.accounts[aci].currentAmount * 100;
        ac[id].totalCost = ac[id].avgCost * ac[id].numShares; // in security's currency
        ac[id].totalPaid = ac[id].totalCost + (!!ac[id].feesPosition?ac[id].feesPosition:0); // in security's currency
        var stname = $scope.$parent.accounts[aci].strategy;
        ac[id].targetAllocUsd = $scope.$parent.strategies[stname].allocations[id].allocation * $scope.$parent.accounts[aci].currentAmount / 100; // in USD
        ac[id].targetShares = ac[id].targetAllocUsd / px / (!!ac[id].rate2usd ? ac[id].rate2usd : 1); // in shares
        ac[id].pendingShares = ac[id].targetShares - ac[id].numShares;
        ac[id].nav = px * ac[id].numShares; // in security currency
        ac[id].performance = ac[id].totalCost==0?0:(ac[id].nav/ac[id].totalCost - 1)*100;
        ac[id].weightedPerf = ac[id].performance/100 * ac[id].allocation/100 * 100;

        $scope.$parent.accounts[aci].total.nav += ac[id].nav * (!!ac[id].rate2usd ? ac[id].rate2usd : 1); // in usd
        $scope.$parent.accounts[aci].total.cost += ac[id].totalCost * (!!ac[id].rate2usd ? ac[id].rate2usd : 1); // in usd
        $scope.$parent.accounts[aci].total.paid += ac[id].totalPaid * (!!ac[id].rate2usd ? ac[id].rate2usd : 1); // in USD
        // unused // $scope.$parent.accounts[aci].total.weightedPerf += ac[id].weightedPerf;
      });

      // unused // $scope.$parent.accounts[aci].total.performance = ($scope.$parent.accounts[aci].total.paid / $scope.$parent.accounts[aci].total.nav -1) * 100;
      // unused // $scope.$parent.accounts[aci].total.perfNetFees = ($scope.$parent.accounts[aci].total.nav / $scope.$parent.accounts[aci].total.paid - 1)*100;
      
      // if fromEADS and no eadsSource, set to Lebanon
      if($scope.$parent.accounts[aci].fromEADS && !$scope.$parent.accounts[aci].eadsSource) $scope.$parent.accounts[aci].eadsSource="Lebanon";
    }
  };

  this.unComplementData = function(uncomp) {
  // Example uncomp: angular.fromJson(this.data2json());
    if(!uncomp) uncomp = angular.fromJson(self.data2json());

    // uncomplement strategy data with zeros for zero positions
    for(aci in uncomp.strategies) {
      ac = uncomp.strategies[aci].allocations;
      for(var id in ac) {
        if(!ac[id]) {
          delete ac[id];
        } else {
          if(ac[id].allocation==0) {
            delete ac[id];
          } else {
            delete ac[id].class;
            delete ac[id].name;
          }
        }
      }
      if(ac instanceof Array) {
        if(ac.every(function(x) { return x==null; })) delete uncomp.strategies[aci].allocations;
      }
    }

    // uncomplement security data from class (selected from classOriginal and classManual)
    for(aci in uncomp.securities) {
      delete uncomp.securities[aci].class;
    }
 
    // complement client data with zeros for zero positions
    for(aci in uncomp.accounts) {
      delete uncomp.accounts[aci].total;
      ac = uncomp.accounts[aci].allocations;
      // part 1
      for(var id in ac) {
          if(!ac[id]) {
            delete ac[id];
          } else if(ac[id].avgCost==0 && ac[id].numShares==0) {
            delete ac[id];
          }
      }

      delete uncomp.accounts[aci].currentAmount;
      delete uncomp.accounts[aci].ytd;
      delete uncomp.accounts[aci].mtd;
      delete uncomp.accounts[aci].returnSI;
      delete uncomp.accounts[aci].returnAnn;

      // part 2
      for(var id in ac) {
        delete ac[id].allocation;
        delete ac[id].totalCost;
        delete ac[id].totalPaid;
        delete ac[id].targetAllocUsd;
        delete ac[id].targetShares;
        delete ac[id].pendingShares;
        delete ac[id].nav;
        delete ac[id].performance;
        delete ac[id].weightedPerf;
      }

    }

    return uncomp;
  };

 
  $scope.$on("edited2",function() {
          self.complementData();
  });

  angular.element(document).ready(function () {
    // get saved data
    $scope.$apply(function() {
      self.getLocal()
      $scope.takeSnapshot();

      // doing this is wrong.. instead, I should download the data from the server and compare, it's in todo set 7
      $scope.takeSnapshot(true);
    });
  });

  $scope.loadDemo = function(n) {
    $scope.reset();
    self.loadDemoCore(n);
    self.complementData();
  };

  this.loadDemoCore = function(n) {
    var d = {};
    switch(n) {
      case 1: d = loadDemo1(); break;
      case 2: d = loadDemo2(); break;
      case 3: d = loadDemo3(); break;
      default: console.log("Invalid demo number");
    }
    $scope.$parent.strategies = d.strategies;
    $scope.$parent.accounts = d.accounts;
    $scope.$parent.securities = d.securities;
    $scope.$parent.prices = d.prices;
  }

}
