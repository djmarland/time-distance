require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FetchJson = require('../utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Points = require('./utils/Points');

var _Points2 = _interopRequireDefault(_Points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hub = function (_React$Component) {
    _inherits(Hub, _React$Component);

    function Hub() {
        _classCallCheck(this, Hub);

        var _this = _possibleConstructorReturn(this, (Hub.__proto__ || Object.getPrototypeOf(Hub)).call(this));

        _this.refetchInterval = null;
        _this.state = {
            playersData: []
        };
        return _this;
    }

    _createClass(Hub, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.refetchInterval = window.setInterval(this.fetchLatestData.bind(this), 5000); // 5 seconds
            this.setState({
                playersData: this.props.playersData
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.clearInterval(this.refetchInterval);
        }
    }, {
        key: 'fetchLatestData',
        value: function fetchLatestData() {
            _FetchJson2.default.getUrl('/hubs/' + this.props.hubKey + '.json', function (data) {
                this.setState({
                    playersData: data.players
                });
            }.bind(this), function (e) {
                // fail silently
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.playersData.length == 0) {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'p',
                        null,
                        'No players present in this hub'
                    )
                );
            }

            var players = [];

            this.state.playersData.forEach(function (player) {
                players.push(_react2.default.createElement(HubPlayer, { key: player.nickname, player: player }));
            });

            return _react2.default.createElement(
                'ul',
                null,
                players
            );
        }
    }]);

    return Hub;
}(_react2.default.Component);

exports.default = Hub;

var HubPlayer = function (_React$Component2) {
    _inherits(HubPlayer, _React$Component2);

    function HubPlayer() {
        _classCallCheck(this, HubPlayer);

        return _possibleConstructorReturn(this, (HubPlayer.__proto__ || Object.getPrototypeOf(HubPlayer)).apply(this, arguments));
    }

    _createClass(HubPlayer, [{
        key: 'render',
        value: function render() {
            var player = this.props.player;
            return _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'grid' },
                    _react2.default.createElement(
                        'div',
                        { className: 'g 1/2' },
                        _react2.default.createElement(
                            'a',
                            { href: player.url },
                            player.nickname
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'g 1/2' },
                        _react2.default.createElement(_Points2.default, {
                            value: player.points,
                            time: player.pointsCalculationTime,
                            rate: player.pointsRate
                        })
                    )
                )
            );
        }
    }]);

    return HubPlayer;
}(_react2.default.Component);

},{"../utils/FetchJson":5,"./utils/Points":2,"react":"react"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Points = function (_React$Component) {
    _inherits(Points, _React$Component);

    function Points() {
        _classCallCheck(this, Points);

        var _this = _possibleConstructorReturn(this, (Points.__proto__ || Object.getPrototypeOf(Points)).call(this));

        _this.allowAnimationUpdate = false;
        _this.state = {
            pointValue: 0
        };
        return _this;
    }

    _createClass(Points, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.allowAnimationUpdate = true;
            this.updatePoints();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.allowAnimationUpdate = false;
        }
    }, {
        key: 'updatePoints',
        value: function updatePoints() {
            if (!this.allowAnimationUpdate) {
                return;
            }

            var now = new Date(),
                calcTime = new Date(this.props.time),
                secondsDiff = (now.getTime() - calcTime.getTime()) / 1000,
                earned = secondsDiff * this.props.rate,
                current = this.props.value + earned;

            if (current < 0) {
                current = 0;
            }

            // @todo - handle what happens when you hit zero to "kill" the player
            // @todo - special effects when it gets low

            this.setState({
                pointValue: Math.floor(current).toLocaleString()
            });
            window.requestAnimationFrame(this.updatePoints.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var arrow = null;
            if (this.state.pointValue && this.props.rate > 0) {
                arrow = _react2.default.createElement(
                    'span',
                    null,
                    ' ^ '
                );
            }
            if (this.state.pointValue && this.props.rate < 0) {
                arrow = _react2.default.createElement(
                    'span',
                    null,
                    ' V '
                );
            }
            return _react2.default.createElement(
                'div',
                null,
                this.state.pointValue,
                ' (',
                arrow,
                ' ',
                this.props.rate,
                ')'
            );
        }
    }]);

    return Points;
}(_react2.default.Component);

exports.default = Points;

},{"react":"react"}],3:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Bootstrap = require('./utils/Bootstrap');

var _Bootstrap2 = _interopRequireDefault(_Bootstrap);

var _Hub = require('./game/Hub');

var _Hub2 = _interopRequireDefault(_Hub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    "use strict";

    function init() {
        var appContainer = document.getElementById('hub-application'),
            playersData = appContainer.dataset.initial;

        if (playersData) {
            playersData = JSON.parse(playersData);
        } else {
            playersData = [];
        }
        _reactDom2.default.render(_react2.default.createElement(_Hub2.default, { playersData: playersData, hubKey: appContainer.dataset.hubkey }), appContainer);
    }

    if (_Bootstrap2.default.browserSupported()) {
        init();
    }
})();

},{"./game/Hub":1,"./utils/Bootstrap":4,"react":"react","react-dom":"react-dom"}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bootstrap = function () {
    function Bootstrap() {
        _classCallCheck(this, Bootstrap);
    }

    _createClass(Bootstrap, null, [{
        key: "browserSupported",
        value: function browserSupported() {
            return document.getElementsByClassName && document.addEventListener;
        }
    }]);

    return Bootstrap;
}();

exports.default = Bootstrap;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchJson = function () {
    function FetchJson() {
        _classCallCheck(this, FetchJson);
    }

    _createClass(FetchJson, null, [{
        key: 'getUrl',
        value: function getUrl(url, successCallback, failureCallback) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function () {
                var data = null;
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

            request.onerror = function () {
                return failureCallback();
            };

            request.send();
        }
    }]);

    return FetchJson;
}();

exports.default = FetchJson;

},{}],"react-dom":[function(require,module,exports){
"use strict";

module.exports = window.ReactDOM;

},{}],"react":[function(require,module,exports){
"use strict";

module.exports = window.React;

},{}]},{},[3]);
