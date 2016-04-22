function PricesBatch($scope,$http) {

  $scope.delOldPrices = function(reverse) {
          // reverse: pass true if delete new prices, pass false if delete old prices
    for(pr in $scope.$parent.prices) {
      if(Object.keys($scope.$parent.prices[pr].history).length>1) {
        var hh2 = Object.keys($scope.$parent.prices[pr].history).sort();
        if(!reverse) hh2 = hh2.reverse();
        hh2 = hh2[0];
        for(hh0 in $scope.$parent.prices[pr].history) {
          if(hh0!=hh2) {
            delete $scope.$parent.prices[pr].history[hh0];
          }
        }
      }
    }
  };

  $scope.existsOldPrices = function() {
    for(pr in $scope.$parent.prices) {
      if(Object.keys($scope.$parent.prices[pr].history).length>1) return true;
    }
    return false;
  };

  $scope.fbSt = "None";
  $scope.epdsFetchDate="";
  $scope.fetchEpds = function(latest,secId) {
        if(!latest && !$scope.$parent.validDate($scope.epdsFetchDate)) {
          $scope.fbSt="Invalid";
          $("#epdsFetchDateDiv").addClass("has-error");
          return;
        }
        if(!secId) secId = Object.keys($scope.$parent.securities).map(function(x) { return $scope.$parent.securities[x].isin; }).filter(function(x) { return !!x; });
        
        $scope.fbSt=!!latest?"Getting latest":"Getting";

        $scope.fetchEpdsCore(
          latest,
          secId,
          function(response) {
            if(response.data.length==0) {
              $scope.fbSt="No data";
              return;
            }
            var anyIsins = false;

            for(rd in response.data) {
              // search for security with this isin .. I realize that building a reverse hash earlier (in secId line above) is more efficient, but I'm just lazy
              var y = Object.keys($scope.$parent.securities).filter(function(x) { return $scope.$parent.securities[x].isin==rd; });
              anyIsins = anyIsins || y.length>0;
              if(y.length>0) {
                // if first entry for a security
                if(!$scope.$parent.prices[y[0]]) {
                  // similar to instantiation in EADSController
                  $scope.$parent.prices[y[0]] = {
                    id: y[0],
                    history: {}
                  };
                }

                $scope.$parent.prices[y[0]].history[response.data[rd].pxDate]={ // $scope.epdsFetchDate]={
                  pxDate: response.data[rd].pxDate, // $scope.epdsFetchDate,
                  px: response.data[rd].px,
                  currency: response.data[rd].currency,
                  source: $scope.$parent.getEpdsName()
                };
              }
            }

            if(!anyIsins) {
              $scope.fbSt = "No matches";
              return;
            }

            $scope.fbSt="None";
          },
          function(errResponse) {
            console.log("fetchEpds failed");
            $scope.fbSt="Error";
          }
      );
  };


  $scope.fetchEpdsCore = function(latest,secId,succFn,errFn) {
        if(!$scope.$parent.config.api.EPDS) {
          errFn("EPDS not configured");
          return;
        }

        $http({
          url: $scope.$parent.config.api.EPDS,
          method: "POST",
          data: {
            id: angular.toJson(secId),
            date: !!latest?"latest":$scope.epdsFetchDate
          }
        }).then(function(response) {
            succFn(response);
          }, function(errResponse) {
            errFn(errResponse);
          }
        );
  };

  $scope.testIsin = {};
  $scope.testIsinFn = function(isin) {
    $scope.testIsin.status = 1;
    $scope.testIsin.result = "";
    $scope.fetchEpdsCore(
      true,
      isin,
      function(res) {
        if(res.data.length==0) {
          $scope.testIsin.status=0;
          $scope.testIsin.result = "Invalid ISIN";
          return;
        }

        var o = $scope.$parent.obj2arr(res.data)[0];
        $scope.testIsin.result = o.px + " " + o.currency + " (" + o.pxDate + ")";
        $scope.testIsin.status=0;
      },
      function(err) {
        $scope.testIsin.status=0;
        $scope.testIsin.result = "Error testing ISIN";
      }
    );
  };

  $scope.epdsAvailable = false;
  $scope.pingEpdsStatus = 0;
  $scope.pingEpdsFn = function() {
        if(!$scope.$parent.config.api.EPDS) {
          console.log("EPDS not configured");
          return;
        }

        $scope.pingEpdsStatus = 1;
        $http({
          url: $scope.$parent.config.api.EPDS,
          method: "POST",
          data: {
            id: '["FIDLHKI LX EQUITY"]',
            date: "2015-08-24"
          }
        }).then(function(response) {
            if(Object.keys(response.data).length==0) {
              $scope.epdsAvailable = false;
            } else {
              if(response.data[Object.keys(response.data)[0]].px==150) {
                $scope.epdsAvailable = true;
              } else {
                $scope.epdsAvailable = false;
              }
            }
            $scope.pingEpdsStatus = 0;
          }, function(errResponse) {
            $scope.pingEpdsStatus = 0;
            $scope.epdsAvailable=false;
          }
        );
  };

  $scope.$on("loadedBackend2",function() { $scope.pingEpdsFn(); });

  angular.element(document).ready(function () {
    $scope.pingEpdsFn();
  });

}
