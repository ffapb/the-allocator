$(function() {
  $( "#Main" ).tabs();
  $( "#tabset1" ).tabs();
  //$( "#tabset2" ).tabs();
  $( "#tabset3" ).tabs();

  // http://jqueryui.com/tabs/#manipulation
  // modal dialog init: custom buttons and a "close" callback resetting the form inside
  $("#dialog1").dialog({
    autoOpen: false, modal: true, width:"50%",
    close: function() {
      angular.element(document.getElementById('AllocationAddEdit')).scope().closeDialog();
    }
  });
  $("#addAllocation").click(function() { $("#dialog1").dialog("open"); });
  $("#EADSController").dialog({
     autoOpen: false,
     modal: true,
     width:"85%",
     open: function() {
       // do not call this on open
       // call it only on change of input
       // angular.element(document.getElementById('EADSController')).scope().possibles2();

       angular.element(document.getElementById('EADSController')).scope().resetPossiblesCoreStatus();
     },
     close: function() {
       angular.element(document.getElementById('AccountAddEdit')).scope().closeDialog();
     }
   });
  $(".addAccount").click(function() { $("#EADSController").dialog("open"); });
  $("#dialog3").dialog({ autoOpen: false, modal: true });
  $("#addStrategy").click(function() { $("#dialog3").dialog("open"); });
  $("#dialog4").dialog({ autoOpen: false, modal: true, width:"50%" });
  $("#addPrice").click(function() { $("#dialog4").dialog("open"); });
  $("#dialog5").dialog({
    autoOpen: false,
    modal: true,
    width:"50%",
    close: function() {
       angular.element(document.getElementById('SecurityAddEdit')).scope().closeDialog();
    }
  });
  $("#addSecurity").click(function() { $("#dialog5").dialog("open"); });

});

var app = angular.module('myApp', []);
app.controller('Main', Main);
app.controller('Errors', Errors);
app.controller('PriceAddEdit', PriceAddEdit);
app.controller('AccountAddEdit', AccountAddEdit);
app.controller('Trades', Trades);
app.controller('AccountSecurity', AccountSecurity);
app.controller('AllocationAddEdit', AllocationAddEdit);
app.controller('SaveLocalRemote', SaveLocalRemote);
app.controller('BackendCtrl', BackendCtrl);
app.controller('EADSController', EADSController);
app.controller('EADSPing', EADSPing);
app.controller('SecurityAddEdit', SecurityAddEdit);
app.controller('ServerVersion', ServerVersion);
app.controller('SecuritiesPriceDates', SecuritiesPriceDates);
app.controller('PricesBatch', PricesBatch);
app.controller('StrategiesPerformance', StrategiesPerformance);
app.controller('PartialRedemption', PartialRedemption);
app.controller('AccountPerformance', AccountPerformance);
app.controller('StrategiesRisk', StrategiesRisk);
