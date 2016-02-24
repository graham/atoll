"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataCache = (function () {
    function DataCache(client) {
        _classCallCheck(this, DataCache);

        this.cache = {};
        this.alias_lookup = {};
    }

    _createClass(DataCache, [{
        key: "set_alias",
        value: function set_alias(alias, callback) {
            this.alias_lookup[alias] = callback;
        }
    }, {
        key: "set_url_alias",
        value: function set_url_alias(alias, url) {
            this.set_alias(alias, function (_cache, _alias, _resolve, _reject) {
                $.get(url).then(function (data) {
                    _resolve(data);
                });
            });
        }
    }, {
        key: "load",
        value: function load(alias, force_refresh) {
            var _this = this;

            if (force_refresh == undefined) {
                force_refresh = false;
            }
            if (this.cache[alias] == undefined) {
                var load_promise = new Promise(function (resolve, reject) {
                    _this.alias_lookup[alias].apply(null, [_this, alias, resolve, reject]);
                });
                this.cache[alias] = load_promise;
                return load_promise;
            } else {
                return this.cache[alias];
            }
        }
    }]);

    return DataCache;
})();