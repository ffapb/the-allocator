function EADSController($scope,$http,$q,$timeout) {

  $scope.possiblesV = [];
  $scope.pvSource = {};
  this.canceler = $q.defer();
  $scope.$parent.inprogress=0;// 0 for not in progress, 1 for in progress, 2 for cancelled, 3 for delayed 2

  var self = this;

  $scope.httpError = function() {
    var id = $scope.$parent.newAccount.id;
    for(i in $scope.$parent.newAccount) if(["id","fromEADS","initialInvestment","strategy"].indexOf(i)!=-1) $scope.$parent.newAccount[i] = "";
  };

  $scope.typingTimeout = null;

  $scope.newAccountIdExists = function() {
    return Object.keys($scope.$parent.accounts).indexOf($scope.newAccount.id)!=-1;
  };

  // This was falsely used in the EADSController dialog open event
  // which was later cancelled, so commenting it out
  // $scope.possibles2 = function() {
  //   $timeout(function() { $scope.possibles(); });
  //};

  $scope.allSameExceptFromEads = function(a,b) {
    var o = (a.initialInvestment == b.initialInvestment &&
      a.strategy == b.strategy &&
      //a.allocations === b.allocations && // this comparison would take more details // skipping
      a.name == b.name &&
      a.inception == b.inception &&
      a.rm == b.rm &&
      a.broker == b.broker &&
      a.navMonthStart == b.navMonthStart &&
      a.navYearStart == b.navYearStart &&
      a.cash == b.cash);
    return o;
  };

  $scope.getExisting = function() {
    if($scope.newAccountIdExists()) {
      // copy the existing data
      var ac = $scope.$parent.accounts[$scope.newAccount.id];
      if($scope.allSameExceptFromEads(ac,$scope.$parent.newAccount)) {
        return false; // if the data is all the same, then this is the case where the user has already entered an existing ID, discovered that it was existing, and insists to change to "fromEADS"
      }
      $scope.$parent.newAccount.initialInvestment = ac.initialInvestment;
      $scope.$parent.newAccount.strategy = ac.strategy;
      $scope.$parent.newAccount.fromEADS = ac.fromEADS;
      $scope.$parent.newAccount.allocations = angular.fromJson(angular.toJson(ac.allocations));

      // if no longer getting from EADS
      if(!ac.fromEADS) {
        $scope.$parent.newAccount.name = ac.name;
        $scope.$parent.newAccount.inception = ac.inception;
        $scope.$parent.newAccount.rm = ac.rm;
        $scope.$parent.newAccount.broker = ac.broker;
        $scope.$parent.newAccount.navMonthStart = ac.navMonthStart;
        $scope.$parent.newAccount.navYearStart = ac.navYearStart;
        $scope.$parent.newAccount.cash = ac.cash;
      }
      $scope.complementAllocations($scope.$parent.newAccount);
      return true;
    } else {
      // Commenting out below because what if user enters a new ID
      //$scope.$parent.newAccount.initialInvestment = 0;
      //$scope.$parent.newAccount.strategy = "";
      return false;
    }
  };

  $scope.http_get = function(x,y) {
    if(!$scope.$parent.eadsAvail) {
        console.log("EADS unavailable to begin with");
        return {then:function(succFn,errFn) { return errFn(); }}; // call error function
    }
    return $http.get(x,y);
  };

  $scope.possibles = function() {
  // This function lists possible account numbers based on the prefix entered.
  // It's kind of like google search engine's suggestions.
  // It only shows suggestions if the user stops typing for 500ms

    // no account completion if not from eads
    if(!$scope.newAccount.fromEADS) return;

    // user didn't start typing anything yet
    // or user still has entered 1 character only
    if(!$scope.newAccount.id || $scope.newAccount.id.length<2) return; 

    // if user is typing at a speed of less than 1 character per 500 ms
    var willClearTypingTimeout = !!$scope.typingTimeout;
    if(willClearTypingTimeout) {
      $timeout.cancel($scope.typingTimeout);
    }

    $scope.typingTimeout = $timeout(function() {
        $scope.typingTimeout=null;
        $scope.possiblesCore(); // possiblesCore and not possibles
      }, 500);
  };

  $scope.possiblesCoreStatus = 0;
  $scope.resetPossiblesCoreStatus = function() {
    $scope.possiblesCoreStatus = 0;
    $scope.possiblesV = [];
    $scope.pvSource = {};
  };
  $scope.possiblesCore = function() {
        //http://stackoverflow.com/a/17328336/4126114

        if(!$scope.$parent.eadsAvail) { $scope.resetPossiblesCoreStatus(); return false; }
        if(!$scope.$parent.newAccount.fromEADS) { $scope.resetPossiblesCoreStatus(); return false; }

        var acid = $scope.newAccount.id;
        if(acid==undefined) { $scope.resetPossiblesCoreStatus(); return false; }
        if(acid=="") { $scope.resetPossiblesCoreStatus(); return false; }

        // Abort previous http request if not yet finished
        if($scope.possiblesCoreStatus==1) {
          self.canceler.resolve();  // Aborts the $http request if it isn't finished.
          self.canceler = $q.defer(); // renew
        }
    
        $scope.possiblesCoreStatus=1;
    
        var base = $scope.$parent.getEads()+"?type=accounts&prefix=";
        $scope.http_get(
            base+$scope.newAccount.id+"&base=Lebanon",
            {timeout: self.canceler.promise}
          ).
          then(function(response) {
            $scope.possiblesV = response.data; // $scope.$parent.obj2arr();
            for(pv in $scope.possiblesV) {
                    var pv2 = $scope.possiblesV[pv];
                    $scope.pvSource[pv2] = "Lebanon";
            }

            $scope.http_get(
                base+$scope.newAccount.id+"&base=Dubai",
                {timeout: self.canceler.promise}
              ).
              then(function(response) {
                $scope.possiblesV2 = response.data; // $scope.$parent.obj2arr();
                for(pv in $scope.possiblesV2) {
                        var pv2 = $scope.possiblesV2[pv];
                        if($scope.pvSource.hasOwnProperty(pv)) {
                                $scope.pvSource[pv2] = "Lebanon + Dubai";
                        } else {
                                $scope.pvSource[pv2] = "Dubai";
                        }
                }
                $scope.possiblesV = $scope.possiblesV.concat($scope.possiblesV2);
    
                if($scope.possiblesV.length>1) {
                  $scope.possiblesCoreStatus=0;
                  return;
                }
    
                if($scope.possiblesV.length==0) {
                  $scope.possiblesCoreStatus=3;
                  return;
                }
    
                $("#newAccount_id2").blur();
                $scope.$parent.newAccount.id = $scope.possiblesV[0]; // uses the upper-case version
                $scope.getExisting(); // after upper-case is gotten, check if exists
    
                // check if after checking existing, from EADS is still set to true
                if($scope.$parent.newAccount.fromEADS) {
                  $scope.$parent.newAccount.eadsSource = $scope.pvSource[$scope.possiblesV[0]]=="Lebanon + Dubai"?"Lebanon":$scope.pvSource[$scope.possiblesV[0]];
                  $scope.getAccountDetails($scope.possiblesV[0],$scope.$parent.newAccount);
                }
                $scope.possiblesCoreStatus=0;
              }, function(errResponse) {
                $scope.resetPossiblesCoreStatus();
                $scope.possiblesCoreStatus=2;
              });

          }, function(errResponse) {
            $scope.resetPossiblesCoreStatus();
            $scope.possiblesCoreStatus=2;
          });
  };

  // http://stackoverflow.com/a/19691491/4126114
  this.addDays = function(date, days) {
              var result = new Date(date);
                  result.setDate(result.getDate() + days);
                      return result;
  }

  $scope.getAccountDetails = function(cid,target) {
      $scope.$parent.inprogress=1;
      var base = $scope.$parent.getEads()+"?type=accountsAndBrokersRms&cid=";
      var url = base+cid+(!!target.eadsSource?"&base="+target.eadsSource:"");
      $scope.http_get(url).
        then(function(response) {
          var rd = response.data;
          rd = rd[Object.keys(rd)[0]];
          target.name = rd.entity;
          target.inception = rd.CLI_OPEN_DATE.substr(0,10);
          target.rm = rd.rm;
          target.broker = rd.broker;

          $scope.getAccountNav(
            null,
            3,
            function() {
              $scope.getAccountNav(
                $scope.$parent.prevEOM(target.currentDate),
                1,
                function() {
                    $scope.getAccountNav(
                      $scope.$parent.prevEOY(target.currentDate),
                      2,
                      function() {
                          $scope.getPortfolio( function() {
                            $scope.getSecurityIsins( function() {
                                $scope.$emit("edited");
                                $scope.$parent.inprogress=0;
                              },
                              target
                            );
                          },
                          target
                        );
                      },
                      target
                    );
                },
                target
              );
            },
            target
          );
          
        }, function(err) {
          $scope.httpError();
          $scope.$parent.inprogress=3; // go directly to 3, not through 2
        });

  };

  $scope.getAccountNav = function(dd,whch,cbfn,target) {
      // dd: 2014-12-31, 2015-03-30 (if whch=3, this is unused)
      // whch: 1 for navMonthStart, 2 for navYearStart, 3 cash
      // cbfn: callback function with no parameters
      var base = $scope.$parent.getEads()+"?type=nav";
      var url = base+"&cid_="+target.id+"&format=json"+(!!target.eadsSource?"&base="+target.eadsSource:"");
      if(whch!=3) {
        url = url + "&dd="+dd;
      }
      $scope.http_get(url).
        then(function(response) {
          var rd = response.data;

          if(rd.length==0) {
            rd = {
              nav: "0",
              cash: "0"
            };
          } else {
            rd = rd[Object.keys(rd)[0]];
          }

          switch(whch) {
            case 1:
              var o=parseFloat(rd.nav.replace(",",""));
              target.navMonthStart = o;
              break;
            case 2:
              var o=parseFloat(rd.nav.replace(",",""));
              target.navYearStart = o;
              break;
            case 3:
              var o1= parseFloat(rd.cash.replace(",",""));
              target.cash = o1;
              target.currentDate = rd.date;
              break;
            default:
              console.log("Invalid");
          }

          if(!!cbfn) cbfn();

        }, function(err) {
          $scope.httpError();
          $scope.$parent.inprogress=3; // go directly to 3, not through 2
        });
  };

  $scope.getPortfolio = function(cbfn,target) {
      // cbfn: callback function with no parameters
      var base = $scope.$parent.getEads()+"?type=portfolios";
      var url = base+"&cid_="+target.id+"&format=json"+(!!target.eadsSource?"&base="+target.eadsSource:"");
      //url+="&dd=2015-08-03";
      $scope.http_get(url).
        then(function(response) {
          var rd = response.data;
          target.allocations = {};
          for(i in rd) {
            // manual override .. work in progress
            if(rd[i].OPE_TIT_COD=="UK IGLO") {
              rd[i].OPE_TIT_COD="US IGLO";
              rd[i].aid1="BOND FUNDS"; // similar to US IGLO
              // rd[i] = $scope.$parent.securities["US IGLO"]...
            }

            target.allocations[rd[i].OPE_TIT_COD] = {
              "id": rd[i].OPE_TIT_COD,
              "numShares": rd[i].qty,
              "avgCost": rd[i].avgCost,
              "nameEADS": rd[i].TIT_NOM,
              "classEADS": rd[i].aid1,
              "CRS_DAT": rd[i].CRS_DAT.replace(/\./g,"-"),
              "CRS_TIT": rd[i].CRS_TIT,
              "currency": rd[i].acur=="EURO"?"EUR":rd[i].acur,
              "rate2usd": rd[i].CRS_DEV_SYS
            };
          }

          $scope.complementAllocations(target);
      
          if(!!cbfn) cbfn();

        }, function(err) {
          $scope.httpError();
          $scope.$parent.inprogress=3; // go directly to 3, not through 2
        });
  };

  var trcRe = /^.*(equity|bond|corp)$/i;
  $scope.getSecurityIsins = function(cbfn,target) {
      // cbfn: callback function with no parameters

      // for empty portfolios
      if(Object.keys(target.allocations).length===0) {
        console.log("No securities");
        if(!!cbfn) cbfn();
      }

      var base = $scope.$parent.getEads()+"?type=securities";
      var url = "["+Object.keys(target.allocations).map(function(x) { return '"'+x+'"'; }).join(",")+"]";
      url = base+"&sec="+url+(!!target.eadsSource?"&base="+target.eadsSource:"");
      $scope.http_get(url).
        then(function(response) {
          var rd = response.data;
          for(i in rd) {
            // if TIT_REU_COD is a valid bbg code, then use it, otherwise use TIT_ISIN_BBG
            target.allocations[rd[i].TIT_COD].isin = trcRe.test(rd[i].TIT_REU_COD)?rd[i].TIT_REU_COD:rd[i].TIT_ISIN_BBG;
          }

          $scope.complementAllocations(target);
      
          if(!!cbfn) cbfn();

        }, function(err) {
          $scope.httpError();
          $scope.$parent.inprogress=3; // go directly to 3, not through 2
        });
  };

  $scope.complementAllocations = function(target) {
    if(target.fromEADS) {
      $scope.complementAllocations1(target);
    } else {
      $scope.complementAllocations2(target);
    }
  };

  $scope.complementAllocations1 = function(target) {
    // complementary data: eads data
    var ac = target.allocations;
    //console.log("complement 1",target);
    for(i in ac) {
      // even if securities already has this, refresh with the new data
      var sec = $scope.$parent.securities[ac[i].id];
      if(!sec) {
        if(!!ac[i].id && !!ac[i].classEADS && !!ac[i].nameEADS) {
          $scope.$parent.securities[ac[i].id] = {
            "id": ac[i].id,
            "classOriginal": ac[i].classEADS,
            "name": ac[i].nameEADS,
            "pxDate": "latest",
            "isin":  !!ac[i].isin?ac[i].isin:""
          };
        } else {
          console.error("Couldnt add security "+ac[i].id);
        }
      } else {
        sec.id = ac[i].id;
        if(!!ac[i].classEADS) {
          if(ac[i].classEADS!=sec.classOriginal) console.error("Change in class for "+sec.id+" from "+sec.classOriginal+" to "+ac[i].classEADS+" in "+target.id);
          sec.classOriginal = ac[i].classEADS;
        }
        sec.name = !!ac[i].nameEADS?ac[i].nameEADS:sec.name;
        //sec.pxDate = "latest";
        sec.isin = !!ac[i].isin?ac[i].isin:sec.isin;
        $scope.$parent.securities[ac[i].id] = sec;
      }

      // update the class field so that the Portfolio tab shows up with the override class
      sec = $scope.$parent.securities[ac[i].id]; // reset the 'sec' variable
      $scope.$parent.securities[ac[i].id].class = !!sec.classManual?sec.classManual:sec.classOriginal;

      if(!$scope.$parent.prices.hasOwnProperty(ac[i].id)) {
        $scope.$parent.prices[ac[i].id] = {};
        $scope.$parent.prices[ac[i].id].id = ac[i].id;
      }
      if(!$scope.$parent.prices[ac[i].id].hasOwnProperty("history")) {
        $scope.$parent.prices[ac[i].id].history = {};
      }
      // even if the history already has a price for this date, update with the refreshed price (in case of a correction)
      if(!!ac[i].CRS_DAT && !!ac[i].CRS_TIT) {
        $scope.$parent.prices[ac[i].id].history[ac[i].CRS_DAT] = {
          "pxDate": ac[i].CRS_DAT,
          "px": ac[i].CRS_TIT,
          "currency": !!ac[i].currency?ac[i].currency:"",
          "source": $scope.$parent.getEadsName()
        };
      }

      ac[i].class = $scope.$parent.securities[ac[i].id].class;
      ac[i].name = $scope.$parent.securities[ac[i].id].name;
    }
  };

  $scope.complementAllocations2 = function(target) {
    // complementary data: non-eads data
    var ac = target.allocations;
    for(i in ac) {
      ac[i].class = $scope.$parent.securities[ac[i].id].class;
      ac[i].name = $scope.$parent.securities[ac[i].id].name;
    }
  };

  $scope.portfolioLength = function() {
    if(!$scope.$parent.newAccount.hasOwnProperty("allocations")) return 0;
    var nacal = $scope.$parent.newAccount.allocations;
    return Object.keys(nacal).filter(function(x) { return nacal[x].allocation!=0; }).length;
  };

  $scope.$on("refreshEADSevent",function(event,cid) {
    var ac = $scope.$parent.accounts[cid];
    $scope.getAccountDetails(cid,ac);
  });

}
