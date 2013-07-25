var Transitional = function(options) {
  var data = options.data;
  var state = options.state;
  var rules = options.rules;

  var process = function(to, input) {
    var s, from = state,
        match_from = new RegExp("\\b" + from + "\\b"),
        match_to = new RegExp("\\b" + to + "\\b");
    state = to;
    for (var t in rules) {
      s = t.split(">");
      if (s.length !== 2) throw new Error("Exactly one '>' expected");
      if (/^\s*!/.test(s[0]) ^ match_from.test(s[0]) &&
          /^\s*!/.test(s[1]) ^ match_to.test(s[1]))
        rules[t].call(this, data, input, from, to);
    }
  };

  this.push = function(to, input) {
    var self = this;
    setTimeout(function() {
      process.call(self, to, input);
    }, 0);
  };

  if (options.initialize) options.initialize.call(this, data);
};
