function AccountSecurity($scope) {
// add new account security

  $scope.newAccountSecurity = {};

  $scope.addAccountSecurity = function() {
    var id = $scope.newAccountSecurity.id;
    if(!$scope.$parent.newAccount.allocations) $scope.$parent.newAccount.allocations={};
    $scope.$parent.newAccount.allocations[id] = {
      "id": id,
      "numShares": 9999999,
      "avgCost": 0,
      "totalCost": 0,
      "totalPaid": 0
    };
    $scope.newAccountSecurity = {};
  };

  $scope.delAccountSecurity = function(id) {
    delete $scope.$parent.newAccount.allocations[id]; 
  };

  $scope.newAccountSecurityExists = function() {
     if(!$scope.$parent.newAccount.hasOwnProperty("allocations")) return false;
     var checkExists = $scope.$parent.newAccount.allocations.hasOwnProperty($scope.newAccountSecurity.id) &&
       $scope.$parent.newAccount.allocations[$scope.newAccountSecurity.id].numShares!=0;
     return checkExists;
  };
}
