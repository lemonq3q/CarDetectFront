function genUrl(baseUrl, params) {
    let isFirst = true;
    for (let key in params) {
        if (params[key] != null && params[key] != '' && params[key] != undefined) {
            if (isFirst) {
                baseUrl += '?';
                isFirst = false;
            } else {
                baseUrl += '&'; 
            }
            baseUrl += key + '=' + params[key];
        }
    }
    return baseUrl;
}

export {genUrl};