Array_diff = function(a,b) {
        // http://stackoverflow.com/a/4026828
            return a.filter(function(i) {return b.indexOf(i) < 0;});
};

