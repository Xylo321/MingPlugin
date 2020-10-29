/**
 * 将16进制字符串解密成普通字符串
 */
function js_16_decode(dp) {
    var monyer = '';
    var s = dp.split(" ");
    for (i = 0; i < s.length; i++) {
        s[i] = s[i].replace('0x', '');
        monyer += String.fromCharCode(parseInt(s[i], 16))
    }
    return monyer;
}

/**
 * 将字符串转换为16进制字符串
 */
function js_16_encode(ep) {
    var monyer = '';
    var i, s;
    for (i = 0; i < ep.length; i++) {
        s = ep.charCodeAt(i).toString(16);
        monyer += "0x" + s + ' ';
    }
    return monyer.trim();
}

$('#pretty_json').click(function() {
    var pjp = $('#pretty_json_pre').val();
    var pjpo = JSON.parse(pjp);
    var pjpa = JSON.stringify(pjpo, null, '\t');
    $('#pretty_json_pre').val(pjpa);

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
    var bea = btoa(unescape(encodeURIComponent(bep)));
    $('#base64_encode_aft').val(bea);
});

$('#base64_decode').click(function() {
    var bdp = $('#base64_decode_pre').val();
    var bda = decodeURIComponent(escape(atob(bdp).toString()));
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

$("#image_base64_viewer_pre").bind("paste", function(e) {
        var isChrome = false;
        if (event.clipboardData || event.originalEvent) {
            //某些chrome版本使用的是event.originalEvent
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if(clipboardData.items){
			// for chrome
			var  items = clipboardData.items,
			len = items.length,
			blob = null;
			isChrome = true;
			for (var i = 0; i < len; i++) {
			    console.log(items[i]);
			    if (items[i].type.indexOf("image") !== -1) {
				//getAsFile() 此方法只是living standard firefox ie11 并不支持
				blob = items[i].getAsFile();
			    }
			}
			if(blob!==null){
			    var blobUrl=URL.createObjectURL(blob);
			    //blob对象显示
			    var reader = new FileReader();
			    //base64码显示
			    reader.onload = function (event) {
				// event.target.result 即为图片的Base64编码字符串
				var base64_str = event.target.result;
				console.log(base64_str);
				$('#image_base64_viewer_pre').val(base64_str);
				$("#image_render").css({
					"background": "url(" + base64_str +")",
					"background-repeat": "no-repeat",
					"background-size": "contain",
					"background-position": "center",
					"-webkit-background-size": "contain",
					"-moz-background-size": "contain"
					});
			    }
			    reader.readAsDataURL(blob);
			}
		}
	}
});

//为了更酷，决定用另一种写法
document.querySelector('#get_data_timestamp_pre').onchange = function() {
    var ts = new Date(this.value);
    document.querySelector('#get_data_timestamp_aft').value = ts.getTime() / 1000;
}

//为了更酷，决定用另一种写法
document.querySelector('#get_color_pre').onchange = function() {
    document.querySelector('#get_color_aft').value = this.value;
}
