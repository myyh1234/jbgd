var board_size, player_cnt;

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