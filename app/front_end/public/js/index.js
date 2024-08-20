
var socket1 = io.connect(window.location.origin + "/");
socket1.on("error", (t) => {}),
  socket1.on("disconnect", () => {}),
  socket1.on("reconnect", (t) => {}),
  socket1.on("reconnect_attempt", () => {}),
  socket1.on("reconnecting", (t) => {}),
  socket1.on("reconnect_error", (t) => {}),
  socket1.on("reconnect_failed", () => {}),
  socket1.on("connect_error", () => {}),
  socket1.on(match_id, function (t) {
    let e = JSON.parse(t);
    if (match_id == e.match_id) {
      let t = e.text;
      isNaN(e.text) ||
        (t = 1 == e.text || 0 == e.text ? e.text + " run" : e.text + " runs"),
        responsiveVoice.speak(t, "UK English Male");
    }
  });

  function deepEqual(obj1, obj2) {
    if (Object.is(obj1, obj2)) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  
    for (const key in obj1) {
      if (!Object.hasOwnProperty.call(obj2, key) || !deepEqual(obj1[key], obj2[key])) return false;
    }
    return true;
  }
  
  function arraysEqual(arr1, arr2) {
    if (arr1?.length !== arr2?.length) return false;
    const differences = [];
    for (let i = 0; i < arr1.length; i++) {
      if (!deepEqual(arr1[i], arr2[i])) {
        differences.push(arr1[i]);
    }
  }
  return differences.length === 0 ? [] : differences ; 
}
let index = (function () {
  let t = [],
    e = [],
    a = [],
    l = function (t, e) {
      if (((check = !1), t.length == e.length)) {
        let a = t.length,
          l = e.length;
        if (a != l) check = !0;
        else for (i = 0; i < l; i++) c(t[i], e[i]) || (check = !0);
      } else check = !0;
      return check;
    },
    c = function (t, e) {
      let a = !0;
      return (
        $.each(e, function (l, c) {
          t[l] != e[l] && (a = !1);
        }),
        a
      );
    },
    o = function (e) {
      $.post(
        "/api/getLayoff",
        {
          match_id: e,
        },
        function (e) {
          let b = JSON.stringify(e);
          let a = JSON.parse(JSON.stringify(e));
          let datatoget = JSON.parse(localStorage.getItem('layoffData'));
          console.log("oko", a, datatoget)
          let nonrepeatedData = arraysEqual(datatoget , a)
          if(arraysEqual(datatoget , a).length === 0){
            console.log("equal")
          }else{
            console.log("not equal");
            localStorage.setItem('layoffData', b);
          }
            let c = "";
            a.forEach((t) => {
              let e = t.active_status;
              c += m(e, t , nonrepeatedData);
            }),
          $("#backlayoff").html(c);
        }
      );
    },
    s = function (t) {
      $.post(
        "/api/getmatchodds",
        {
          match_id: t,
        },
        function (t) {
          let b = JSON.stringify(t);
          let a = JSON.parse(JSON.stringify(t));
          let datatoget = JSON.parse(localStorage.getItem('matchoddsData'));
          console.log("oko", a, datatoget)
          let nonrepeatedData = arraysEqual(datatoget , a)
          if(arraysEqual(datatoget , a).length === 0){
            console.log("equal")
          }else{
            console.log("not equal");
            localStorage.setItem('matchoddsData', b);
          }
            let c = "";
            a.forEach((t) => {
              let e = t.active_status;
              c += m(e, t, nonrepeatedData);
            }),
              $("#match_odds").html(c);
        }
      );
    },
    n = function (t) {
      $.post(
        "/api/getNews",
        {
          match_id: t,
        },
        function (t) {
          let e = JSON.parse(JSON.stringify(t));
          $("#news").html(e.news);
        }
      );
    },
    r = function (t) {
      $.post(
        "/api/getBallRunning",
        {
          match_id: t,
        },
        function (t) {
          let e = JSON.parse(JSON.stringify(t));
          if (l(a, e)) {
            a = e;
            let t = d(e);
            $("#ballingSection2").html(t);
          }
        }
      );
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
            : "Wicket" == t.resultarraysEqual
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
    m = function (t, e, nonrepeatedData) {
        try{
      let a = "";
      let l = "back-common-bg cell-text-color";
      let c = "text lay-common-bg cell-text-color";
      let o = 0,
      s = 0;
    e.match_yes && (o = e.match_yes.toFixed(2)),
      e.match_no && (s = e.match_no.toFixed(2));
    let n = e.number_yes.toFixed(2),
      i = e.number_no.toFixed(2);
      switch (t) {
        case 0:
          (status_string = "Active"),
            (class_status = "text active-cell cell-text-color");
          for(let i = 0; i < nonrepeatedData?.length; i++){
            let data = nonrepeatedData[i];
            if(data._id === e._id){
              l = "back-update cell-text-color";
              c = "text lay-update cell-text-color";
            }
          }
          if (e.market_type === 1) {
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
            for(let i = 0; i < nonrepeatedData?.length; i++){
              let data = nonrepeatedData[i];
              if(data._id === e._id){
                l = "back-update cell-text-color";
                c = "text lay-update cell-text-color";
              }
            }
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
            for(let i = 0; i < nonrepeatedData?.length; i++){
              let data = nonrepeatedData[i];
              if(data._id === e._id){
                l = "back-update cell-text-color";
                c = "text lay-update cell-text-color";
              }
            }
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
    }catch(error){
        console.log("Error", error);
    }
    },
    h = function (t) {
      $.post(
        "/api/getScore",
        {
          match_id: t,
        },
        function (t) {
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
        }
      );
    };
  return {
    init: function (t) {
      setInterval(function () {
        h(t);
      }, 880),
        setInterval(function () {
          o(t);
        }, 2000),
        setInterval(function () {
          s(t);
        }, 2500),
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
