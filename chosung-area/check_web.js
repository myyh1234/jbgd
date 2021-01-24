function check_word(word){
    var key = '79DFD4B08A0FF12EE31D1968FFF0002B';
    var uri_url = 'https://opendict.korean.go.kr/api/search?key=' + key + '&q=' + word + '&advanced=y&pos=1,2,3';
    var uri_sam = fetch(uri_url);
    console.log(uri_sam);
    return true;
}