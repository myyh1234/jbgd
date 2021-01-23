var board_size, player_cnt;
var chosung = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
function choose(arr){
    var idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
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
            newcell.id = 'cell ' + i + '-' + j;
            newcell.setAttribute('class', 'cell')
            newcell.style.width = Math.floor(450 / board_size).toString() + 'px'; 
            newcell.style.height = Math.floor(450 / board_size).toString() + 'px';
            newcell.innerHTML = '<span id="' + i + ' ' + j + '">' + choose(chosung) + '</span>';
            now.appendChild(newcell);
        }

    }
}