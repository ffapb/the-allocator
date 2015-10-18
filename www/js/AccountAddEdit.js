function AccountAddEdit($scope,$timeout) {
// This controller displays the accounts tab

  $scope.inprogress=0;
  $scope.eadsAvail = false;

  $scope.accountsRedeemed = function(isNot) {
    if(isNot==null) isNot=false;
    var x = $scope.$parent.accounts;
    x = Object.keys(x).filter(function(y) {
      var o = x[y].hasOwnProperty("redemption");
      return isNot?!o:o;
    });
    return x;
  };

  $scope.redeem = function(acid,state) {
    $scope.$parent.accounts[acid].redemption = state;
  };

  $scope.toggledRedemption = function(ac) {
    return $scope.$parent.accounts[ac].redemption=="Working"?"Done":"Working";
  };

  $scope.unredeem = function(ac) {
    delete $scope.$parent.accounts[ac].redemption;
  };

  $scope.newAccount={};

  $scope.addNewAccount = function() {
    if(!$scope.$parent.accounts.hasOwnProperty($scope.newAccount.id)) {
      $scope.$parent.accounts[$scope.newAccount.id] = {};
    }
    var ac = $scope.$parent.accounts[$scope.newAccount.id];
    ac.id = $scope.newAccount.id;
    ac.name = $scope.newAccount.name;
    ac.strategy = $scope.newAccount.strategy;
    ac.inception = $scope.newAccount.inception;
    ac.initialInvestment = $scope.newAccount.initialInvestment;
    ac.rm = $scope.newAccount.rm;
    ac.currentDate = $scope.newAccount.currentDate;
    ac.navMonthStart = $scope.newAccount.navMonthStart;
    ac.navYearStart = $scope.newAccount.navYearStart;
    ac.fromEADS = $scope.newAccount.fromEADS;
    if(!!$scope.newAccount.eadsSource) ac.eadsSource = $scope.newAccount.eadsSource;
    ac.cash = $scope.newAccount.cash;
    ac.performance = $scope.newAccount.performance;
    if(!!$scope.newAccount.allocations) {
      ac.allocations = angular.fromJson(angular.toJson($scope.newAccount.allocations));
    } else {
      ac.allocations = {};
    }
    //ac.feesMan
    //ac.feesEntry

    $scope.closeDialog2();
    $scope.$emit("edited");
  };

  $scope.delAccount = function(id) {
    if($scope.$parent.accounts.hasOwnProperty(id)) {
      delete $scope.$parent.accounts[id];
    }
    $scope.$emit("edited");
  };

 
  $scope.closeDialog2 = function() {
      $scope.newAccount={};
      $('#EADSController').dialog("close");
  };

  $scope.closeDialog = function() {
      $timeout(function() {
        $scope.closeDialog2();
      });
  };

  $scope.editAccount = function(ac) {
    $scope.newAccount.id = ac;
    $scope.newAccount.name = $scope.$parent.accounts[ac].name;
    $scope.newAccount.strategy = $scope.$parent.accounts[ac].strategy;
    $scope.newAccount.inception = $scope.$parent.accounts[ac].inception;
    $scope.newAccount.initialInvestment = $scope.$parent.accounts[ac].initialInvestment;
    $scope.newAccount.rm = $scope.$parent.accounts[ac].rm;
    $scope.newAccount.currentDate = $scope.$parent.accounts[ac].currentDate;
    $scope.newAccount.currentAmount = $scope.$parent.accounts[ac].currentAmount; // this is only read-only, which is why it's not in the save function above when copying from newAccount to parent.accounts[ac]
    $scope.newAccount.navMonthStart = $scope.$parent.accounts[ac].navMonthStart;
    $scope.newAccount.navYearStart = $scope.$parent.accounts[ac].navYearStart;
    $scope.newAccount.cash = $scope.$parent.accounts[ac].cash;
    $scope.newAccount.performance = $scope.$parent.accounts[ac].performance;
    $scope.newAccount.fromEADS = $scope.$parent.accounts[ac].fromEADS;
    if(!!$scope.$parent.accounts[ac].eadsSource) $scope.newAccount.eadsSource = $scope.$parent.accounts[ac].eadsSource;
    $scope.newAccount.allocations = angular.fromJson(angular.toJson($scope.$parent.accounts[ac].allocations));

    $('#EADSController').dialog('open');
  };

  $scope.newAccountValid = function() {
    if(Object.keys($scope.newAccount).length==0) return false;
    if(!$scope.newAccount.hasOwnProperty("id") || $scope.newAccount.id==="" || !$scope.newAccountValidId()) return false;
    if(!$scope.newAccount.hasOwnProperty("name") || $scope.newAccount.name==="") return false;
    if(!$scope.newAccount.hasOwnProperty("strategy") || $scope.newAccount.strategy==="") return false;
    if(!$scope.newAccount.hasOwnProperty("inception") || $scope.newAccount.inception==="") return false;
    if(!$scope.newAccount.hasOwnProperty("initialInvestment") || $scope.newAccount.initialInvestment==="") return false;
    if(!$scope.newAccount.hasOwnProperty("rm") || $scope.newAccount.rm==="") return false;
    if(!$scope.newAccount.hasOwnProperty("currentDate") || $scope.newAccount.currentDate==="") return false;
    if(!$scope.newAccount.hasOwnProperty("navMonthStart") || $scope.newAccount.navMonthStart==="") return false;
    if(!$scope.newAccount.hasOwnProperty("navYearStart") || $scope.newAccount.navYearStart==="") return false;
    if(!$scope.newAccount.hasOwnProperty("cash") || $scope.newAccount.cash==="") return false;
    return true;
  };

  $scope.newAccountValidId = function() {
    if(!$scope.newAccount.id) return false;
    return $scope.newAccount.id.indexOf(" ")===-1;
  };

  $scope.accountsFromEADS = function() {
    var ac2ref = [];
    for(ac in $scope.$parent.accounts) {
      var aci = $scope.$parent.accounts[ac];
      if(aci.fromEADS) ac2ref.push(aci.id);
    }
    return ac2ref;
  };

  $scope.refreshEADSdata = function() {
    var ac2ref = $scope.accountsFromEADS();
    for(ac in ac2ref) {
      var aci = ac2ref[ac];
      $scope.$broadcast("refreshEADSevent",aci);
    }
  };

}
