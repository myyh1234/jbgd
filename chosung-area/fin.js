var bg_color = ['#FFA8A8', '#85CFFC', '#E7E23D', '#93FF5E'];
var border_color = ['gold', 'silver', 'saddlebrown', 'black'];
var str_list = ['1st', '2nd', '3rd', '4th']
var point = [], lank = [];

function get_result(){
    var url_split = location.href.toString().split('?')[1].split('&');
    for (var i = 0; i < url_split.length; i++){
        point.push(parseInt(url_split[i].split('=')[1]));
        lank.push(i);
    }
    console.log(point);
    for (var i = 0; i < url_split.length; i++){
        var ma = i;
        console.log('start', i);
        for (var j = i; j < url_split.length; j++)
            if (point[lank[ma]] < point[lank[j]])
                ma = j;
        var tmp = lank[i];
        lank[i] = lank[ma];
        lank[ma] = tmp;
        console.log(lank);
    }
    build_result();
}

function build_result(){
    var con = document.getElementById('container');
    var nxt_lank = 1;
    for (var i = 0; i < lank.length; i++){
        var wrap = document.createElement('div');
        wrap.className = 'wrap_info';
        wrap.innerHTML = '<div class="user_lank">' + str_list[lank[i]] + '</div>'
        var now = document.createElement('div');
        now.style.backgroundColor = bg_color[lank[i]];
        if (i == 0){
            now.className = '1';
            wrap.innerHTML = '<div class="user_lank">1st</div>'
        }
        else if (point[lank[i]] == point[lank[i - 1]]){
            now.className = nxt_lank;
            wrap.innerHTML = '<div class="user_lank">' + str_list[nxt_lank - 1] + '</div>'
        }
        else{
            wrap.innerHTML = '<div class="user_lank">' + str_list[nxt_lank] + '</div>'
            now.className = ++nxt_lank;
        }
        now.style.margin = '10px';
        now.style.padding = '10px';
        now.style.border = '7px solid ' + border_color[now.className - 1];
        now.innerHTML = '<div class="info_txt"> PLAYER ' + (lank[i] + 1) + '</div><div class="info_txt">' + point[lank[i]] + '점</div>';
        wrap.appendChild(now);
        con.appendChild(wrap);
    }
}