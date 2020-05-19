function auto_selected(msg)
{
    switch(msg.user_agent)
    {
        case $('#safari_pc').val():
            $('#safari_pc').attr('selected', 'true');
            break;
        case $('#safari_iphone').val():
            $('#safari_iphone').attr('selected', 'true');
            break;
        case $('#safari_ipod').val():
            $('#safari_ipod').attr('selected', 'true');
            break;
        case $('#safari_ipad').val():
            $('#safari_ipad').attr('selected', 'true');
            break;
        case $('#microsoft_edge').val():
            $('#miscrosoft_edge').attr('selected', 'true');
            break;
        case $('#ie11').val():
            $('#ie11').attr('selected', 'true');
            break;
        case $('#mac_chrome').val():
            $('#mac_chrome').attr('selected', 'true');
            break;
        case $('#window_chrome').val():
            $('#window_chrome').attr('selected', 'true');
            break;
        case $('#mac_firefox').val():
            $('#mac_firefox').attr('selected', 'true');
            break;
        case $('#window_firefox').val():
            $('#window_firefox').attr('selected', 'true');
            break;
        case $('#redmi').val():
            $('#redmi').attr('selected', 'true');
            break;
        default:
            $('#default').attr('selected', 'true');
    }
}

$(function()
{
    $('#default').val(navigator.userAgent);
    $('#default').html('Default');
    var msg = {
        'request': 'get_cfg'
    };
    var port = chrome.extension.connect();
    port.postMessage(msg);
    port.onMessage.addListener(function(msg)
    {
        console.log(msg);
        $('#log').val('url:' + location.href + '\n加载时:\n' + JSON.stringify(msg));
        $('#domains').val(msg.filter_domains);
        $('#strs').val(msg.filter_strs);
        $('#proxies').val(msg.proxies);
        $('#proxies_bypasslist').val(msg.proxies_bypasslist);
        $('#proxies_donot_passlist').val(msg.proxies_donot_passlist);
        $('#user_agent').val(msg.user_agent);
        $('#filter_form_keys').val(msg.filter_form_keys);
        $('#filter_form_values').val(msg.filter_form_values);
        auto_selected(msg);
    });
});

$('#efect').click(function()
{
    var filter_domains = $('#domains').val().trim().replace(/ /g, '');
    var filter_strs = $('#strs').val().trim().replace(/ /g, '');
    var proxies = $('#proxies').val().trim().replace(/ /g, '');
    var proxies_bypasslist = $('#proxies_bypasslist').val().trim().replace(/ /g, '');
    var proxies_donot_passlist = $('#proxies_donot_passlist').val().trim().replace(/ /g, '');
    var user_agent = $('#user_agent').val().trim();
    var filter_form_keys = $('#filter_form_keys').val().trim();
    var filter_form_values = $('#filter_form_values').val().trim();
    var port = chrome.extension.connect();
    var msg = {
        'request': 'efect',
        'filter_domains': filter_domains,
        'filter_strs': filter_strs,
        'proxies': proxies,
        'proxies_bypasslist': proxies_bypasslist,
        'proxies_donot_passlist': proxies_donot_passlist,
        'user_agent': user_agent,
        'filter_form_keys': filter_form_keys,
        'filter_form_values': filter_form_values
    };
    port.postMessage(msg);
    port.onMessage.addListener(function(msg)
    {
        console.log(msg);
        $('#log').val('url:' + location.href + '\n生效时:\n' + JSON.stringify(msg));
    });
});

$('#delete_all_cookies').click(function()
{
    var port = chrome.extension.connect();
    var msg = {
        'request': 'delete_all_cookies'
    };
    port.postMessage(msg);
    port.onMessage.addListener(function(msg)
    {
        console.log(msg);
        $('#log').val('url:' + location.href + '\n清Cookie时:\n' + JSON.stringify(msg));
    });
});


$('#clear_history').click(function()
{
    var port = chrome.extension.connect();
    var msg = {
        'request': 'clear_history'
    };

    port.postMessage(msg);
    port.onMessage.addListener(function(msg)
    {
        console.log(msg);
        $('#log').val(msg);
    })
});
