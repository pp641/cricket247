
var socket1 = io({
  reconnection: true, // Enable reconnection
  reconnectionDelay: 1000, // Delay between retries (1 second)
  reconnectionDelayMax: 5000, // Maximum delay between retries (5 seconds)
  reconnectionAttempts: Infinity, // Retry indefinitely (or set a limit)
});




socket1.connect(window.location.origin + "/", {
  "transports": ['websocket']
});


  socket1.on("connection" , (obj)=>{
    console.log("connect", obj)
  })
  socket1.on("error", (t) => {
    console.log("Error", t)
  }),

  socket1.on("disconnect", () => {
    console.log("disconnect")
  }),
  socket1.on("reconnect", (t) => {
    console.log("Reconnect")
  }),
  socket1.on("reconnect_attempt", (t) => {
    console.log("Reconnect attemt",t)
  }),
  socket1.on("reconnecting", (t) => {
    console.log("Reconnecting")
  }),
  socket1.on("reconnect_error", (t) => {
    console.log("Reconnect error", ) 
  }),
  socket1.on("reconnect_failed", () => {
    console.log("reconnect failed")
  }),
  socket1.on("connect_error", () => {
    console.log("connect error")
  }),



  // socket.connect(window.location.origin + '/')
  
  // socket.on("connection", ()=>{
  //   console.log("connected to socket")
  // })
  // socket.on('connect_error', (err) => {
  //   console.error('Connection error:', err);
  // });
  
  // socket.on('reconnect', () => {
  //   console.log('Reconnected to server');
  // });
  
  // socket.on('disconnect', () => {
  //   console.log('Disconnected from server');
  // });
  




  socket1.on(match_id, function (t) {
    console.log("okdkd");
    try {
      let e = JSON.parse(t);
      if (match_id == e.match_id) {
        let message = e.text;
        if (!isNaN(e.text)) {
          message = e.text == 1 || e.text == 0 ? e.text + " run" : e.text + " runs";
        }
        responsiveVoice.speak(message, "UK English Male", {
          onstart: function () {
            console.log("Speaking started...");
          },
          onend: function () {
            console.log("Speaking finished.");
          },
          onerror: function (error) {
            console.error("Error while speaking:", error);
            // Handle the error here, such as displaying a message to the user
          },
        });
      }
    } catch (error) {
      console.error("Error processing received data:", error);
      // Handle the error here, such as logging it or displaying a message to the user
    }
  });
  

var index = (function () {
  var t = [],
    e = [],
    a = [],
    l = function (t, e) {
      if (((check = !1), t.length == e.length)) {
        var a = t.length,
          l = e.length;
        if (a != l) check = !0;
        else for (i = 0; i < l; i++) c(t[i], e[i]) || (check = !0);
      } else check = !0;
      return check;
    },
    c = function (t, e) {
      var a = !0;
      return (
        $.each(e, function (l, c) {
          t[l] != e[l] && (a = !1);
        }),
        a
      );
    },
    o = function (e) {
      $.post("/api/getLayoff", { match_id: e }, function (e) {
        var a = JSON.parse(JSON.stringify(e));
        if (l(t, a)) {
          t = a;
          var c = "";
          a.forEach((t) => {
            let e = t.active_status;
            c += m(e, t);
          }),
            $("#backlayoff").html(c);
        }
      });
    },
    s = function (t) {
      $.post("/api/getmatchodds", { match_id: t }, function (t) {
        var a = JSON.parse(JSON.stringify(t));
        if (l(e, a)) {
          e = a;
          var c = "";
          a.forEach((t) => {
            let e = t.active_status;
            c += m(e, t);
          }),
            $("#match_odds").html(c);
        }
      });
    },
    n = function (t) {
      $.post("/api/getNews", { match_id: t }, function (t) {
        let e = JSON.parse(JSON.stringify(t));
        $("#news").html(e.news);
      });
    },
    r = function (t) {
      $.post("/api/getBallRunning", { match_id: t }, function (t) {
        let e = JSON.parse(JSON.stringify(t));
        if (l(a, e)) {
          a = e;
          let t = d(e);
          $("#ballingSection2").html(t);
        }
      });
    },
    d = function (t) {
      let e =
        '<div class="rg-container"><table class="rg-table" summary="Hed"><caption class="rg-header"> </caption><thead><tr><th class="text ">Ball</th><th class="text ">Result</th><th class="text ">TimeStamp</th></tr></thead><tbody>';
      return (
        t.forEach((t) => {
          let a = t.result,
            l = "",
            c = "",
            o = "",
            s = "";
          "#" == t.result
            ? ((a = "Ball Running"),
              (l = "currentBowl"),
              (c = 'style="color:#fff; font-weight:bold;"'),
              (o = 'style="color:#fff; font-weight:bold;"'))
            : 6 == t.result
            ? ((c =
                'style="color:#00675d; font-weight:bold; font-size: 28px;"'),
              (o = 'style="color:#000;font-weight:bold; "'))
            : 4 == t.result
            ? ((c = 'style="color:#0017ff; font-weight:bold; font-size: 28px"'),
              (o = 'style="color:#000;font-weight:bold; "'))
            : "Out" == t.result
            ? ((c =
                'style="color:#ff0000; font-weight:bold; font-size: 28px;"'),
              (o = 'style="color:#000;font-weight:bold; "'))
            : "Wicket" == t.result
            ? ((c =
                'style="color:#ff0000; font-weight:bold; font-size: 28px;"'),
              (o = 'style="color:#000;font-weight:bold; "'))
            : ((c = 'style="color:#000; font-weight:bold;"'),
              (o = 'style="color:#000;font-weight:bold; "')),
            1 == t.if_update &&
              (s =
                '<span class="label label-danger blink pull-right"> Updated </span>'),
            (e +=
              '<tr id="' +
              l +
              '"><td class="text " data-title="Ball" ' +
              o +
              ">" +
              t.bal_no +
              '</td><td class="text " data-title="Result" ' +
              c +
              ">" +
              a +
              " " +
              s +
              '</td><td class="text " data-title="Result" style="font-size:13px;font-weight:bold">' +
              moment(t.last_update_time).format("DD-MMM-YY h:mm:ss A") +
              "</td></tr>");
        }),
        (e +=
          '<tr><td colspan=3><button class="btn btn-default" onclick="window.open(\'/ball_running/' +
          match_id +
          "','Ball Running','_Blank')\">View All</button></td></tr>"),
        (e += "</tbody></table></div>")
      );
    },
    m = function (t, e) {
      var a = "";
      switch (t) {
        case 0:
          (status_string = "Active"),
            (class_status = "text active-cell cell-text-color");
          var l = "back-common-bg cell-text-color";
          e.match_yes != e.match_yes_temp &&
            (l = "back-update cell-text-color");
          var c = "text lay-common-bg cell-text-color";
          e.match_no != e.match_no_temp &&
            (c = "text lay-update cell-text-color");
          var o = 0,
            s = 0;
          e.match_yes && (o = e.match_yes.toFixed(2)),
            e.match_no && (s = e.match_no.toFixed(2));
          var n = e.number_yes.toFixed(2),
            i = e.number_no.toFixed(2);
          if (1 == e.market_type) {
            (o = 0), (s = 0);
            e.match_yes && (o = e.match_yes.toFixed(0)),
              e.match_no && (s = e.match_no.toFixed(0)),
              (n = e.number_yes.toFixed(2)),
              (i = e.number_no.toFixed(2));
          }
          a +=
            '<tr class=""><td class="text cell-name" data-title="Fancy Market">' +
            e.match_name +
            '</td><td class="' +
            l +
            '" data-title="Back All">' +
            o +
            "<br> " +
            n +
            '</td><td class="' +
            c +
            '" data-title="Lay All">' +
            s +
            "<br> " +
            i +
            '</td><td class="' +
            class_status +
            '" data-title="Status">' +
            status_string +
            "</td></tr>";
          break;
        case 1:
          (status_string = "Suspended"),
            (class_status = "text sespend-cell cell-text-color");
          l = "back-common-bg cell-text-color";
          e.match_yes != e.match_yes_temp &&
            (l = "back-update cell-text-color");
          c = "text lay-common-bg cell-text-color";
          e.match_no != e.match_no_temp &&
            (c = "text lay-update cell-text-color");
          (o = 0), (s = 0);
          e.match_yes && (o = e.match_yes.toFixed(2)),
            e.match_no && (s = e.match_no.toFixed(2));
          (n = e.number_yes.toFixed(2)), (i = e.number_no.toFixed(2));
          if (1 == e.market_type) {
            (o = 0), (s = 0);
            e.match_yes && (o = e.match_yes.toFixed(0)),
              e.match_no && (s = e.match_no.toFixed(0)),
              (n = e.number_yes.toFixed(2)),
              (i = e.number_no.toFixed(2));
          }
          a +=
            '<tr class=""><td class="text cell-name" data-title="Fancy Market">' +
            e.match_name +
            '</td><td class="' +
            l +
            '" data-title="Back All"><span class="text-cell-sespend">' +
            o +
            "</span><br> " +
            n +
            '</td><td class="' +
            c +
            '" data-title="Lay All"><span class="text-cell-sespend">' +
            s +
            "</span><br> " +
            i +
            '</td><td class="' +
            class_status +
            '" data-title="Status">' +
            status_string +
            "</td></tr>";
          break;
        case 2:
          (status_string = "Ball Running"),
            (class_status = "text sespend-cell cell-text-color");
          l = "back-common-bg cell-text-color";
          e.match_yes !== e.match_yes_temp &&
            (l = "back-update cell-text-color");
          c = "text lay-common-bg cell-text-color";
          e.match_no != e.match_no_temp &&
            (c = "text lay-update cell-text-color");
          (o = 0), (s = 0);
          e.match_yes && (o = e.match_yes.toFixed(2)),
            e.match_no && (s = e.match_no.toFixed(2));
          (n = e.number_yes.toFixed(2)), (i = e.number_no.toFixed(2));
          if (1 == e.market_type) {
            (o = 0), (s = 0);
            e.match_yes && (o = e.match_yes.toFixed(0)),
              e.match_no && (s = e.match_no.toFixed(0)),
              (n = e.number_yes.toFixed(2)),
              (i = e.number_no.toFixed(2));
          }
          a +=
            '<tr class=""><td class="text cell-name" data-title="Fancy Market">' +
            e.match_name +
            '</td><td class="' +
            l +
            '" data-title="Back All"><span class="text-cell-sespend">' +
            o +
            "</span><br> " +
            n +
            '</td><td class="' +
            c +
            '" data-title="Lay All"><span class="text-cell-sespend">' +
            s +
            "</span><br> " +
            i +
            '</td><td class="' +
            class_status +
            '" data-title="Status">' +
            status_string +
            "</td></tr>";
      }
      return a;
    },
    h = function (t) {
      $.post("/api/getScore", { match_id: t }, function (t) {
        let e = JSON.parse(JSON.stringify(t)),
          a = "";
        e.forEach((t) => {
          a +=
            "<tr><td>" +
            t.team +
            "</td><td>" +
            t.Total +
            "</td><td>" +
            t.Wickets +
            "</td></tr>";
        }),
          $("#scoreboard").html(a);
      });
    };
  return {
    init: function (t) {
      setInterval(function () {
        h(t);
      }, 880),
        setInterval(function () {
          o(t);
        }, 950),
        setInterval(function () {
          s(t);
        }, 1500),
        setInterval(function () {
          r(t);
        }, 1850),
        setInterval(function () {
          n(t);
        }, 2200);
    },
  };
})();
index.init(match_id);
