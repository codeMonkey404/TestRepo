var count = 0;

function addLike() {
  var myFPrint = new Fingerprint().get();
  $.ajax({
      type: "POST",
      url: "/like",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify({ fingerprint:myFPrint }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        console.log('YEEEE!');
      },
      failure: function(errMsg) {
        console.log(errMsg);
      }
  });
}

var socket = new WebSocket("ws://localhost:8081/");
socket.onmessage = function ()
{
  console.log(arguments);
  count++;
  $( "#counter" ).text(count);
}
