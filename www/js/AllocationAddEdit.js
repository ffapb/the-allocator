function AllocationAddEdit($scope,$timeout) {

  $scope.selected=undefined;

  $scope.updateSelected = function(stname) {
    $scope.selected = stname;
    $scope.setAggregates2();
  };

  $scope.agg2 = {};

  $scope.setAggregates2 = function() {
    if($scope.selected===undefined) return;

          var i = {};
          i[$scope.$parent.strategies[$scope.selected].id] = $scope.$parent.strategies[$scope.selected];
          $scope.agg2 = $scope.$parent.setAggregates(i);
  };

  $scope.resetSelected = function() {
    var sts = $scope.$parent.strategies;
    if(Object.keys(sts).length>0) {
      $scope.updateSelected(Object.keys(sts)[0]);
    }
  };

  $scope.$on("loaded2", function() {
    if($scope.selected==undefined) $scope.resetSelected();
  });

  $scope.newAlloc={};

  $scope.addNewAlloc = function() {
    if(!$scope.$parent.strategies[$scope.selected].allocations.hasOwnProperty($scope.newAlloc.id)) {
      $scope.$parent.strategies[$scope.selected].allocations[$scope.newAlloc.id] = {};
    }
    $scope.$parent.strategies[$scope.selected].allocations[$scope.newAlloc.id].id = $scope.newAlloc.id;
    $scope.$parent.strategies[$scope.selected].allocations[$scope.newAlloc.id].allocation = $scope.newAlloc.allocation;

    $scope.closeDialog2();
    $scope.$emit("edited");
    $scope.setAggregates2();
  };

  $scope.closeDialog2 = function() {
      $scope.newAlloc={};
      $('#dialog1').dialog("close");
  };

  $scope.closeDialog = function() {
      $timeout(function() {
        $scope.closeDialog2();
      });
  };

  $scope.allocSet = function(al,v) {
    al.allocation=v;
    $scope.$emit("edited");
  };

  $scope.editAllocCore = function(al) {
    $scope.newAlloc.id = al.id;
    $scope.newAlloc.allocation = al.allocation;
  };

  $scope.editAlloc = function(al) {
    $scope.editAllocCore(al);
    $('#dialog1').dialog('open');
  };

  $scope.checkExists = function() {
    var id = $scope.newAlloc.id;
    var als = $scope.$parent.strategies[$scope.selected].allocations;
    // I originally wanted to leave the 2nd check out so that changing the id doesn't leave a stale allocation for an unallocated security
    // but then I noticed that if one desires to change the security of an allocation, s/he wouldn't want to lose the allocation set
    if(als.hasOwnProperty(id) && als[id].allocation!=0) {
      $scope.editAllocCore(als[$scope.newAlloc.id]);
    }
  };
  $scope.selectedAccounts = function() {
    if($scope.selected==undefined) return [];
    if(Object.keys($scope.$parent.accounts).length==0) return [];

    var acs = $scope.$parent.accounts;
    acs = Object.keys(acs).filter(
      function(x) {
        return acs[x].strategy == $scope.$parent.strategies[$scope.selected].name;
      });

    return acs;
  };

  $scope.newStrategy={};

  $scope.addNewStrategy = function() {
    if(!$scope.$parent.strategies.hasOwnProperty($scope.newStrategy.name)) {
      $scope.$parent.strategies[$scope.newStrategy.name] = {};
      $scope.$parent.strategies[$scope.newStrategy.name].allocations = {};
    }
    $scope.$parent.strategies[$scope.newStrategy.name].name = $scope.newStrategy.name;

    $scope.updateSelected($scope.newStrategy.name);

    $('#dialog3').dialog("close");
    $scope.newStrategy={};
    $scope.$emit("edited");
  };

  $scope.noAllocations = function() {
    if($scope.selected===undefined) return true;
    if(!$scope.$parent.strategies.hasOwnProperty($scope.selected)) $scope.selected = Object.keys($scope.$parent.strategies)[0]; // in case a new strategy was added and selected, then data downloaded where the data doesn't have this strategy
    if(!$scope.$parent.strategies[$scope.selected]) return true;
    if(Object.keys($scope.$parent.strategies[$scope.selected].allocations).length==0) return true;
    var all0 = $scope.$parent.strategies[$scope.selected].allocations;
    all0 = Object.keys(all0).map(function(x) {
      return all0[x].allocation;
    });
    all0 = Array_unique(all0);
    if(all0.length==1 && all0[0]==0) return true;
    return false;
  };

  $scope.delStrategy = function() {
    delete $scope.$parent.strategies[$scope.$parent.strategies[$scope.selected].name];
    $scope.$emit("edited");
    $scope.resetSelected();
  };

}
