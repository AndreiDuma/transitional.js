var Transitional = function(options) {
  var data = options.data || {};
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

var TicTacToe = Transitional({
  state: "play",
  initialize: function(data) {
    data.turn = "X";
    data.xs = [];
    data.os = [];
    self = this;
    $("tr").each(function(indexTr) {
      $("td", this).each(function(indexTd) {
        $(this).click(function() {
          self.push("play", {x:indexTr, y:indexTd});
        });
      });
    });
  },
  rules: {
    "play > play": function(data, input) {
      console.log("table:nth-child(" + (input.x+1) + "):nth-child(" + (input.y+1) + ")");
      if (data.turn === "X") {
        data.xs.push(input);
        $("table tr:nth-child(" + (input.x+1) + ") td:nth-child(" + (input.y+1) + ")").text("X");
        data.turn = "O";
      } else {
        data.os.push(input);
        $("table tr:nth-child(" + (input.x+1) + ") td:nth-child(" + (input.y+1) + ")").text("O");
        data.turn = "X";
      }
      if (data.xs.length + data.os.length === 9) {
        this.push("finished");
      }
    },
    "play > finished": function() {
      $("#message").text("Finished! Now you say who won..");
    }
  }
});
