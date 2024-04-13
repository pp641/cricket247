function getMatchodds(match_id,user_id){
    $.post('/admin_panel/api/getMatch_data',{match_id : match_id, user_id : user_id},function(data){
        
        let obj = JSON.parse(JSON.stringify(data));
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;
        let table = "<div class='rg-container'>"
        +"<table class='rg-table' summary='Hed'>"
        +   "<thead>"
        +       "<tr>"
        +           "<th class='text '>Title</th>"
        +           "<th class='text '>Type</th>"
        +           "<th class='text '>Diff</th>"
        +           "<th class='text '>BackALL/Yes</th>"
        +           "<th class='text '>LayAll/No</th>"
        +           "<th class='text '>Current Status</th>"
        +           "<th class='text '>Status Action</th>"
        +           "<th class='text '>Plus/Minus</th>"
        +           "<th class='number '>Action</th>"
        +       "</tr>"
        +   "</thead>"
        +   "<tbody >";
        let tableend = "</tbody>"
        +"</table>"
        +"</div>"
        let layout_matchlayoff = getLayout(matchlayoff);
        let layout_match_match_odds = getLayout(match_match_odds);
        $("#matchodds").html(table+layout_matchlayoff+layout_match_match_odds+tableend);
    });
}
async function gettransferMatchodds(match_id,user_id,index){
    let lay = "";
    await $.post('/admin_panel/api/getMatch_data',{match_id : match_id, user_id : user_id}, async function(data){
        
        let obj = JSON.parse(JSON.stringify(data));
        let user_data = obj.user_data;
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;
        let table = "<div class='rg-container' id='user"+user_data._id+"'>"
        +"<div>"
        +"<h4 class='pull-left'> User Name : "+user_data.username+"</h4><button onclick=\"transferremove('"+user_data._id+"',"+index+")\" class='btn btn-danger pull-right'><i class='fa fa-trash'></i></button>"
        +"<div class='clearfix''></div>"
        +"</div>"
        +"<hr>"
        +"<table class='rg-table' summary='Hed'>"
        +   "<thead>"
        +       "<tr>"
        +           "<th class='text '>Title</th>"
        +           "<th class='text '>Type</th>"
        +           "<th class='text '>Diff</th>"
        +           "<th class='text '>BackALL/Yes</th>"
        +           "<th class='text '>LayAll/No</th>"
        +           "<th class='text '>Current Status</th>"
        +           "<th class='text '>Status Action</th>"
        +           "<th class='text '>Plus/Minus</th>"
        +           "<th class='number '>Action</th>"
        +       "</tr>"
        +   "</thead>"
        +   "<tbody >";
        let tableend = "</tbody>"
        +"</table>"
        +"</div>"
        let layout_matchlayoff = getLayout(matchlayoff);
        let layout_match_match_odds = getLayout(match_match_odds);
        lay += (table+layout_matchlayoff+layout_match_match_odds+tableend);
    });
    return lay;
}



function getMatchodds_all2(match_id){
    $.post('/admin_panel/api/getMatch_data_all',{match_id : match_id},function(data){
        
        let obj = JSON.parse(JSON.stringify(data));
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;
        let chk1 = check_data(oldback_lay, matchlayoff);
        let chk2 = check_data(oldmatch_odds, match_match_odds);
        if(chk1 == true || chk2 == true){
            oldback_lay = matchlayoff;
            oldmatch_odds = match_match_odds;
            let layout_matchlayoff = getLayout(matchlayoff);
            let layout_match_match_odds = getLayout(match_match_odds);
            $("#matchodds").html(layout_matchlayoff+layout_match_match_odds);
        }
    });
}


function getLayout(array){
    var match_row = '';
    array.forEach(row => {
        let string_status = '';
        let status_btn = "";
        switch(row.active_status){
            case 0:string_status = 'Active'
            status_btn = "<button class='btn btn-danger' title='Suspend' onClick=\"updateStatus('"+row._id+"',1)\">X</button>"
            +"<button class='btn btn-danger' title='Ball Running' onClick=\"updateStatus('"+row._id+"',2)\">O</button>";
            break;
            case 1:string_status = 'Suspended'
            status_btn = ""
            +""
            +"<button class='btn btn-primary' title='Active' onClick=\"updateStatus('"+row._id+"',0)\">*</button>";
            break;
            case 2: string_status = 'Ball Running'
            status_btn = ""
            +""
            +"<button class='btn btn-success' title='Active' onClick=\"updateStatus('"+row._id+"',0)\">*</button>";
            break;
        }
        let background ="background : #fff;color:#000";
        let type = 'B/L';
        var match_yes = row.match_yes.toFixed(2);
        var match_no =row.match_no.toFixed(2);
        if(row.market_type == 1){
            background = 'background :#333;color:#fff';
            type = 'F/M';
            match_yes = row.match_yes.toFixed(0);
            match_no =row.match_no.toFixed(0);
        }
        let action_btn = '';
        switch(row.hide_and_show_status){
            case 0: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+row._id+"')\">Edit</button>"
            +"<button class='btn btn-danger' onclick=\"showhide('"+row._id+"',"+row.hide_and_show_status+")\">Hide</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
            case 1: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+row._id+"')\">Edit</button>"
            +"<button class='btn btn-success' onclick=\"showhide('"+row._id+"',"+row.hide_and_show_status+")\" >Show</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
        }
        
        match_row +=  "<tr class='' style= '"+background+"'>"
    +"<td class='text ' data-title='Title' id='match_id"+row._id+"'>"+row.match_name+"</td>"
    +"<td class='text ' data-title='Type'>"+type+"</td>"
    +"<td class='text ' data-title='Diff' id='match_diff"+row._id+"'>"+row.diff+"</td>"
    +"<td class='text ' data-title='BackALL/Yes' id='updateYes"+row._id+"'>"+match_yes+"</td>"
    +"<td class='text ' data-title='LayAll/No' id='updateNo"+row._id+"'>"+match_no+"</td>"
    +"<td class='text ' data-title='Current Status' id='currentStatus"+row._id+"'>"+string_status+"</td>"
    +"<td class='text ' data-title='Status Actions' id='btnChange"+row._id+"'>"
    +status_btn
    +"</td>"
    +"<td class='text ' data-title='Plus/Minus'>"
    +"<button class='btn btn-primary' onclick=\"incpressed('"+row._id+"','"+row.market_type+"')\">+</button>"
    +"<button class='btn btn-success' onclick=\"descpressed('"+row._id+"','"+row.market_type+"')\">-</button>"
    +"</td>"
    +"<td class='number ' data-title='Action' id='showHide"+row._id+"'>"
    +action_btn
    +"</td>"
    +"</tr>"
    });
    return match_row;
    
}

function getMatchodds_all(match_id){
    $.post('/admin_panel/api/getMatch_data_all',{match_id : match_id},async function(data){
        
        let obj = JSON.parse(JSON.stringify(data));
        let matchlayoff = obj.match_layoff;
        let match_match_odds = obj.match_match_odds;
        
        let layout_matchlayoff = await getLayout_allot(matchlayoff);
        let layout_match_match_odds = await getLayout_allot(match_match_odds);
        $("#matchodds").html(layout_matchlayoff+layout_match_match_odds);
    });
}

function allot_list(array, alloted_user,market_id){
    let json_array = JSON.parse(array);
    let html = '';
    html += '<select onchange="allot_selected_users(\''+market_id+'\', this.value)" class="form-control">'
    html += '<option>-- Select User --</option>';
    json_array.forEach(row => {
        if(alloted_user == row._id){
            html += '<option selected value="'+row._id+'">'+row.username+'</option>';
        }else{
            html += '<option value="'+row._id+'">'+row.username+'</option>';
        }
    });
    html += '</select>';
    return html;
}

function allot_selected_users(market_id, users){
    $.post('/admin_panel/api/update_users',{market_id : market_id, user_id : users},function(data){

    });
}
async function getLayout_allot(array){
    var match_row = '';
    let users = await allotuser();
    array.forEach(row => {
        let string_status = '';
        let status_btn = "";
        switch(row.active_status){
            case 0:string_status = 'Active'
            status_btn = "<button class='btn btn-danger' title='Suspend' onClick=\"updateStatus('"+row._id+"',1)\">X</button>"
            +"<button class='btn btn-danger' title='Ball Running' onClick=\"updateStatus('"+row._id+"',2)\">O</button>";
            break;
            case 1:string_status = 'Suspended'
            status_btn = ""
            +""
            +"<button class='btn btn-primary' title='Active' onClick=\"updateStatus('"+row._id+"',0)\">*</button>";
            break;
            case 2: string_status = 'Ball Running'
            status_btn = ""
            +""
            +"<button class='btn btn-success' title='Active' onClick=\"updateStatus('"+row._id+"',0)\">*</button>";
            break;
        }
        let background ="background : #fff;color:#000";
        if(row.market_type == 1){
            background = 'background :#333;color:#fff';
        }
        
        let action_btn = '';
        switch(row.hide_and_show_status){
            case 0: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+row._id+"')\">Edit</button>"
            +"<button class='btn btn-danger' onclick=\"showhide('"+row._id+"',"+row.hide_and_show_status+")\">Hide</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
            case 1: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+row._id+"')\">Edit</button>"
            +"<button class='btn btn-success' onclick=\"showhide('"+row._id+"',"+row.hide_and_show_status+")\" >Show</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
        }
        
        match_row +=  "<tr class='' style= '"+background+"'>"
    +"<td class='text ' data-title='Title' id='match_id"+row._id+"'>"+row.match_name+"</td>"
    +"<td class='text ' data-title='Current Status' id='currentStatus"+row._id+"'>"+string_status+"</td>"
    +"<td class='text ' data-title='Status Actions' id='btnChange"+row._id+"'>"
    +status_btn
    +"</td>"
    +"<td class='number ' data-title='Action' id='showHide"+row._id+"'>"
    +action_btn
    +"</td>"
    +"<td>"
    +allot_list(users, row.alloted_user,row._id);
    +"</td>"
    +"</tr>"
    });
    
    return match_row;
}

async function allotuser(){
    let dt = '';
    await $.post('/admin_panel/api/getuserlist',function(data){
        dt =  JSON.stringify(data);
    });
    return dt;
}

function incpressed(market_id, type){
    $.post('/admin_panel/api/incData',{market_id:market_id, type:type},function(data){
        
        let match_data_row = JSON.parse(JSON.stringify(data));
        var match_yes = match_data_row.match_yes.toFixed(2);
        var match_no =match_data_row.match_no.toFixed(2);
        if(match_data_row.market_type == 1){
            match_yes = match_data_row.match_yes.toFixed(0);
            match_no =match_data_row.match_no.toFixed(0);
        }
        $('#updateYes'+market_id).html(match_yes);
        $('#updateNo'+market_id).html(match_no);
    });
}

function descpressed(market_id, type){
    $.post('/admin_panel/api/descData',{market_id:market_id, type:type},function(data){
        
        let match_data_row = JSON.parse(JSON.stringify(data));
        var match_yes = match_data_row.match_yes.toFixed(2);
        var match_no =match_data_row.match_no.toFixed(2);
        if(match_data_row.market_type == 1){
            match_yes = match_data_row.match_yes.toFixed(0);
            match_no =match_data_row.match_no.toFixed(0);
        }
        $('#updateYes'+market_id).html(match_yes);
        $('#updateNo'+market_id).html(match_no);
    });
}

function updateStatus(market_id, type){
    $.post('/admin_panel/api/updateStatus',{market_id:market_id, type:type},function(data){ 
        let match_data_row = JSON.parse(JSON.stringify(data));
        let status_btn = "";
        switch(match_data_row.active_status){
            case 0:string_status = 'Active'
            status_btn = "<button class='btn btn-danger' title='Suspend' onClick=\"updateStatus('"+match_data_row._id+"',1)\">X</button>"
            +"<button class='btn btn-danger' title='Ball Running' onClick=\"updateStatus('"+match_data_row._id+"',2)\">O</button>";
            break;
            case 1:string_status = 'Suspended'
            status_btn = ""
            +""
            +"<button class='btn btn-primary' title='Active' onClick=\"updateStatus('"+match_data_row._id+"',0)\">*</button>";
            break;
            case 2: string_status = 'Ball Running'
            status_btn = ""
            +""
            +"<button class='btn btn-success' title='Active' onClick=\"updateStatus('"+match_data_row._id+"',0)\">*</button>";
            break;
        }
        $('#currentStatus'+market_id).html(string_status);
        $('#btnChange'+market_id).html(status_btn);
        // $('#updateNo'+market_id).html(match_data_row.match_no);
    });
}

function showhide(market_id, type){
    $.post('/admin_panel/api/showhide',{market_id:market_id, type:type},function(data){
        let match_data_row = JSON.parse(JSON.stringify(data));
        let action_btn = '';
        switch(match_data_row.hide_and_show_status){
            case 0: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+match_data_row._id+"')\">Edit</button>"
            +"<button class='btn btn-danger' onclick=\"showhide('"+match_data_row._id+"',"+match_data_row.hide_and_show_status+")\">Hide</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
            case 1: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+match_data_row._id+"')\">Edit</button>"
            +"<button class='btn btn-success' onclick=\"showhide('"+match_data_row._id+"',"+match_data_row.hide_and_show_status+")\" >Show</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
        }
        $('#showHide'+market_id).html(action_btn);
    })
}

function getModelInfo(market_id){
    $.post('/admin_panel/api/getModelInfo',{market_id:market_id},function(data){
        console.log(data);
        let match_data_row = JSON.parse(JSON.stringify(data));
        $('#market_id').val(market_id)
        $('#update_title').val(match_data_row.match_name);
        $('#update_Diff').val(match_data_row.diff)
        switch(match_data_row.market_type){
            case 0: 
                $('#edit_modal_title').html('Back Lay Edit')
                $('#update_backAll').val(match_data_row.match_yes.toFixed(2))
                $('#update_layAll').val(match_data_row.match_no.toFixed(2))
                $('#numbackLay').val(match_data_row.number_yes.toFixed(2))
                $('#numbLayAll').val(match_data_row.number_no.toFixed(2))
            break;
            case 1: 
                $('#edit_modal_title').html('Fancy Market Edit')
                $('#update_backAll').val(match_data_row.match_yes.toFixed(0))
                $('#update_layAll').val(match_data_row.match_no.toFixed(0))
                $('#numbackLay').val(match_data_row.number_yes.toFixed(0))
                $('#numbLayAll').val(match_data_row.number_no.toFixed(0))
            break;
        }
        
        
        
        $('#update_layAll_rank').val(match_data_row.ranking)
        $('#myModal').modal();
    })
}

function updateLayOdds(form){
    let market_id = $('#market_id').val()
       let match_title = $('#update_title').val();
       let update_Diff = $('#update_Diff').val()
       let update_backAll = $('#update_backAll').val()
       let update_layAll = $('#update_layAll').val()
       let numbackLay = $('#numbackLay').val()
       let numbLayAll = $('#numbLayAll').val()
       let update_layAll_rank = $('#update_layAll_rank').val()
       value = {}
       value.market_id = market_id;
       value.match_title = match_title;
       value.up_diff = update_Diff;
       value.match_yes = update_backAll;
       value.match_no = update_layAll;
       value.number_yes = numbackLay;
       value.number_no = numbLayAll;
       value.ranking = update_layAll_rank;
       $.post('/admin_panel/api/updatedata',value,function(data){
        var match_data_row = JSON.parse(JSON.stringify(data));

        $('#match_id'+market_id).html(match_data_row.match_name);
        $('#match_diff'+market_id).html(match_data_row.diff);
        var match_yes = match_data_row.match_yes.toFixed(2);
        var match_no =match_data_row.match_no.toFixed(2);
        if(match_data_row.market_type == 1){
            match_yes = match_data_row.match_yes.toFixed(0);
            match_no =match_data_row.match_no.toFixed(0);
        }
        $('#updateYes'+market_id).html(match_yes);
        $('#updateNo'+market_id).html(match_no);
            $('#myModal').modal('hide');
      

       let status_btn = "";
        switch(match_data_row.active_status){
            case 0:string_status = 'Active'
            status_btn = "<button class='btn btn-danger' title='Suspend' onClick=\"updateStatus('"+match_data_row._id+"',1)\">X</button>"
            +"<button class='btn btn-danger' title='Ball Running' onClick=\"updateStatus('"+match_data_row._id+"',2)\">O</button>";
            break;
            case 1:string_status = 'Suspended'
            status_btn = ""
            +""
            +"<button class='btn btn-primary' title='Active' onClick=\"updateStatus('"+match_data_row._id+"',0)\">*</button>";
            break;
            case 2: string_status = 'Ball Running'
            status_btn = ""
            +""
            +"<button class='btn btn-success' title='Active' onClick=\"updateStatus('"+match_data_row._id+"',0)\">*</button>";
            break;
        }
        $('#currentStatus'+market_id).html(string_status);
        $('#btnChange'+market_id).html(status_btn);

       let action_btn = '';
        switch(match_data_row.hide_and_show_status){
            case 0: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+match_data_row._id+"')\">Edit</button>"
            +"<button class='btn btn-danger' onclick=\"showhide('"+match_data_row._id+"',"+match_data_row.hide_and_show_status+")\">Hide</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
            case 1: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+match_data_row._id+"')\">Edit</button>"
            +"<button class='btn btn-success' onclick=\"showhide('"+match_data_row._id+"',"+match_data_row.hide_and_show_status+")\" >Show</button>"
            +"<button class='btn btn-danger'>Delete</button>";
            break;
        }
        $('#showHide'+market_id).html(action_btn);
    });
       return false;
}

function updateAllStatus(type){
    let match_id_val = match_id;
    $.post('/admin_panel/api/updateStatusAll',{ match_id : match_id_val, type : type },function(data){

            $.get('/admin_panel/api/refresh_status');
        });
    
}

function updatehideshow(type){
    let match_id_val = match_id;
    $.post('/admin_panel/api/updatehideshowAll',{ match_id : match_id_val, type : type },function(data){

            $.get('/admin_panel/api/refresh_showhide');
        });
}



function refresh_showhide(){
    $.post('/admin_panel/api/getallData',{match_id : match_id, user_id : user_id},function(data){
        let mar_json = JSON.parse(JSON.stringify(data));
        mar_json.forEach(row => {
            let status_btn = "";
            let market_id = row._id;
            let action_btn = '';
            switch(row.hide_and_show_status){
                case 0: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+row._id+"')\">Edit</button>"
                +"<button class='btn btn-danger' onclick=\"showhide('"+row._id+"',"+row.hide_and_show_status+")\">Hide</button>"
                +"<button class='btn btn-danger'>Delete</button>";
                break;
                case 1: action_btn = "<button class='btn btn-success' onclick=\"getModelInfo('"+row._id+"')\">Edit</button>"
                +"<button class='btn btn-success' onclick=\"showhide('"+row._id+"',"+row.hide_and_show_status+")\" >Show</button>"
                +"<button class='btn btn-danger'>Delete</button>";
                break;
            }
            $('#showHide'+market_id).html(action_btn);
        });
    });
}

function refresh_status(){
    $.post('/admin_panel/api/getallData',{match_id : match_id, user_id : user_id},function(data){
        let mar_json = JSON.parse(JSON.stringify(data));
        mar_json.forEach(row => {
            let status_btn = "";
            let market_id = row._id;
        switch(row.active_status){
            
            case 0:string_status = 'Active'
            status_btn = "<button class='btn btn-danger' title='Suspend' onClick=\"updateStatus('"+row._id+"',1)\">X</button>"
            +"<button class='btn btn-danger' title='Ball Running' onClick=\"updateStatus('"+row._id+"',2)\">O</button>";
            break;
            case 1:string_status = 'Suspended'
            status_btn = ""
            +""
            +"<button class='btn btn-primary' title='Active' onClick=\"updateStatus('"+row._id+"',0)\">*</button>";
            break;
            case 2: string_status = 'Ball Running'
            status_btn = ""
            +""
            +"<button class='btn btn-success' title='Active' onClick=\"updateStatus('"+row._id+"',0)\">*</button>";
            break;
        }
        $('#currentStatus'+market_id).html(string_status);
        $('#btnChange'+market_id).html(status_btn);
    });
})
}