(function (exports) {
    var subscribers = [];
    var socket = new WebSocket("ws://localhost:8081");

    socket.onmessage = function(e) {
        console.log('ws event=', e.data);
        _.each(subscribers, function (s) {
            if (s.onmessage) {
                s.onmessage(e.data);
            }
        });
    }

    exports.APIClient = function () {
        var self = this;
        var eb = function (a, b) {
            console.log('error=', a, b);
        };

        this.subscribe = function (obj) {
            subscribers.push(obj);
        };
        this.unsubscribe = function (obj) {
            var i = subscribers.indexOf(obj);
            if (i > -1) {
                subscribers.splice(i, 1);
            }
        };
        this.addLike = function () {
          var fingerprint = new Fingerprint().get();
          $.ajax({
              type: "POST",
              url: "/like",
              data: JSON.stringify({ fingerprint }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              failure: eb
          });
        };
    };
})(window);
