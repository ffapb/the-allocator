var DataManager = function(strategies,accounts,securities) {
  this.strategies = strategies;
  this.accounts = accounts;
  this.securities = securities;
};

DataManager.prototype.classes = function() {
  var secs = this.securities;
  var o = Object.keys(secs).map(function(x) {
    return secs[x].class;
  });
  o = Array_unique(o);
  return o;
};

DataManager.prototype.aggregateStrategies = function(sts,fld) {
// When sts: $scope.$parent.strategies
// this returns a 2d matrix: 1st dimension is classes, 2nd dimension is strategy total allocations per class
// When sts: $scope.$parent.accounts
// it returns a 2d matrix: 1st dimension is classes, 2nd dimension is account total allocations per class

  if(!fld) fld="name";

  var agg = {};
  var classes = this.classes();
  var secs0 = this.securities;
  for(i in classes) {
    var secs = Object.keys(secs0).filter(function(x) {
      return secs0[x].class==classes[i];
    });
    agg[classes[i]] = {};
    for(j in sts) {
      var als0 = sts[j].allocations;
      var als = Object.keys(als0).filter(function(w) {
        if(!als0[w]) return false;
        return secs.indexOf(als0[w].id)!=-1;
      });
      als = als.map(function(x) { return als0[x]; });
      als = als.map(function(x) { return x.allocation; });
      als = als.reduce(function(a,b) { return a+b; },0);
      agg[classes[i]][sts[j][fld]] = als;
    }
  }
  return agg;
};

DataManager.prototype.allocDiffCore = function(ac,al) {
  var i1 = this.accounts[ac].allocations[al.id];
  var i2 = !i1?0:i1.allocation;
  return -1 * (al.allocation - i2);
};

