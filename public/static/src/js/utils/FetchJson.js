export default class FetchJson {
    static getUrl(url, successCallback, failureCallback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            let data = null;
            if (this.status == 200) {
                try {
                    data = JSON.parse(this.response);
                } catch (e) {
                    return failureCallback(e);
                }
                return successCallback(data);
            } else {
                return failureCallback();
            }
        };

        request.onerror = function() {
            return failureCallback();
        };

        request.send();
    }
    static postUrl(url, data, successCallback, failureCallback) {
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onload = function() {
            let data = null;
            if (this.status == 200) {
                try {
                    data = JSON.parse(this.response);
                } catch (e) {
                    return failureCallback(e);
                }
                return successCallback(data);
            } else {
                return failureCallback();
            }
        };

        request.onerror = function() {
            return failureCallback();
        };

        request.send(data);
    }
}