function Request() {
    var callbackName = 'jsonpCallback';

    this.getCallbackName = function() {
        return callbackName;
    }
    this.get = function(url) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.addEventListener("load", function() {
                if (request.status < 400) {
                    resolve(request.response);
                }
                else {
                    reject(new Error("Request failed: " + request.statusText));
                }
            });
            request.addEventListener("error", function() {
                reject(new Error("Network error"));
            });
            request.send();
        });
    }
    this.post = function(url, requestBody) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.addEventListener("load", function() {
                if (request.status < 400) {
                    resolve(request.responseText);
                }
                else {
                    reject(new Error("Request failed: " + request.statusText));
                }
            });
            request.addEventListener("error", function() {
                reject(new Error("Network error"));
            });
            request.send(requestBody);
        });
    }

    this.jsonp = function(url) {
        return new Promise(function(resolve, reject) {
            window[callbackName] = function(response) {
                resolve(response);
            };
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = url;
            document.head.appendChild(script);
        });
    }
}
