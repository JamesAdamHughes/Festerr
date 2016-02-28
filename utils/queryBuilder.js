var queryBuilder = {
    buildQuery: function(url, params) {
        url = url + "?";
        for (var key in params) {
            url = url + key + "=" + params[key] + "&";
        }
        url = url.substring(0, url.length - 1);
        return url;
    }
};

module.exports = queryBuilder;