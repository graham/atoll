"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This is the client class that will exist within the "child"
// iframe.

var HOSTURL = "http://localhost:4040/";

var InsideOutPromise = (function () {
    function InsideOutPromise() {
        var _this = this;

        _classCallCheck(this, InsideOutPromise);

        this.promise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
    }

    _createClass(InsideOutPromise, [{
        key: "resolve",
        value: function resolve(value) {
            this._resolve(value);
        }
    }, {
        key: "reject",
        value: function reject(value) {
            this._reject(value);
        }
    }]);

    return InsideOutPromise;
})();

var Client = (function () {
    function Client() {
        var _this2 = this;

        _classCallCheck(this, Client);

        this.listeners = {};
        this.data_requests = {};
        this.on('__data_response', function (payload) {
            var url = payload.url;
            if (_this2.data_requests[url]) {
                _this2.data_requests[url].resolve(payload.data);
            }
        });
    }

    _createClass(Client, [{
        key: "on",
        value: function on(event, callback) {
            if (this.listeners[event] == undefined) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        }
    }, {
        key: "fire",
        value: function fire(event, payload) {
            if (this.listeners[event] == undefined) {
                this.listeners[event] = [];
            }
            this.listeners[event].forEach(function (item) {
                item.apply(null, [payload]);
            });
        }
    }, {
        key: "handle_message",
        value: function handle_message(event) {
            console.log("CHILD  -> From Parent: " + JSON.stringify(event.data));
            this.fire(event.data.type, event.data.payload);
        }
    }, {
        key: "send",
        value: function send(type, obj) {
            var d = { 'type': type, 'payload': obj };
            parent.postMessage(d, HOSTURL);
        }
    }, {
        key: "request",
        value: function request(url) {
            // __ indicates something used internally by Atoll, you can override but
            // this way there are less naming collisions with event types.

            if (this.data_requests[url] != undefined) {
                return this.data_requests[url].promise;
            } else {
                var pro = new InsideOutPromise();
                this.send('__data_request', { 'url': url });
                this.data_requests[url] = pro;
                return pro.promise;
            }
        }
    }]);

    return Client;
})();

var atoll_client_obj = new Client();

window.addEventListener("message", function (event) {
    atoll_client_obj.handle_message(event);
}, false);