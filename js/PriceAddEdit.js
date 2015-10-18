function PriceAddEdit($scope) {
// prices

  $scope.newPrice = {};

  $scope.editPrice = function(secid,pxDate) {
    $scope.newPrice = {};
    $scope.newPrice.id = secid;
    $scope.newPrice.pxDate = pxDate;
    $scope.newPrice.px = $scope.$parent.prices[secid].history[pxDate].px;
    $scope.newPrice.currency = $scope.$parent.prices[secid].history[pxDate].currency;
    $("#dialog4").dialog("open");
  };

  $scope.savePrice = function() {
    var a = $scope.$parent.prices;
    var b = $scope.newPrice.id;
    var c = $scope.newPrice.pxDate;
    if(!a.hasOwnProperty(b)) a[b] = {};
    a[b].id = b;
    if(!a[b].hasOwnProperty("history")) a[b].history={};
    if(!a[b].history.hasOwnProperty(c)) a[b].history[c]={};
    a[b].history[c].pxDate = c;
    a[b].history[c].px = $scope.newPrice.px;
    a[b].history[c].currency = $scope.newPrice.currency;
    a[b].history[c].source = "Manual";
    $('#dialog4').dialog('close');
    $scope.newPrice = {};
    $scope.$emit("edited");
  };

  $scope.delPrice = function(secid,pxDate) {
    delete $scope.$parent.prices[secid].history[pxDate];
    if(Object.keys($scope.$parent.prices[secid].history).length==0) delete $scope.$parent.prices[secid];
    $scope.$emit("edited");
  };

}
