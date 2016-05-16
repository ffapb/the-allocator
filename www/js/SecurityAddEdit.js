function SecurityAddEdit($scope,$timeout) {
// add new security

  $scope.newSecurity = {};

  $scope.addSecurity = function() {
    var ns = $scope.newSecurity;
    $scope.$parent.securities[ns.id] = {
      "id": ns.id,
      "name": ns.name,
      "classOriginal": ns.classOriginal,
      "classManual": ns.classManual,
      "isin": ns.isin,
      "pxDate": ns.pxDate
    };
    $scope.closeDialog2();
    $scope.$emit("edited");
  };

  $scope.closeDialog2 = function() {
      $scope.newSecurity={};
      $('#dialog5').dialog("close");
  };

  $scope.closeDialog = function() {
      $timeout(function() {
        $scope.closeDialog2();
      });
  };

  $scope.delSecurity = function(id) {
    delete $scope.$parent.securities[id]; 
    $scope.$emit("edited");
  };

  $scope.newSecurityExists = function() {
     var checkExists = $scope.$parent.securities.hasOwnProperty($scope.newSecurity.id);
     return checkExists;
  };

  $scope.newSecurityValid = function() {
    if(Object.keys($scope.newSecurity).length==0) return false;
    if(!$scope.newSecurity.hasOwnProperty("id") || $scope.newSecurity.id=="") return false;
    if(!$scope.newSecurity.hasOwnProperty("name") || $scope.newSecurity.name=="") return false;
    if(!$scope.newSecurity.hasOwnProperty("isin") || $scope.newSecurity.isin=="") return false;
    // no real need for this .. can be empty
    // if(!$scope.newSecurity.hasOwnProperty("classOriginal") || $scope.newSecurity.classOriginal=="") return false;
    // Don't check on price date
    // if(!$scope.newSecurity.hasOwnProperty("pxDate") || $scope.newSecurity.pxDate=="") return false;
    return true;
  };

  $scope.editSecurityCore = function(ac) {
    $scope.newSecurity.id = ac;
    $scope.newSecurity.name = $scope.$parent.securities[ac].name;
    $scope.newSecurity.classOriginal = $scope.$parent.securities[ac].classOriginal;
    $scope.newSecurity.classManual = $scope.$parent.securities[ac].classManual;
    $scope.newSecurity.isin = $scope.$parent.securities[ac].isin;
    $scope.newSecurity.pxDate = $scope.$parent.securities[ac].pxDate;
  };

  $scope.editSecurity = function(ac) {
    $scope.editSecurityCore(ac);
    $('#dialog5').dialog('open');
  };

  $scope.checkExists = function() {
    if(!$scope.newSecurityExists()) return false;
    $scope.editSecurityCore($scope.newSecurity.id);
  };

  $scope.strategyUsingSecurity = function(secid) {
    for(st in $scope.$parent.strategies) {
      var als = $scope.$parent.strategies[st].allocations;
      if(als.hasOwnProperty(secid)&&als[secid].allocation!=0) return true;
    }
    return false;
  };

  $scope.accountUsingSecurity = function(secid) {
    for(st in $scope.$parent.accounts) {
      var als = $scope.$parent.accounts[st].allocations;
      if(als.hasOwnProperty(secid)&&als[secid].numShares!=0) return true;
    }
    return false;
  };

  $scope.pricesUsingSecurity = function(secid) {
    if(!$scope.$parent.prices.hasOwnProperty(secid)) return false;
    if(!$scope.$parent.prices[secid].hasOwnProperty("history")) return false;
    if( Object.keys($scope.$parent.prices[secid].history).length==0) return false;
    return true;
  };

}
