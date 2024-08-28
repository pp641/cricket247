var socket1 = io.connect('http://137.59.55.98:85/');
socket1.on('error', (err) => {
});

socket1.on('disconnect', () => {
});

socket1.on('reconnect', (number) => {
    console.log("Error 1 ")

});

socket1.on('reconnect_attempt', () => {
    console.log("Error 2 ")
    
});

socket1.on('reconnecting', (number) => {
    console.log("Error 3")
    
});

socket1.on('reconnect_error', (err) => {
    console.log("Error 4")

});

socket1.on('reconnect_failed', () => {
    console.log("Error5 ")
});

socket1.on('connect_error', () => {
    console.log("Error 6 ")

});
socket1.on(match_id, function(Message) {
    let obj = JSON.parse(Message);
    if (match_id == obj.match_id) {
        let speak = obj.text;
        if (!isNaN(obj.text)) {
            if (obj.text == 1 || obj.text == 0) {
                speak = obj.text + " run"
            } else {
                speak = obj.text + " runs"
            }
        }
        responsiveVoice.speak(speak, "UK English Male");
    }
});
var index = function(){
    
    var oldback_lay = [];
    var oldmatch_odds = [];
    var old_ball_running = [];
    var init = function(match_id){       
        setInterval(
            function() {
                getScore(match_id);
            }, 880
        );
        setInterval(
            function() {
                getLayoff(match_id);
            }, 950
        );
        setInterval(
            function() {
                getMatchodds(match_id);
            }, 1000
        );
        setInterval(
            function() {
                getBallRunning(match_id);
            }, 1050
        );
        setInterval(
            function() {
                getNews(match_id);
            }, 1100
        );
        
        
    }
    var check_data = function(Old_data, New_data){
        check = false;
        if (Old_data.length == New_data.length) {
            // White
            var Old_length = Old_data.length;
            var New_length = New_data.length;

            // alert(' Old : '+ Old_length+ ' New : '+New_length)
            if (Old_length != New_length) {
                check = true;
            } else {
                for (i = 0; i < New_length; i++) {
                // alert(old_data.matchLayJson[i]);
                    if (checkJsons(Old_data[i], New_data[i])) {

                    } else {
                        check = true;
                    }
                }
            }
        } else {
            check = true;
        }
        return check;
    }
    var checkJsons = function(otherJson, newJson){
        var sameJson = true;
        $.each(newJson, function(key, value) {
            if (otherJson[key] != newJson[key]) {
                sameJson = false;
            }
        });
        return sameJson;
    }
    var getLayoff = function(match_id){
        $.post('/api/getLayoff', {match_id: match_id}, function(data) {
            var match_layoff = JSON.parse(JSON.stringify(data));
            let check = check_data(oldback_lay, match_layoff)
            if (check) {
                oldback_lay = match_layoff;
                var table_row = "";
                match_layoff.forEach(row => {
                    let status = row.active_status;
                    table_row += data_layout(status, row);
                });
                $("#backlayoff").html(table_row);
            }
        });
    }
    var getMatchodds = function(match_id){
        $.post('/api/getmatchodds', {match_id: match_id}, function(data) {
            var match_odds_json = JSON.parse(JSON.stringify(data));
            let check = check_data(oldmatch_odds, match_odds_json)
            if (check) {
                oldmatch_odds = match_odds_json;
                var table_row = "";
                match_odds_json.forEach(row => {
                    let status = row.active_status;
                    table_row += data_layout(status, row);
                })
                $("#match_odds").html(table_row);
            }
        });
    }
    var getNews = function(match_id){
        $.post('/api/getNews', {match_id: match_id}, function(data) {
            let obj = JSON.parse(JSON.stringify(data));
            $("#news").html(obj.news);
        });
    }
    var getBallRunning = function(match_id){
        $.post('/api/getBallRunning', {match_id: match_id}, function(data) {
            let jobj = JSON.parse(JSON.stringify(data));
            let chk = check_data(old_ball_running, jobj)
            if (chk) {
                old_ball_running = jobj;
                let layout = getballrunninglayout(jobj);
                $("#ballingSection2").html(layout);
            }
        });
    }
    var getballrunninglayout = function(array){
        let html = '<div class="rg-container">' +
        '<table class="rg-table" summary="Hed">' +
        '<caption class="rg-header"> </caption>' +
        '<thead>' +
        '<tr>' +
        '<th class="text ">Ball</th>' +
        '<th class="text ">Result</th>' +
        '<th class="text ">TimeStamp</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
        array.forEach(row => {
        let res = row.result;
        let id = "";
        let style = "";
        let style2 = "";
        let update = "";
        if (row.result == '#') {
            res = "Ball Running";
            id = "currentBowl";
            style = 'style="color:#fff; font-weight:bold;"';
            style2 = 'style="color:#fff; font-weight:bold;"';
        } else if (row.result == 6) {
            style = 'style="color:#00675d; font-weight:bold; font-size: 28px;"';
            style2 = 'style="color:#000;font-weight:bold; "';
        } else if (row.result == 4) {
            style = 'style="color:#0017ff; font-weight:bold; font-size: 28px"';
            style2 = 'style="color:#000;font-weight:bold; "';
        } else if (row.result == "Out") {
            style = 'style="color:#ff0000; font-weight:bold; font-size: 28px;"';
            style2 = 'style="color:#000;font-weight:bold; "';
        } else if (row.result == "Wicket") {
            style = 'style="color:#ff0000; font-weight:bold; font-size: 28px;"';
            style2 = 'style="color:#000;font-weight:bold; "';
        } else {
            style = 'style="color:#000; font-weight:bold;"';
            style2 = 'style="color:#000;font-weight:bold; "';
        }
        if (row.if_update == 1) {
            update = '<span class="label label-danger blink pull-right"> Updated </span>';
        }
        html += '<tr id="' + id + '">' +
            '<td class="text " data-title="Ball" ' + style2 + '>' + row.bal_no + '</td>' +
            '<td class="text " data-title="Result" ' + style + '>' + res + ' ' + update + '</td>' +
            '<td class="text " data-title="Result" style="font-size:13px;font-weight:bold">' + moment(row.last_update_time).format("DD-MMM-YY h:mm:ss A") + '</td>' +
            '</tr>';
    });
    html += '<tr><td colspan=3><button class="btn btn-default" onclick="window.open(\'/ball_running/' + match_id + '\',\'Ball Running\',\'_Blank\')">View All</button></td></tr>'
    html += '</tbody></table></div>';
    return html;
    }
    var data_layout = function(status, row){
        var table_row = "";
    switch (status) {
        case 0:
            status_string = 'Active';
            class_status = "text active-cell cell-text-color";
            var style_yes = "back-common-bg cell-text-color";
            if (row.match_yes != row.match_yes_temp) {
                style_yes = "back-update cell-text-color"
            }
            var style_no = "text lay-common-bg cell-text-color";
            if (row.match_no != row.match_no_temp) {
                style_no = "text lay-update cell-text-color"
            }
            var match_yes = 0;
            var match_no = 0;
            if (row.match_yes) {
                match_yes = row.match_yes.toFixed(2);
            }
            if (row.match_no) {
                match_no = row.match_no.toFixed(2);
            }
            var number_yes = row.number_yes.toFixed(2);
            var number_no = row.number_no.toFixed(2);
            if (row.market_type == 1) {
                var match_yes = 0;
                var match_no = 0;
                if (row.match_yes) {
                    match_yes = row.match_yes.toFixed(0);
                }
                if (row.match_no) {
                    match_no = row.match_no.toFixed(0);
                }
                number_yes = row.number_yes.toFixed(2);
                number_no = row.number_no.toFixed(2);
            }
            table_row += '<tr class="">' +
                '<td class="text cell-name" data-title="Fancy Market">' + row.match_name + '</td>' +
                '<td class="' + style_yes + '" data-title="Back All">' +
                '' + match_yes + '' +
                '<br> ' + number_yes +
                '</td>' +
                '<td class="' + style_no + '" data-title="Lay All">' +
                '' + match_no + '' +
                '<br> ' + number_no +
                '</td>' +
                '<td class="' + class_status + '" data-title="Status">' + status_string + '</td>' +
                '</tr>'

            break;
        case 1:
            status_string = 'Suspended';
            class_status = "text sespend-cell cell-text-color";
            var style_yes = "back-common-bg cell-text-color";
            if (row.match_yes != row.match_yes_temp) {
                style_yes = "back-update cell-text-color"
            }
            var style_no = "text lay-common-bg cell-text-color";
            if (row.match_no != row.match_no_temp) {
                style_no = "text lay-update cell-text-color"
            }
            var match_yes = 0;
            var match_no = 0;
            if (row.match_yes) {
                match_yes = row.match_yes.toFixed(2);
            }
            if (row.match_no) {
                match_no = row.match_no.toFixed(2);
            }
            var number_yes = row.number_yes.toFixed(2);
            var number_no = row.number_no.toFixed(2);
            if (row.market_type == 1) {
                var match_yes = 0;
                var match_no = 0;
                if (row.match_yes) {
                    match_yes = row.match_yes.toFixed(0);
                }
                if (row.match_no) {
                    match_no = row.match_no.toFixed(0);
                }
                number_yes = row.number_yes.toFixed(2);
                number_no = row.number_no.toFixed(2);
            }
            table_row += '<tr class="">' +
                '<td class="text cell-name" data-title="Fancy Market">' + row.match_name + '</td>' +
                '<td class="' + style_yes + '" data-title="Back All">' +
                '<span class="text-cell-sespend">' + match_yes + '</span>' +
                '<br> ' + number_yes +
                '</td>' +
                '<td class="' + style_no + '" data-title="Lay All">' +
                '<span class="text-cell-sespend">' + match_no + '</span>' +
                '<br> ' + number_no +
                '</td>' +
                '<td class="' + class_status + '" data-title="Status">' + status_string + '</td>' +
                '</tr>'
            break;
        case 2:
            status_string = 'Ball Running';
            class_status = "text sespend-cell cell-text-color";
            var style_yes = "back-common-bg cell-text-color";
            if (row.match_yes !== row.match_yes_temp) {
                style_yes = "back-update cell-text-color";
            }
            var style_no = "text lay-common-bg cell-text-color";
            if (row.match_no != row.match_no_temp) {
                style_no = "text lay-update cell-text-color"
            }
            var match_yes = 0;
            var match_no = 0;
            if (row.match_yes) {
                match_yes = row.match_yes.toFixed(2);
            }
            if (row.match_no) {
                match_no = row.match_no.toFixed(2);
            }
            var number_yes = row.number_yes.toFixed(2);
            var number_no = row.number_no.toFixed(2);
            if (row.market_type == 1) {
                var match_yes = 0;
                var match_no = 0;
                if (row.match_yes) {
                    match_yes = row.match_yes.toFixed(0);
                }
                if (row.match_no) {
                    match_no = row.match_no.toFixed(0);
                }
                number_yes = row.number_yes.toFixed(2);
                number_no = row.number_no.toFixed(2);
            }
            table_row += '<tr class="">' +
                '<td class="text cell-name" data-title="Fancy Market">' + row.match_name + '</td>' +
                '<td class="' + style_yes + '" data-title="Back All">' +
                '<span class="text-cell-sespend">' + match_yes + '</span>' +
                '<br> ' + number_yes +
                '</td>' +
                '<td class="' + style_no + '" data-title="Lay All">' +
                '<span class="text-cell-sespend">' + match_no + '</span>' +
                '<br> ' + number_no +
                '</td>' +
                '<td class="' + class_status + '" data-title="Status">' + status_string + '</td>' +
                '</tr>'
            break;
    }
    return table_row;
    }
    var getScore = function(match_id){
        $.post('/api/getScore', {
        match_id: match_id
    }, function(data) {

        let Jobj = JSON.parse(JSON.stringify(data));
        let tr = "";
        Jobj.forEach(row => {
            tr += '<tr>' +
                '<td>' + row.team + '</td>' +
                '<td>' + row.Total + '</td>' +
                '<td>' + row.Wickets + '</td>' +
                '</tr>'
        });
        $("#scoreboard").html(tr);
    });
    }
    
    return {
        init : init
    }
}();
index.init(match_id);