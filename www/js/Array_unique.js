Array_unique = function (ar) {
    var r = new Array();
    o:for(var i = 0, n = ar.length; i < n; i++)
    {
      for(var x = 0, y = r.length; x < y; x++)
      {
        if(r[x]==ar[i])
        {
//                alert('this is a DUPE!');
          continue o;
        }
      }
      r[r.length] = ar[i];
    }
    return r;
}

