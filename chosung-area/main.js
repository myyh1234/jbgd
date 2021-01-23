var board_size, player_cnt;
var chosung = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
var turn = 0 // 0 1 2 3
var area_color = ['#FF6A6A', '#4D91FF', '#FFCD04', '#75E62B']
var tmp_color = ['#FFA8A8', '#85CFFC', '#FFD949', '#93FF5E']
var start_x = -1, start_y = -1;
var chosen = [] // (x y) stack
function random_pick(arr){
    var idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}

function hover_(){
    var now_x = parseInt(this.id.split('-')[1]);
    var now_y = parseInt(this.id.split('-')[0]);
    if (!chosen.length)
        this.style.backgroundColor = tmp_color[turn];
    else {
        var diff_x = Math.abs(now_x - start_x);
        var diff_y = Math.abs(now_y - start_y);
        var dir;
        while (chosen.length > 1) {
            var tmp = chosen[chosen.length - 1];
            document.getElementById(tmp[1] + '-' + tmp[0]).style.backgroundColor = 'white';
            chosen.pop();
        }
        console.log(diff_x, diff_y);
        if (diff_x < diff_y){
            if (now_y > start_y)
                dir = 1;
            else
                dir = -1;
            for (var i = start_y + dir; i != now_y + dir; i += dir){
                chosen.push([start_x, i]);
                document.getElementById(i + '-' + start_x).style.backgroundColor = tmp_color[turn];
            }
        }
        else {
            if (now_x > start_x)
                dir = 1;
            else
                dir = -1;
            for (var i = start_x + dir; i != now_x + dir; i += dir){
                chosen.push([i, start_y]);
                document.getElementById(start_y + '-' + i).style.backgroundColor = tmp_color[turn];
            }
        }
    } 
}

function outout(){
    if (start_x == -1)
        this.style.backgroundColor = 'white';
    // start_x = -1;
    // start_y = -1;
}

function choose_start(){
    while (chosen.length){
        var tmp_x = chosen[chosen.length - 1][0]
        var tmp_y = chosen[chosen.length - 1][1];
        document.getElementById(tmp_y + '-' + tmp_x).style.backgroundColor = 'white';
        chosen.pop();
    }
    this.style.backgroundColor = tmp_color[turn];
    start_x = parseInt(this.id.split('-')[1]);
    start_y = parseInt(this.id.split('-')[0]);
    chosen.push([start_x, start_y]);
}

function select(){
    console.log('헤헤');
    if (start_x == -1){
        start_x = parseInt(this.id.split('-')[1]);
        start_y = parseInt(this.id.split('-')[0]);
    }
}

function parse(){
    var tmp = location.href.toString().split('?')[1].split('&');
    board_size = parseInt(tmp[0].split('=')[1]);
    player_cnt = parseInt(tmp[1].split('=')[1]);
    if (board_size < 8)
        board_size = 8;
    else if (board_size > 12)
        board_size = 12;
    if (player_cnt < 2)
        player_cnt = 2;
    else if (player_cnt > 4)
        player_cnt = 4;
    
    console.log(board_size, player_cnt);
}



function build_board(parent){
    for (var i = 0; i < board_size; i++){
        var now = document.createElement('div');
        now.id = 'row ' + i;
        now.setAttribute('class', 'row');
        parent.appendChild(now);
        for (var j = 0; j < board_size; j++){
            var newcell = document.createElement('div');
            newcell.id = i + '-' + j;
            newcell.setAttribute('class', 'cell')
            newcell.style.width = Math.floor(450 / board_size).toString() + 'px'; 
            newcell.style.height = Math.floor(450 / board_size).toString() + 'px';
            newcell.innerHTML = '<span id="' + i + ' ' + j + '">' + random_pick(chosung) + '</span>';
            newcell.onmouseover = hover_;
            newcell.onmouseout = outout;
            newcell.onmousedown = choose_start;
            newcell.onmouseup = select;
            now.appendChild(newcell);
        }

    }
}