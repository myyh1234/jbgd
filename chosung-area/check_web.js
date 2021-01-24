function check_word(word){
    var key = '05D35A13E73CE4BB252E84AF5A5B47A0';
    var uri_url = 'https://opendict.korean.go.kr/api/search?key=' + key + '&q=' + word + '&advanced=y&pos=1,2,3';
    var uri_sam = fetch(uri_url);
    console.log(uri_sam);
    return true;
}