var board_size, player_cnt;
var chosung = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', ' '];
var chosung_idx_info = [0, 14, 1, 2, 14, 3, 4, 5, 14, 6, 14, 7, 8, 14, 9, 10, 11, 12, 13];
var hangul_start = '가'.charCodeAt(0), hangul_end = '힣'.charCodeAt(0);
var turn = 0 // 0 1 2 3
// var area_color = ['#FF6A6A', '#4D91FF', '#FFCD04', '#75E62B']
// var tmp_color = ['#FFA8A8', '#85CFFC', '#FFD949', '#93FF5E']
var user = [
    {area_color: '#FF6A6A', tmp_color: '#FFA8A8', point: 0, user_object: document.createElement('div')},
    {area_color: '#4D91FF', tmp_color: '#85CFFC', point: 0, user_object: document.createElement('div')},
    {area_color: '#FFCA18', tmp_color: '#F8F10C', point: 0, user_object: document.createElement('div')},
    {area_color: '#48D618', tmp_color: '#8FF558', point: 0, user_object: document.createElement('div')}
]
var start_x = -1, start_y = -1; // -1: 선택안됨, -2: 선택완료 
var chosen = []; // (x y) stack
var board_char = [], board_state = []; // 0 ~ 3: selected, 4: empty

var timer_handle, turn_time = 30, left = turn_time;
var cnt_left, skip_cnt = 0;

function same_chosung(now_chosung, char){
    var charcode = char.charCodeAt(0);
    if (charcode < hangul_start || hangul_end < charcode)
        return false;
    return (chosung[chosung_idx_info[Math.floor((charcode - hangul_start) / (21 * 28))]] == now_chosung);
}

function random_pick(arr){
    var idx = Math.floor(Math.random() * (arr.length - 1));
    return arr[idx];
}

function hover_(e){
    var now_x = parseInt(this.id.split('-')[1]);
    var now_y = parseInt(this.id.split('-')[0]);
    if (start_x == -1){
        if (board_state[now_y][now_x] == 4)
            this.style.backgroundColor = user[turn].tmp_color;
    }
    else if (start_x >= 0){
        var diff_x = Math.abs(now_x - start_x);
        var diff_y = Math.abs(now_y - start_y);
        var dir;
        while (chosen.length > 1) {
            var tmp = chosen[chosen.length - 1];
            if (board_state[tmp[1]][tmp[0]] == 4)
                document.getElementById(tmp[1] + '-' + tmp[0]).style.backgroundColor = 'white';
            else
                document.getElementById(tmp[1] + '-' + tmp[0]).style.backgroundColor = user[board_state[tmp[1]][tmp[0]]].area_color;
            chosen.pop();
        }
        if (diff_x < diff_y){
            if (now_y > start_y)
                dir = 1;
            else
                dir = -1;
            for (var i = start_y + dir; i != now_y + dir; i += dir){
                if (board_state[i][start_x] != 4 && board_state[i][start_x] != turn)
                    break;
                chosen.push([start_x, i]);
                document.getElementById(i + '-' + start_x).style.backgroundColor = user[turn].tmp_color;
            }
        }
        else {
            if (now_x > start_x)
                dir = 1;
            else
                dir = -1;
            for (var i = start_x + dir; i != now_x + dir; i += dir){
                if (board_state[start_y][i] != 4 && board_state[start_y][i] != turn)
                    break;
                chosen.push([i, start_y]);
                document.getElementById(start_y + '-' + i).style.backgroundColor = user[turn].tmp_color;
            }
        }
    } 
}

function outout(){
    var now_x = parseInt(this.id.split('-')[1]);
    var now_y = parseInt(this.id.split('-')[0]);
    if (start_x == -1 && board_state[now_y][now_x] == 4){
        this.style.backgroundColor = 'white';
    }
}

function choose_start(){
    toggle(false);
    while (chosen.length){
        var tmp_x = chosen[chosen.length - 1][0];
        var tmp_y = chosen[chosen.length - 1][1];
        if (board_state[tmp_y][tmp_x] == 4)
            document.getElementById(tmp_y + '-' + tmp_x).style.backgroundColor = 'white';
        else
            document.getElementById(tmp_y + '-' + tmp_x).style.backgroundColor = user[board_state[tmp_y][tmp_x]].area_color;
        chosen.pop();
    }
    start_x = parseInt(this.id.split('-')[1]);
    start_y = parseInt(this.id.split('-')[0]);
    if (board_state[start_y][start_x] == 4 || board_state[start_y][start_x] == turn) {
        this.style.backgroundColor = user[turn].tmp_color;
        chosen.push([start_x, start_y]);
    }
    else{
        start_x = -2;
        start_y = -2;
    }
    
}

function select() {
    if (start_x < 0)
        return;
    start_x = -2;
    start_y = -2;
    if (chosen.length > 1) {
        toggle(true);
    }
}

function toggle(on){
    var d = document.getElementById('word_form');
    d.children[0].value = '';
    if (on){
        d.className = 'enable';
        d.children[0].disabled = false;
        d.children[0].focus();
    }
    else{
        d.className = 'disable';
        d.children[0].disabled = true;
    }
}

function parse(){
    var tmp = location.href.toString().split('?')[1].split('&');
    board_size = parseInt(tmp[0].split('=')[1]);
    player_cnt = parseInt(tmp[1].split('=')[1]);
    cnt_left = board_size * board_size;
    if (board_size < 8)
        board_size = 8;
    else if (board_size > 12)
        board_size = 12;
    if (player_cnt < 1)
        player_cnt = 1;
    else if (player_cnt > 4)
        player_cnt = 4;
}

function update(){
    left--;
    var now_tar = document.getElementById('inner ' + turn);
    if (left >= 10)
        now_tar.innerText = left;
    else
        now_tar.innerText = '0' + left;
    if (left < 10 && left % 2 == 1)
        now_tar.style.color = 'red';
    else
        now_tar.style.color = 'black';

    if (left == 0){
        change_turn(0);
    }
}

function finish(){
    var url = 'finish.html?';
    for (var i = 0; i < player_cnt; i++){
        url += 'p' + i + '=' + user[i].point;
        if (i + 1 != player_cnt)
            url += '&';
    }
    location.href = url;
}

function change_turn(over) {
    // 0 : 타임오버 1 : 입력함 2 : skip
    clearInterval(timer_handle);
    for (var i = chosen.length - 1; i >= 0; i--){
        if (over == 1) {
            document.getElementById(chosen[i][1] + '-' + chosen[i][0]).style.backgroundColor = user[turn].area_color;
            if (board_state[chosen[i][1]][chosen[i][0]] == 4) {
                user[turn].point++;
                cnt_left--;
                board_state[chosen[i][1]][chosen[i][0]] = turn;
            }
        }
        else if (board_state[chosen[i][1]][chosen[i][0]] == 4)
            document.getElementById(chosen[i][1] + '-' + chosen[i][0]).style.backgroundColor = 'white'; 
        else
            document.getElementById(chosen[i][1] + '-' + chosen[i][0]).style.backgroundColor = user[turn].area_color;

        chosen.pop();
    }
    
    if (over == 0)
        user[turn].point--;
    
    document.getElementById('point ' + turn).innerHTML = user[turn].point + '점';
    document.getElementById('inner ' + turn).className = 'innerdiv not_turn';
    user[turn].user_object.className = 'not_turn a_user';
    document.getElementById('inner ' + turn).style.color = 'gray';
    turn = (turn + 1) % player_cnt;
    document.getElementById('inner ' + turn).className = 'innerdiv turn';
    user[turn].user_object.className = 'turn a_user';
    toggle(false);
    start_x = -1;
    start_y = -1;
    left = turn_time;
        
    if (over == 1)
        skip_cnt = 0;
    else {
        skip_cnt++;
        if (skip_cnt == player_cnt) {
            var go = confirm('모든 유저가 단어를 선택하지 않았습니다. 게임을 종료할까요?');
            if (go)
                finish();
            else
                skip_cnt = 0;
        }
    }

    if (cnt_left == 0)
        finish();
    
    timer_handle = setInterval(update, 1000);
}

function build_board(parent){
    var user_area = document.getElementById('users');
    for (var i = 0; i < player_cnt; i++){
        var tmp = document.createElement('div');
        user[i].id = 'player' + i;
        tmp.id = 'inner ' + i;
        tmp.style.backgroundColor = user[i].tmp_color;
        tmp.innerHTML = '<div class="sec">' + turn_time + '</div>';
        if (i == 0){
            tmp.className = 'innerdiv turn';
            user[i].user_object.className = 'turn a_user';
        }
        else{
            tmp.className = 'innerdiv not_turn';
            user[i].user_object.className = 'not_turn a_user';
        }
        user[i].user_object.appendChild(tmp);
        user[i].user_object.innerHTML += '<div class="playername" style="padding: 15px 0 0 0;">PLAYER ' + (i + 1) + '</div><div class="point" id="point ' + i + '">0칸</div>';
        user_area.appendChild(user[i].user_object);
    }
    for (var i = 0; i < board_size; i++){
        var now = document.createElement('div'); 
        now.id = 'row ' + i;
        now.className = 'row';
        parent.appendChild(now);
        board_char.push([]);
        board_state.push([]);
        for (var j = 0; j < board_size; j++){
            var got = random_pick(chosung);
            board_char[i].push(got);
            board_state[i].push(4);
            var newcell = document.createElement('div');
            newcell.id = i + '-' + j;
            newcell.className = 'cell';
            newcell.style.width = Math.floor(450 / board_size).toString() + 'px'; 
            newcell.style.height = Math.floor(450 / board_size).toString() + 'px';
            newcell.innerHTML = '<span id="' + i + ' ' + j + '">' + got + '</span>';
            newcell.onmouseenter = hover_;
            newcell.onmouseleave = outout;
            newcell.onmousedown = choose_start;
            newcell.onmouseup = select;
            now.appendChild(newcell);
        }
    }
    var now_time = new Date();
    left = turn_time;
    timer_handle = setInterval(update, 1000);
}

function check_chosung(space_word){
    var now_chosung = '';
    var word = space_word.replaceAll(' ', '');
    for (var i = 0; i < chosen.length; i++)
        now_chosung += board_char[chosen[i][1]][chosen[i][0]];
    if (word.length == now_chosung.length){
        var res1 = true, res2 = true;
        for (var i = 0; i < now_chosung.length; i++){
            res1 &= same_chosung(now_chosung[i], word[i]);
            res2 &= same_chosung(now_chosung[now_chosung.length - i - 1], word[i]);
        }
        return (res1 || res2);
    }
    else
        return false;
}

function got_word(){
    var textbox = document.getElementById('textbox')
    var word = textbox.value;
    textbox.value = '';
    var chk = check_chosung(word);
    if (chk)
        chk |= check_word(word);
    if (chk)
        change_turn(1);
    else{
        console.log(false);
        textbox.focus();
        // fail
    }
}

document.oncontextmenu = function(){
    return false;
}