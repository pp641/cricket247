
let oldback_lay2 = []
let oldmatch_odds2 = []
function check_data( Old_data, New_data)
    {
    
      check = false;
      if(Old_data.length == New_data.length)
      {
      // White
        var Old_length = Old_data.length;
        var New_length = New_data.length;
        
        // alert(' Old : '+ Old_length+ ' New : '+New_length)
        if(Old_length != New_length)
        {
          check = true;
        }
        else
        {
        for(i = 0;i <New_length;i++)
        {
          // alert(old_data.matchLayJson[i]);
          if(checkJsons(Old_data[i],New_data[i]))
          {
    
          }
          else
          {
            check = true;    
          }
        }
        }
      }
      else
      {
        check = true;
      }
      return check;
    }
    
    function checkJsons( otherJson, newJson)
    {
    
    
        var sameJson = true;
        $.each(newJson, function(key, value){
            if(otherJson[key] != newJson[key]) 
            {
                sameJson=false;
            } 
            
        });
        return sameJson;
    }
    

function getMatchodds(match_id, user_id) {
    try {
    $.post('/admin_panel/api/getMatch_data', { match_id: match_id, user_id: user_id })
    .then(function (data) {

        let obj = JSON.parse(JSON.stringify(data));
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;
        let table = "<div class='rg-container'>"
            + "<table class='rg-table' id='match_odds_table' summary='Hed'>"
            + "<thead>"
            + "<tr>"
            + "<th class='text '>Rank</th>"
            + "<th class='text '>Title</th>"
            + "<th class='text '>Type</th>"
            + "<th class='text '>Diff</th>"
            + "<th class='text '>B.ALL/No</th>"
            + "<th class='text '>L.All/Yes</th>"
            + "<th class='text '>Current Status</th>"
            + "<th class='text '>Action</th>"
            + "<th class='text '>+ / -</th>"
            + "<th class='number '>Action</th>"
            + "</tr>"
            + "</thead>"
            + "<tbody >";
        let tableend = "</tbody>"
            + "</table>"
            + "</div>"
        let layout_matchlayoff = getLayout(matchlayoff);
        let layout_match_match_odds = getLayout(match_match_odds);
        $("#matchodds").html(table + layout_matchlayoff + layout_match_match_odds + tableend);
        sortTable("match_odds_table");
        document.querySelectorAll(".perform").forEach((element) => {
            console.log("okdod", element)
            element.addEventListener("click", () => {
              $("#deleteConfirmationModal").modal("show");
              document
                .getElementById("confirmDelete")
                .addEventListener("click", function confirmDeleteHandler() {
                  let marketId = element.dataset.marketId;
                  console.log("market id: ", marketId);
                  delete_market(marketId);
                  $("#deleteConfirmationModal").modal("hide");
                  this.removeEventListener("click", confirmDeleteHandler);
                });
            });
          });
    });

    }catch(error){
        console.log("Error", error)
    }
}
async function gettransferMatchodds(match_id, user_id, index) {
    try {
    let lay = "";
    await $.post('/admin_panel/api/getMatch_data', { match_id: match_id, user_id: user_id }, async function (data) {

        let obj = JSON.parse(JSON.stringify(data));
        let user_data = obj.user_data;
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;
        let table = "<div class='rg-container' id='user" + user_data._id + "'>"
            + "<div>"
            + "<h4 class='pull-left'> User Name : " + user_data.username + "</h4><button onclick=\"transferremove('" + user_data._id + "'," + index + ")\" class='btn btn-sm btn-danger pull-right'><i class='fa fa-trash'></i></button>"
            + "<div class='clearfix''></div>"
            + "</div>"
            + "<hr>"
            + "<table class='rg-table' id='user" + user_data._id + "' summary='Hed'>"
            + "<thead>"
            + "<tr>"
            + "<th class='text '>Title</th>"
            + "<th class='text '>Type</th>"
            + "<th class='text '>Diff</th>"
            + "<th class='text '>BackALL/No</th>"
            + "<th class='text '>LayAll/Yes</th>"
            + "<th class='text '>Current Status</th>"
            + "<th class='text '>Status Action</th>"
            + "<th class='text '>Plus/Minus</th>"
            + "<th class='number '>Action</th>"
            + "</tr>"
            + "</thead>"
            + "<tbody >";
        let tableend = "</tbody>"
            + "</table>"
            + "</div>"
        let layout_matchlayoff = getLayout(matchlayoff);
        let layout_match_match_odds = getLayout(match_match_odds);
        lay += (table + layout_matchlayoff + layout_match_match_odds + tableend);

    });
    return lay;
} catch(error){
    console.log("Error" , error)
}
}





function getMatchodds_all2(match_id) {
    try 
    {
  const startTiming = performance.now();
  $.post("/admin_panel/api/getMatch_data_all", { match_id: match_id })
    .then((data) => {
      let { match_layoff, match_match_odds } = data;
      let chk1 = check_data(oldback_lay2, match_layoff);
      let chk2 = check_data(oldmatch_odds2, match_match_odds);
      if (chk1 || chk2) {
        oldback_lay2 = match_layoff;
        oldmatch_odds2 = match_match_odds;
        Promise.all([getLayout3(match_layoff), getLayout3(match_match_odds)])
          .then(([layout_matchlayoff, layout_match_match_odds]) => {
            $("#matchodds").html(
              `${layout_matchlayoff}${layout_match_match_odds}`
            );
            sortTable("match_odds_table");
            document.querySelectorAll(".perform").forEach((element) => {
              element.addEventListener("click", () => {
                $("#deleteConfirmationModal").modal("show");
                document
                  .getElementById("confirmDelete")
                  .addEventListener("click", function confirmDeleteHandler() {
                    let marketId = element.dataset.marketId;
                    console.log("market id: ", marketId);
                    delete_market(marketId);
                    window.location.reload();
                    $("#deleteConfirmationModal").modal("hide");
                    this.removeEventListener("click", confirmDeleteHandler);
                  });
              });
            });
          })
          .catch((err) => {
            console.error("Error in generating layout: ", err);
          });
      }
    })
    .catch((err) => {
      console.error("Error fetching match data: ", err);
    });

  const endTiming = performance.now();
  const totalTiming = endTiming - startTiming;
  console.log(`Total timing: ${totalTiming}`);
} catch(error){
    console.log("Error", error);
}

}

 



function getLayout(array) {

    try 
    {
    var match_row = '';
    array.forEach(row => {
        if (row) {
            let string_status = '';
            let status_btn = "";
            switch (row.active_status) {
                case 0: string_status = 'Active'
                    status_btn = "<button class='btn btn-sm btn-danger' title='Suspend' onClick=\"updateStatus('" + row._id + "',1)\"><i class='fa fa-times' aria-hidden='true'></i></button>"
                        + "<button class='btn btn-sm btn-danger' title='Ball Running' onClick=\"updateStatus('" + row._id + "',2)\"> <i class='fa fa-circle' aria-hidden='true'></i> </button>";
                    break;
                case 1: string_status = 'Suspended'
                    status_btn = ""
                        + ""
                        + "<button class='btn btn-sm btn-primary' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                    break;
                case 2: string_status = 'Ball Running'
                    status_btn = ""
                        + ""
                        + "<button class='btn btn-sm btn-success' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                    break;
            }
            let background = "background : #fff;color:#000";
            let type = 'B/L';
            var match_yes = 0;
            var match_no = 0;
            if (row.match_yes) {
                match_yes = row.match_yes.toFixed(2);
            }
            if (row.match_no) {
                match_no = row.match_no.toFixed(2);
            }
            if (row.market_type == 1) {
                background = 'background :#333;color:#fff';
                type = 'F/M';
                var match_yes = 0;
                var match_no = 0;
                if (row.match_yes) {
                    match_yes = row.match_yes.toFixed(0);
                }
                if (row.match_no) {
                    match_no = row.match_no.toFixed(0);
                }
            }
            let action_btn = '';
            switch (row.hide_and_show_status) {
                case 0: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                    + "<button class='btn btn-sm btn-danger' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" title='Hide'><i class='fa fa-eye-slash' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger perform' data-market-id='"+row._id+"'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                    break;
                case 1: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                    + "<button class='btn btn-sm btn-success' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" ><i class='fa fa-eye' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger perform' data-market-id='"+row._id+"'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                    break;
            }

            match_row += "<tr class='' style= '" + background + "'>"
                + "<td class='text rank" + row._id + "' data-title='Rank' id='rank" + row._id + "'>" + row.ranking + "</td>"

                // +"<td class='text ' data-title='Rank' id='match_id"+row._id+"'>"+"<input class='form-control' onkeyup='updateRanking(\""+row._id+"\",this,event)' value='"+row.ranking+"'>"+"</td>"
                + "<td class='text match_id" + row._id + "' data-title='Title' id='match_id" + row._id + "'>" + row.match_name + "</td>"
                + "<td class='text ' data-title='Type'>" + type + "</td>"
                + "<td class='text match_diff" + row._id + "' data-title='Diff' id='match_diff" + row._id + "'>" + row.diff + "</td>"
                + "<td class='text updateYes" + row._id + "' data-title='BackALL/Yes' id='updateYes" + row._id + "'>" + match_yes + "</td>"
                + "<td class='text updateNo" + row._id + "' data-title='LayAll/No' id='updateNo" + row._id + "'>" + match_no + "</td>"
                + "<td class='text currentStatus" + row._id + "' data-title='Current Status' id='currentStatus" + row._id + "'>" + string_status + "</td>"
                + "<td class='text btnChange" + row._id + "' data-title='Status Actions' id='btnChange" + row._id + "'>"
                + status_btn
                + "</td>"
                + "<td class='text ' data-title='Plus/Minus'>"
                + "<button class='btn btn-sm btn-primary' onclick=\"incpressed('" + row._id + "','" + row.market_type + "')\">+</button>"
                + "<button class='btn btn-sm btn-success' onclick=\"descpressed('" + row._id + "','" + row.market_type + "')\">-</button>"
                + "</td>"
                + "<td class='number showHide" + row._id + "' data-title='Action' id='showHide" + row._id + "'>"
                + action_btn
                + "</td>"
                + "</tr>"
        }
    });
    return match_row;
} catch(error){
    console.log("Error", error);
}

}



function sortTable(table_id) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(table_id);
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            //check if the two rows should switch place:
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
async function getLayout3(array) {

    try {
    var match_row = '';
    let users = await allotuser();
    array.forEach(row => {
        let string_status = '';
        let status_btn = "";
        switch (row.active_status) {
            case 0: string_status = 'Active'
                status_btn = "<button class='btn btn-sm btn-danger' title='Suspend' onClick=\"updateStatus('" + row._id + "',1)\"><i class='fa fa-times' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger' title='Ball Running' onClick=\"updateStatus('" + row._id + "',2)\"> <i class='fa fa-circle' aria-hidden='true'></i> </button>";
                break;
            case 1: string_status = 'Suspended'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-primary' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
            case 2: string_status = 'Ball Running'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-success' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
        }
        let background = "background : #fff;color:#000";
        let type = 'B/L';
        var match_yes = 0;
        match_no = 0;
        if (row.match_yes) {
            match_yes = row.match_yes.toFixed(2);
        }
        if (row.match_no) {
            match_no = row.match_no.toFixed(2);
        }

        if (row.market_type == 1) {
            background = 'background :#333;color:#fff';
            type = 'F/M';
            var match_yes = 0;
            var match_no = 0;
            if (row.match_yes) {
                match_yes = row.match_yes.toFixed(0);
            }
            if (row.match_no) {
                match_no = row.match_no.toFixed(0);
            }
        }
        let action_btn = '';

        switch (row.hide_and_show_status) {
            case 0: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-danger' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" title='Hide'><i class='fa fa-eye-slash' aria-hidden='true'></i></button>"
                + "<button class='btn btn-sm btn-danger perform' data-market-id='"+row._id+"'  ><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
            case 1: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-success' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" ><i class='fa fa-eye' aria-hidden='true'></i></button>"
                + "<button class='btn btn-sm btn-danger perform' data-market-id='"+row._id+"'  ><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
        }

        match_row += "<tr class='' style= '" + background + "'>"
            + "<td class='text rank" + row._id + "' data-title='Rank' id='rank" + row._id + "'>" + row.ranking + "</td>"
            + "<td class='text user_rank" + row._id + "' data-title='Rank' id='user_rank" + row._id + "'>" + row.user_rank + "</td>"
            + "<td class='text match_id" + row._id + "' data-title='Title' id='match_id" + row._id + "'>" + row.match_name + "</td>"
            + "<td class='text ' data-title='Type'>" + type + "</td>"
            + "<td class='text match_diff" + row._id + "' data-title='Diff' id='match_diff" + row._id + "'>" + row.diff + "</td>"
            + "<td class='text updateYes" + row._id + "' data-title='BackALL/No' id='updateYes" + row._id + "'>" + match_yes + "</td>"
            + "<td class='text updateNo" + row._id + "' data-title='LayAll/Yes' id='updateNo" + row._id + "'>" + match_no + "</td>"
            + "<td class='text currentStatus" + row._id + "' data-title='Current Status' id='currentStatus" + row._id + "'>" + string_status + "</td>"
            + "<td class='text btnChange" + row._id + "' data-title='Status Actions' id='btnChange" + row._id + "'>"
            + status_btn
            + "</td>"
            + "<td class='text ' data-title='Plus/Minus'>"
            + "<button class='btn btn-sm btn-primary' onclick=\"incpressed('" + row._id + "','" + row.market_type + "')\">+</button>"
            + "<button class='btn btn-sm btn-success' onclick=\"descpressed('" + row._id + "','" + row.market_type + "')\">-</button>"
            + "</td>"
            + "<td class='number showHide" + row._id + "' data-title='Action' id='showHide" + row._id + "'>"
            + action_btn
            + "</td>"
            + "<td>"
            + allot_list(users, row.alloted_user, row._id);
        +"</td>"
            + "</tr>"
    });
    return match_row;
} catch(error){
    console.log("Error", error)
}

}

function getMatchodds_all(match_id) {
    try {
    console.log("being called here 1")
    $.post('/admin_panel/api/getMatch_data_all', { match_id: match_id })
    .then(function (data) {

        let obj = JSON.parse(JSON.stringify(data));
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;

        let layout_matchlayoff = '';
        let layout_match_match_odds = '';
        getLayout_allot(matchlayoff).
        then(function (data) {
            layout_matchlayoff = data;
            return getLayout_allot(match_match_odds);
        }).then(function (data2) {
            layout_match_match_odds = data2;
            $("#matchodds").html(layout_matchlayoff + layout_match_match_odds);
            sortTable("match_odds_table");
                        document.querySelectorAll(".perform").forEach((element) => {
              element.addEventListener("click", () => {
                $("#deleteConfirmationModal").modal("show");
                document
                  .getElementById("confirmDelete")
                  .addEventListener("click", function confirmDeleteHandler() {
                    let marketId = element.dataset.marketId;
                    console.log("market idsss: ", marketId);
                    $("#deleteConfirmationModal").modal("hide");
                    this.removeEventListener("click", confirmDeleteHandler);
                  });
              });
            });
        });
        
    });
}catch(error){
    console.log("Error", error);
}
}

function allot_list(array, alloted_user, market_id) {
    let json_array = JSON.parse(array);
    let html = '';
    html += '<select onchange="allot_selected_users(\'' + market_id + '\', this.value)" class="form-control">'
    html += '<option>-- Select User --</option>';
    json_array.forEach(row => {
        if (alloted_user == row._id) {
            html += '<option selected value="' + row._id + '">' + row.username + '</option>';
        } else {
            html += '<option value="' + row._id + '">' + row.username + '</option>';
        }
    });
    html += '</select>';
    return html;
}

function allot_selected_users(market_id, users) {
    $.post('/admin_panel/api/update_users', { market_id: market_id, user_id: users }, function (data) {

    });
}
async function getLayout_allot(array) {

    try {
    var match_row = '';
    let users = await allotuser();
    array.forEach(row => {
        let string_status = '';
        let status_btn = "";
        switch (row.active_status) {
            case 0: string_status = 'Active'
                status_btn = "<button class='btn btn-sm btn-danger' title='Suspend' onClick=\"updateStatus('" + row._id + "',1)\"><i class='fa fa-times' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger' title='Ball Running' onClick=\"updateStatus('" + row._id + "',2)\"><i class='fa fa-circle' aria-hidden='true'></i> </button>";
                break;
            case 1: string_status = 'Suspended'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-primary' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
            case 2: string_status = 'Ball Running'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-success' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
        }
        let background = "background : #fff;color:#000";
        if (row.market_type == 1) {
            background = 'background :#333;color:#fff';
        }

        let action_btn = '';
        switch (row.hide_and_show_status) {
            case 0: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-danger' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" title='Hide'><i class='fa fa-eye-slash' aria-hidden='true'></i></button>"
                + "<button data-market-id = "+row._id+" class='btn btn-sm btn-danger perform' ><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
            case 1: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-success' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" ><i class='fa fa-eye' aria-hidden='true'></i></button>"
                + "<button data-market-id = "+row._id+" class='btn btn-sm btn-danger perform' ><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
        }

        match_row += "<tr class='' style= '" + background + "'>"
            + "<td class='text rank" + row._id + "' data-title='Rank' id='rank" + row._id + "'>" + row.ranking + "</td>"
            + "<td class='text user_rank" + row._id + "' data-title='Rank' id='user_rank" + row._id + "'>" + row.user_rank + "</td>"
            + "<td class='text match_id" + row._id + "' data-title='Title' id='match_id" + row._id + "'>" + row.match_name + "</td>"
            + "<td class='text currentStatus" + row._id + "' data-title='Current Status' id='currentStatus" + row._id + "'>" + string_status + "</td>"
            + "<td class='text btnChange" + row._id + "' data-title='Status Actions' id='btnChange" + row._id + "'>"
            + status_btn
            + "</td>"
            + "<td class='number showHide" + row._id + "' data-title='Action' id='showHide" + row._id + "'>"
            + action_btn
            + "</td>"
            + "<td>"
            + allot_list(users, row.alloted_user, row._id);
        +"</td>"
            + "</tr>"
    });

    return match_row;
}catch(error){
    console.log("Error", error);
}
}

async function allotuser() {

    let allotedUsers = localStorage.getItem('alloted_users');

    if(allotedUsers !== null){

        return allotedUsers;
    }else{

    let dt = '';
    await $.post('/admin_panel/api/getuserlist', function (data) {
        dt = JSON.stringify(data);
    });
    localStorage.setItem('alloted_users', dt);
    return dt;
     }
}

function incpressed(market_id, type) {
    try {
    $.post('/admin_panel/api/incData', { market_id: market_id, type: type }, function (data) {

        let match_data_row = JSON.parse(JSON.stringify(data));
        var match_yes = match_data_row.match_yes.toFixed(2);
        var match_no = match_data_row.match_no.toFixed(2);
        if (match_data_row.market_type == 1) {
            match_yes = match_data_row.match_yes.toFixed(0);
            match_no = match_data_row.match_no.toFixed(0);
        }
        $('.updateYes' + market_id).html(match_yes);
        $('.updateNo' + market_id).html(match_no);
    });
} catch(error){
    console.log("Error " , error);
}
}

function delete_market(market_id) {
        $.post('/admin_panel/api/delete_market', { market_id: market_id }, function (data) {
            refresh_status();
            getMarketLink(match_id, user_id);
            window.location.reload();
        });
}

function delete_market2(market_id) {
    $.post('/admin_panel/api/delete_market', { market_id: market_id }, function (data) {
    });
}

function descpressed(market_id, type) {
    $.post('/admin_panel/api/descData', { market_id: market_id, type: type }, function (data) {

        let match_data_row = JSON.parse(JSON.stringify(data));
        var match_yes = match_data_row.match_yes.toFixed(2);
        var match_no = match_data_row.match_no.toFixed(2);
        if (match_data_row.market_type == 1) {
            match_yes = match_data_row.match_yes.toFixed(0);
            match_no = match_data_row.match_no.toFixed(0);
        }
        $('.updateYes' + market_id).html(match_yes);
        $('.updateNo' + market_id).html(match_no);
    });
}

function updateStatus(market_id, type) {

    try {
    $.post('/admin_panel/api/updateStatus', { market_id: market_id, type: type }, function (data) {
        let match_data_row = JSON.parse(JSON.stringify(data));
        let status_btn = "";
        switch (match_data_row.active_status) {
            case 0: string_status = 'Active'
                status_btn = "<button class='btn btn-sm btn-danger' title='Suspend' onClick=\"updateStatus('" + match_data_row._id + "',1)\"><i class='fa fa-times' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger' title='Ball Running' onClick=\"updateStatus('" + match_data_row._id + "',2)\"> <i class='fa fa-circle' aria-hidden='true'></i> </button>";
                break;
            case 1: string_status = 'Suspended'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-primary' title='Active' onClick=\"updateStatus('" + match_data_row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
            case 2: string_status = 'Ball Running'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-success' title='Active' onClick=\"updateStatus('" + match_data_row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
        }
        $('.currentStatus' + market_id).html(string_status);
        $('.btnChange' + market_id).html(status_btn);
        // $('.updateNo'+market_id).html(match_data_row.match_no);
    });

}
catch(error){
    console.log("Error", error);
}

}

function showhide(market_id, type) {
    $.post('/admin_panel/api/showhide', { market_id: market_id, type: type }, function (data) {
        let match_data_row = JSON.parse(JSON.stringify(data));
        let action_btn = '';
        switch (match_data_row.hide_and_show_status) {
            case 0: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + match_data_row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-danger' onclick=\"showhide('" + match_data_row._id + "'," + match_data_row.hide_and_show_status + ")\" title='Hide'><i class='fa fa-eye-slash' aria-hidden='true'></i></button>"
                + "<button class='btn btn-sm btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
            case 1: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + match_data_row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-success' onclick=\"showhide('" + match_data_row._id + "'," + match_data_row.hide_and_show_status + ")\" ><i class='fa fa-eye' aria-hidden='true'></i></button>"
                + "<button class='btn btn-sm btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
        }
        $('.showHide' + market_id).html(action_btn);
    })
}



function getModelInfo(market_id) {
    $.post('/admin_panel/api/getModelInfo', { market_id: market_id }, function (data) {
        let match_data_row = JSON.parse(JSON.stringify(data));
        $('#market_id').val(market_id)
        $('#update_title').val(match_data_row.match_name);
        $('#update_Diff').val(match_data_row.diff)
        var match_yes = 0;
        var match_no = 0;
        if (match_data_row.match_yes) {
            match_yes = match_data_row.match_yes.toFixed(2);
        }
        if (match_data_row.match_no) {
            match_no = match_data_row.match_no.toFixed(2);
        }
        switch (match_data_row.market_type) {
            case 0:
                $('#edit_modal_title').html('Back Lay Edit')
                var match_yes = 0;
                var match_no = 0;
                if (match_data_row.match_yes) {
                    match_yes = match_data_row.match_yes.toFixed(2);
                }
                if (match_data_row.match_no) {
                    match_no = match_data_row.match_no.toFixed(2);
                }
                $('#update_backAll').val(match_yes)
                $('#update_layAll').val(match_no)
                $('#numbackLay').val(match_data_row.number_yes.toFixed(2))
                $('#numbLayAll').val(match_data_row.number_no.toFixed(2))
                break;
            case 1:
                $('#edit_modal_title').html('Fancy Market Edit')
                var match_yes = 0;
                var match_no = 0;
                if (match_data_row.match_yes) {
                    match_yes = match_data_row.match_yes.toFixed(0);
                }
                if (match_data_row.match_no) {
                    match_no = match_data_row.match_no.toFixed(0);
                }
                $('#update_backAll').val(match_yes)
                $('#update_layAll').val(match_no)
                $('#numbackLay').val(match_data_row.number_yes.toFixed(2))
                $('#numbLayAll').val(match_data_row.number_no.toFixed(2))
                break;
        }



        $('#update_layAll_rank').val(match_data_row.ranking)
        $('#user_rank').val(match_data_row.user_rank)
        $('#myModal').modal();
    })
}

function updateLayOdds(form) {
    let market_id = $('#market_id').val()
    let match_title = $('#update_title').val();
    let update_Diff = $('#update_Diff').val()
    let update_backAll = $('#update_backAll').val()
    let update_layAll = $('#update_layAll').val()
    let numbackLay = $('#numbackLay').val()
    let numbLayAll = $('#numbLayAll').val()
    let update_layAll_rank = $('#update_layAll_rank').val()
    let user_rank = $('#user_rank').val()
    value = {}
    value.market_id = market_id;
    value.match_title = match_title;
    value.up_diff = update_Diff;
    value.match_yes = update_backAll;
    value.match_no = update_layAll;
    value.number_yes = numbackLay;
    value.number_no = numbLayAll;
    value.ranking = update_layAll_rank;
    value.user_rank = user_rank;
    $.post('/admin_panel/api/updatedata', value, function (data) {
        var match_data_row = JSON.parse(JSON.stringify(data));

        $('#match_id' + market_id).html(match_data_row.match_name);
        $('#match_diff' + market_id).html(match_data_row.diff);
        var match_yes = match_data_row.match_yes.toFixed(2);
        var match_no = match_data_row.match_no.toFixed(2);
        if (match_data_row.market_type == 1) {
            match_yes = match_data_row.match_yes.toFixed(0);
            match_no = match_data_row.match_no.toFixed(0);
        }
        $('.updateYes' + market_id).html(match_yes);
        $('.updateNo' + market_id).html(match_no);
        $('#myModal').modal('hide');
        $('.rank' + market_id).html(match_data_row.ranking);
        $('.user_rank' + market_id).html(match_data_row.user_rank);
        let string_status = '';
        let status_btn = "";
        switch (match_data_row.active_status) {
            case 0: string_status = 'Active'
                status_btn = "<button class='btn btn-sm btn-danger' title='Suspend' onClick=\"updateStatus('" + match_data_row._id + "',1)\"><i class='fa fa-times' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger' title='Ball Running' onClick=\"updateStatus('" + match_data_row._id + "',2)\"> <i class='fa fa-circle' aria-hidden='true'></i> </button>";
                break;
            case 1: string_status = 'Suspended'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-primary' title='Active' onClick=\"updateStatus('" + match_data_row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
            case 2: string_status = 'Ball Running'
                status_btn = ""
                    + ""
                    + "<button class='btn btn-sm btn-success' title='Active' onClick=\"updateStatus('" + match_data_row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                break;
        }
        $('.currentStatus' + market_id).html(string_status);
        $('.btnChange' + market_id).html(status_btn);

        let action_btn = '';
        switch (match_data_row.hide_and_show_status) {
            case 0: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + match_data_row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-danger' onclick=\"showhide('" + match_data_row._id + "'," + match_data_row.hide_and_show_status + ")\" title='Hide' ><i class='fa fa-eye-slash' aria-hidden='true'></i></button>"
                + "<button class='btn btn-sm btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
            case 1: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + match_data_row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                + "<button class='btn btn-sm btn-success' onclick=\"showhide('" + match_data_row._id + "'," + match_data_row.hide_and_show_status + ")\" ><i class='fa fa-eye' aria-hidden='true'></i></button>"
                + "<button class='btn btn-sm btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                break;
        }
        $('.showHide' + market_id).html(action_btn);
        sortTable("match_odds_table");
    });
    return false;
}

function updateAllStatus(type) {
    let match_id_val = match_id;
    $.post('/admin_panel/api/updateStatusAll', { match_id: match_id_val, type: type }, function (data) {
        $.get('/admin_panel/api/refresh_status');
    });

}

function updatehideshow(type) {
    let match_id_val = match_id;
    $.post('/admin_panel/api/updatehideshowAll', { match_id: match_id_val, type: type })
    .then(function () {
        $.get('/admin_panel/api/refresh_showhide');
    });
}

async function updateAllStatus_user(type, user_id) {
    let match_id_val = match_id;
    await $.post('/admin_panel/api/updateStatusAll_user', { match_id: match_id_val, type: type, user_id: user_id }, function (data) {});
}

async function updatehideshow_user(type, user_id) {
    let match_id_val = match_id;
    await $.post('/admin_panel/api/updatehideshowAll_user', { match_id: match_id_val, type: type, user_id: user_id }, function (data) {});
}



function refresh_showhide() {
    $.post('/admin_panel/api/getallData', { match_id: match_id, user_id: user_id })
    .then(function (data) {
        let mar_json = JSON.parse(JSON.stringify(data));
        mar_json.forEach(row => {
            let status_btn = "";
            let market_id = row._id;
            let action_btn = '';
            switch (row.hide_and_show_status) {
                case 0: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                    + "<button class='btn btn-sm btn-danger' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" title='Hide'><i class='fa fa-eye-slash' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                    break;
                case 1: action_btn = "<button class='btn btn-sm btn-success' onclick=\"getModelInfo('" + row._id + "')\"> <i class='fa fa-pencil' aria-hidden='true'></i> </button>"
                    + "<button class='btn btn-sm btn-success' onclick=\"showhide('" + row._id + "'," + row.hide_and_show_status + ")\" ><i class='fa fa-eye' aria-hidden='true'></i></button>"
                    + "<button class='btn btn-sm btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button>";
                    break;
            }
            $('.showHide' + market_id).html(action_btn);
        });
    });
}

function refresh_status() {
    $.post('/admin_panel/api/getallData', { match_id: match_id, user_id: user_id })
    .then(function (data) {
        let mar_json = JSON.parse(JSON.stringify(data));
        mar_json.forEach(row => {
            let status_btn = "";
            let market_id = row._id;
            switch (row.active_status) {

                case 0: string_status = 'Active'
                    status_btn = "<button class='btn btn-sm btn-danger' title='Suspend' onClick=\"updateStatus('" + row._id + "',1)\"><i class='fa fa-times' aria-hidden='true'></i></button>"
                        + "<button class='btn btn-sm btn-danger' title='Ball Running' onClick=\"updateStatus('" + row._id + "',2)\"> <i class='fa fa-circle' aria-hidden='true'></i> </button>";
                    break;
                case 1: string_status = 'Suspended'
                    status_btn = ""
                        + ""
                        + "<button class='btn btn-sm btn-primary' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                    break;
                case 2: string_status = 'Ball Running'
                    status_btn = ""
                        + ""
                        + "<button class='btn btn-sm btn-success' title='Active' onClick=\"updateStatus('" + row._id + "',0)\"> <i class='fa fa-check-square' aria-hidden='true'></i> </button>";
                    break;
            }
            $('.currentStatus' + market_id).html(string_status);
            $('.btnChange' + market_id).html(status_btn);
        });
    });
}