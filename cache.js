CACHE = {
    filter_domains: '',
    filter_strs: '',
    proxies: '',
    proxies_bypasslist: '',
    user_agent: navigator.userAgent,
    filter_form_keys: '',
    filter_form_values: ''
};

chrome.extension.onConnect.addListener(function(port)
{
    port.onMessage.addListener(function(msg)
    {
        console.log(JSON.stringify(msg));
        switch (msg.request)
        {
            case 'efect':
                var fds = msg.filter_domains;
                var fss = msg.filter_strs;
                var ps = msg.proxies;
                var ps_bps = msg.proxies_bypasslist;
                var ua = msg.user_agent;
                var filter_form_keys = msg.filter_form_keys;
                var filter_form_values = msg.filter_form_values;

                CACHE.filter_domains = fds;
                CACHE.filter_strs = fss;
                CACHE.proxies = ps;
                CACHE.proxies_bypasslist = ps_bps;
                CACHE.user_agent = ua;
                CACHE.filter_form_keys = filter_form_keys;
                CACHE.filter_form_values = filter_form_values;

                var proxy = random_proxy();
                var pbs = parse_pbs();
                set_proxy(proxy[0], proxy[1], proxy[2], pbs);
                port.postMessage('设置成功');
                break;

            case 'get_cfg':
                var fds = CACHE.filter_domains;
                var fss = CACHE.filter_strs;
                var ps = CACHE.proxies;
                var ps_pbs = CACHE.proxies_bypasslist;
                var ua = CACHE.user_agent;
                var ffks = CACHE.filter_form_keys;
                var ffvs = CACHE.filter_form_values;
                port.postMessage({
                    filter_domains: fds,
                    filter_strs: fss,
                    proxies: ps,
                    proxies_bypasslist: ps_pbs,
                    user_agent: ua,
                    filter_form_keys: ffks,
                    filter_form_values: ffvs
                });
                break;

            case 'delete_all_cookies':
                clear_all_cookies();
                port.postMessage('清除Cookie成功');
                break;

            case 'clear_history':
                clear_history();
                port.postMessage('清除成功');
                break;
            default:
                break;
        }
    })
});

function clear_history()
{
    chrome.history.deleteAll(function()
    {
        console.log('清除所有历史');
    });
}

function random_proxy()
{
    if (CACHE.proxies != '')
    {
        try
        {
            var proxies = [];
            var ps = CACHE.proxies.split(',');
            for (var i = 0; i < ps.length; i++)
            {
                var tmp = ps[i].split('://');
                var scheme = tmp[0];
                tmp = tmp[1].split(':');
                var host = tmp[0];
                var port = tmp[1];
                proxies.push([scheme, host, port]);
            }
            var n = Math.round(Math.random() * (proxies.length - 1));
            return proxies[n];
        }
        catch(err)
        {
            console.log(err);
            return ['', '', -1];
        }
    }
    else
    {
        return ['', '', -1];
    }
}

function parse_pbs()
{
    if (CACHE.proxies_bypasslist == '')
    {
        return [];
    }
    else
    {
        return CACHE.proxies_bypasslist.split(',');
    }
}

filter_func = function(list, url)
{
    for (var i = 0; i < list.length; i++)
    {
        if (list[i].trim() != '' && url.indexOf(list[i]) >= 0)
        {
            return true;
        }
    }
    return false;
};

chrome.webRequest.onBeforeRequest.addListener(
    function(details)
    {
        var fds = CACHE.filter_domains.split(',');
        var fss = CACHE.filter_strs.split(',');
        var ffks = CACHE.filter_form_keys.split(',');
        var ffvs = CACHE.filter_form_values.split(',');
        ca = filter_func(fds, details.url) || filter_func(fss, details.url);
        if (details.url.indexOf('chrome-extension://') >= 0)
        {
            ca = false;
        }

        if (details.requestBody != undefined)
        {
            for (var key in details.requestBody.formData)
            {
                for (var i = 0; i < ffks.length; i++)
                {
                    if (key == ffks[i])
                    {
                        ca = true;
                        break;
                    }
                    for (var j = 0; j < ffvs.length; j++)
                    {
                        for (var z = 0; z < details.requestBody.formData[key].length; z++)
                        {
                            if (ffvs[j] != "" && ffvs[j] == details.requestBody.formData[key][z])
                            {
                                ca = true;
                                break;
                            }
                        }
                        if (ca == true) break;
                    }
                }

                if (ca == true) break;
            }
        }

        return {cancel: ca};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestBody"]
);

chrome.webRequest.onHeadersReceived.addListener(function(details)
    {
        console.log(details.url, details.statusCode);
        return {responseHeaders:details.responseHeaders};
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders", "blocking"]
);

/**
 * function set_proxy
 *
 * @param scheme: 'http'
 * @param host: 'localhost'
 * @param port: 8888
 * @param bypassList: ['localhost']
 *
 * @return:
 *
 * 如果scheme, host 为'', port 为 -1，且bypassList 长度为 0 则不使用任何代理
 */
function set_proxy(scheme, host, port, bypassList)
{
    var config = null;
    if (scheme == '' && host == '' && parseInt(port) == -1 && bypassList.length == 0)
    {
        chrome.proxy.settings.clear({}, function(){});
        console.log('当前代理：不使用任何代理');
    }
    else
    {
        config = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: scheme,
                    host: host,
                    port: parseInt(port)
                },
                bypassList: bypassList
            }
        };
        console.log('当前代理:' + scheme + '://' + host + ':' + port + ' 不使用代理的域名或ip为:' + bypassList);
        chrome.proxy.settings.set({value: config}, function() {});
    }
}

function clear_all_cookies()
{
    chrome.cookies.getAll({}, function(cookies)
    {
        for (var i = 0; i < cookies.length; i++)
        {
            var urls = [];
            if (cookies[i].domain[0] == '.')
            {
                urls.push('http://' + cookies[i].domain.slice(1) + cookies[i].path);
                urls.push('https://' + cookies[i].domain.slice(1) + cookies[i].path);
            }
            else
            {
                urls.push('http://' + cookies[i].domain + cookies[i].path);
                urls.push('https://' + cookies[i].domain + cookies[i].path);
            }
            try
            {
                for (var j = 0; j < urls.length; j++)
                {
                    chrome.cookies.remove({url: urls[j], name: cookies[i].name}, function(cookie)
                    {
                        console.log('清除的cookie:' + JSON.stringify(cookie));
                    });
                }
            }
            catch(err)
            {
                console.log(err);
            }
        }
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(function(details)
{
    for (var i = 0; i < details.requestHeaders.length; i++)
    {
        if (details.requestHeaders[i].name == 'User-Agent')
        {
            details.requestHeaders[i].value = CACHE.user_agent;
            break;
        }
    }
    return {requestHeaders: details.requestHeaders};
}, {urls: ['<all_urls>']}, ['blocking', 'requestHeaders']);
