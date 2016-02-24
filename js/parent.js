'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parent = (function () {
    function Parent() {
        var _this = this;

        _classCallCheck(this, Parent);

        this.data_cache = {};
        this.current_frame = null;
        this.current_url = null;
        window.addEventListener("message", function (event) {
            _this.handle_message(event);
        }, false);
    }

    _createClass(Parent, [{
        key: 'load_frame',
        value: function load_frame(url) {
            var _this2 = this;

            var target = document.getElementById('content_frame');
            var frame = document.createElement('iframe');

            frame.src = url;
            this.current_url = url;

            target.innerHTML = '';
            target.appendChild(frame);
            this.current_frame = frame;

            setTimeout(function () {
                _this2.send('load', {});
            }, 100);
        }
    }, {
        key: 'send',
        value: function send(event, obj) {
            if (this.current_frame == null) {
                return null;
            }
            var d = { 'type': event, 'payload': obj };
            this.current_frame.contentWindow.postMessage(d, "http://localhost:4040/");
        }
    }, {
        key: 'handle_message',
        value: function handle_message(event) {
            var _this3 = this;

            console.log("PARENT -> From Child: " + JSON.stringify(event.data));
            var payload = event.data.payload;
            if (event.data.type == '__data_request') {
                if (this.data_cache[payload.url] == undefined) {
                    $.get(payload.url).then(function (data) {
                        _this3.send('__data_response', { 'url': payload.url, 'data': data });
                        _this3.data_cache[payload.url] = data;
                    });
                } else {
                    var data = this.data_cache[payload.url];
                    this.send('__data_response', { 'url': payload.url, 'data': data });
                }
                return;
            }
            console.log("Unhandled event type: " + event.data.type);
        }
    }]);

    return Parent;
})();