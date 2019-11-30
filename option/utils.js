/**
 * 将16进制字符串解密成普通字符串
 */
function js_16_decode(dp) {
    var monyer = new Array();
    var s = dp.split("\\");
    for (i = 1; i < s.length; i++) {
        s[i] = s[i].replace('x', '');
        monyer += String.fromCharCode(parseInt(s[i], 16))
    }
    return monyer;
}

/**
 * 将字符串转换为16进制字符串
 */
function js_16_encode(ep) {
    var monyer = new Array();
    var i, s;
    for (i = 0; i < ep.length; i++) {
        s = ep.charCodeAt(i).toString(16);
        monyer += "\\x" + s;
    }
    return monyer;
}

$('#pretty_json').click(function() {
    var pjp = $('#pretty_json_pre').val();
    var pjpo = JSON.parse(pjp);
    //var pjpa = JSON.stringify(pjpo, null, '    ');
    //$('#pretty_json_aft').val(pjpa);
    $('#pretty_json_aft').jsonViewer(pjpo, {
        collapsed: false,
        nl2br: true,
        recursive_collapser: true,
        withLinks: false, // 半夜起来优化掉了
    });
});

$('#reg_match').click(function() {
    var mtp = $('#match_text_pre').val();
    var r = $('#reg').val();
    var ro = new RegExp(r, 'g');
    var results = mtp.match(ro);
    var mta = '';
    for (var i = 0; i < results.length; i++) {
        if (i == 0) {
            mta = results[i];
        } else {
            mta = mta + ',' + results[i];
        }
    }
    $('#match_text_aft').val(mta);
});

$('#cts').click(function() {
    var t = $('#ts').val().trim();
    if (t == '')
    {
        t = new Date() / 1000;
        $('#ts').val(t);
    }
    var ts = parseFloat(t);
    var tsc = String(new Date(ts * 1000).toLocaleString().replace(/:\d{1,2}$/, ' '));
    $('#tsc').val(tsc);
});

$('#url_decode').click(function() {
    var udp = $('#url_decode_pre').val();
    var uda = decodeURIComponent(udp).toString();
    $('#url_decode_aft').val(uda);
});

$('#url_encode').click(function() {
    var uep = $('#url_encode_pre').val();
    var uea = encodeURIComponent(uep).toString();
    $('#url_encode_aft').val(uea);
});

$('#base64_encode').click(function() {
    var bep = $('#base64_encode_pre').val();
    var bea = btoa(bep);
    $('#base64_encode_aft').val(bea);
});

$('#base64_decode').click(function() {
    var bdp = $('#base64_decode_pre').val();
    var bda = atob(bdp).toString();
    $('#base64_decode_aft').val(bda);
});

$('#js_16_encode').click(function() {
    var j16ep = $('#js_16_encode_pre').val();
    var j16ea = js_16_encode(j16ep);
    $('#js_16_encode_aft').val(j16ea);
});

$('#js_16_decode').click(function() {
    var j16dp = $('#js_16_decode_pre').val();
    var j16da = js_16_decode(j16dp);
    $('#js_16_decode_aft').val(j16da);
});
