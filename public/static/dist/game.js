require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Bootstrap = require('./utils/Bootstrap');

var _Bootstrap2 = _interopRequireDefault(_Bootstrap);

var _FetchJson = require('./utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Game = require('./game/Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    "use strict";

    function unsupported() {
        // todo - state that your browser is unsupported for this game
    }

    function init() {
        var appContainer = document.getElementById('app-container');

        _FetchJson2.default.getUrl('/status.json', function (gameState) {
            document.body.classList.add('game-body');
            _reactDom2.default.render(_react2.default.createElement(_Game2.default, { gameState: gameState.status }), appContainer);
        }, function (e) {
            var message = 'Error getting status';
            if (e) {
                message += ' - ' + e.message;
            }
            alert(message);
        });

        // if ('serviceWorker' in navigator ) {
        //     navigator.serviceWorker.register('/sw.js', {scope:'/'});
        // }
    }

    if (_Bootstrap2.default.browserSupported()) {
        init();
    } else {
        unsupported();
    }
})();

},{"./game/Game":2,"./utils/Bootstrap":7,"./utils/FetchJson":8,"react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Board = require('./GamePanel/Board');

var _Board2 = _interopRequireDefault(_Board);

var _Player = require('./GamePanel/Player');

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_React$Component) {
    _inherits(Game, _React$Component);

    _createClass(Game, null, [{
        key: 'PANEL_BOARD',
        get: function get() {
            return 'board';
        }
    }, {
        key: 'PANEL_PLAYER',
        get: function get() {
            return 'player';
        }
    }, {
        key: 'PANEL_ABILITIES',
        get: function get() {
            return 'abilities';
        }
    }, {
        key: 'PANEL_SETTINGS',
        get: function get() {
            return 'settings';
        }
    }]);

    function Game() {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

        _this.state = {
            activePanel: 'board',
            gameState: null
        };
        return _this;
    }

    _createClass(Game, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.updateGameState(this.props.gameState);
        }
    }, {
        key: 'updateGameState',
        value: function updateGameState(newState) {
            this.setState({
                gameState: newState
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var panels = [];

            if (this.state.activePanel == Game.PANEL_SETTINGS) {
                panels.push(_react2.default.createElement(
                    'div',
                    { key: 'panel-settings' },
                    'SETTINGS'
                ));
            } else {
                var activeClass = "game__panel--active",
                    boardClass = this.state.activePanel == Game.PANEL_BOARD ? activeClass : null,
                    playerClass = this.state.activePanel == Game.PANEL_PLAYER ? activeClass : null,
                    abilitiesClass = this.state.activePanel == Game.PANEL_ABILITIES ? activeClass : null;

                panels.push(_react2.default.createElement(
                    'div',
                    { key: 'panel-board', className: "game__panel game__panel--board g " + boardClass },
                    _react2.default.createElement(_Board2.default, { gameState: this.state.gameState, onGameUpdate: this.updateGameState.bind(this) })
                ));
                panels.push(_react2.default.createElement(
                    'div',
                    { key: 'panel-player', className: "game__panel game__panel--player g 1/2@xl " + playerClass },
                    _react2.default.createElement(_Player2.default, { gameState: this.state.gameState, onGameUpdate: this.updateGameState.bind(this) })
                ));
                panels.push(_react2.default.createElement(
                    'div',
                    { key: 'panel-abilities', className: "game__panel game__panel--abilities g 1/2@xl " + abilitiesClass },
                    'ABILITIES'
                ));
            }

            return _react2.default.createElement(
                'div',
                { className: 'game grid grid--flush' },
                _react2.default.createElement(
                    'div',
                    { className: 'g game__header' },
                    'HEADER'
                ),
                panels
            );
        }
    }]);

    return Game;
}(_react2.default.Component);

exports.default = Game;

},{"./GamePanel/Board":3,"./GamePanel/Player":5,"react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GamePanel2 = require('./GamePanel');

var _GamePanel3 = _interopRequireDefault(_GamePanel2);

var _FetchJson = require('../../utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Points = require('../Utils/Points');

var _Points2 = _interopRequireDefault(_Points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = function (_GamePanel) {
    _inherits(Board, _GamePanel);

    function Board() {
        _classCallCheck(this, Board);

        return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));
    }

    _createClass(Board, [{
        key: 'changeHub',
        value: function changeHub(newkey) {
            // todo loading state (fancy animation?)
            _FetchJson2.default.getUrl('/action/make-move.json?hub-key=' + newkey, function (newGameState) {
                this.updateGlobalGameState(newGameState.status);
            }.bind(this), function (e) {
                // todo - better error handling
                var message = 'Error making move';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            });
        }
    }, {
        key: 'hubOption',
        value: function hubOption(key, hub) {
            return React.createElement(BoardHubOption, { key: key, directionKey: key, hub: hub, onChangeHub: this.changeHub.bind(this) });
        }
    }, {
        key: 'render',
        value: function render() {
            var gameState = this.state.gameState,
                hubOptions = null,
                location = null;
            if (gameState.currentPosition.type == 'hub') {
                location = React.createElement(BoardLocationHub, { positionData: gameState.currentPosition });

                hubOptions = [this.hubOption('nw', gameState.currentPosition.data.paths.nw), this.hubOption('ne', gameState.currentPosition.data.paths.ne), this.hubOption('e', gameState.currentPosition.data.paths.e), this.hubOption('se', gameState.currentPosition.data.paths.se), this.hubOption('sw', gameState.currentPosition.data.paths.sw), this.hubOption('w', gameState.currentPosition.data.paths.w)];
            }
            if (gameState.currentPosition.type == 'spoke') {
                location = React.createElement(BoardLocationSpoke, { positionData: gameState.currentPosition });
            }

            var playersPresent = null;
            if (gameState.playersPresent && gameState.playersPresent.length > 0) {
                (function () {
                    var players = [];

                    gameState.playersPresent.forEach(function (player) {
                        players.push(React.createElement(
                            'li',
                            { className: 'g 1/2', key: player.nickname },
                            React.createElement(
                                'h5',
                                null,
                                player.nickname
                            ),
                            React.createElement(_Points2.default, {
                                value: player.points,
                                time: player.pointsCalculationTime,
                                rate: player.pointsRate
                            })
                        ));
                    });

                    playersPresent = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h2',
                            null,
                            'Players here'
                        ),
                        React.createElement(
                            'ul',
                            { className: 'grid' },
                            players
                        )
                    );
                })();
            }

            return React.createElement(
                'div',
                { className: 'grid' },
                React.createElement(
                    'div',
                    { className: 'g 1/2' },
                    location,
                    React.createElement('hr', null),
                    React.createElement(
                        'h2',
                        null,
                        'Hubs to choose from'
                    ),
                    React.createElement(
                        'div',
                        { className: 'grid' },
                        hubOptions
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'g 1/2' },
                    playersPresent
                )
            );
        }
    }]);

    return Board;
}(_GamePanel3.default);

exports.default = Board;

var BoardHubOption = function (_React$Component) {
    _inherits(BoardHubOption, _React$Component);

    function BoardHubOption() {
        _classCallCheck(this, BoardHubOption);

        return _possibleConstructorReturn(this, (BoardHubOption.__proto__ || Object.getPrototypeOf(BoardHubOption)).apply(this, arguments));
    }

    _createClass(BoardHubOption, [{
        key: 'goToHub',
        value: function goToHub() {
            this.props.onChangeHub(this.props.hub.hub.urlKey);
        }
    }, {
        key: 'render',
        value: function render() {
            var hub = null;
            if (this.props.hub) {
                hub = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        null,
                        this.props.hub.hub.name,
                        ' - ',
                        this.props.hub.hub.cluster
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Distance: ',
                        this.props.hub.distance,
                        React.createElement(
                            'button',
                            { onClick: this.goToHub.bind(this) },
                            'Go there'
                        )
                    )
                );
            }

            return React.createElement(
                'div',
                { className: 'g 1/2' },
                React.createElement(
                    'h3',
                    null,
                    this.props.directionKey
                ),
                hub
            );
        }
    }]);

    return BoardHubOption;
}(React.Component);

var BoardLocationHub = function (_React$Component2) {
    _inherits(BoardLocationHub, _React$Component2);

    function BoardLocationHub() {
        _classCallCheck(this, BoardLocationHub);

        return _possibleConstructorReturn(this, (BoardLocationHub.__proto__ || Object.getPrototypeOf(BoardLocationHub)).apply(this, arguments));
    }

    _createClass(BoardLocationHub, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    this.props.positionData.data.name
                ),
                React.createElement(
                    'h2',
                    null,
                    this.props.positionData.data.cluster.name
                )
            );
        }
    }]);

    return BoardLocationHub;
}(React.Component);

var BoardLocationSpoke = function (_React$Component3) {
    _inherits(BoardLocationSpoke, _React$Component3);

    function BoardLocationSpoke() {
        _classCallCheck(this, BoardLocationSpoke);

        return _possibleConstructorReturn(this, (BoardLocationSpoke.__proto__ || Object.getPrototypeOf(BoardLocationSpoke)).apply(this, arguments));
    }

    _createClass(BoardLocationSpoke, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                'TRAVELLING'
            );
        }
    }]);

    return BoardLocationSpoke;
}(React.Component);

},{"../../utils/FetchJson":8,"../Utils/Points":6,"./GamePanel":4}],4:[function(require,module,exports){
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

var GamePanel = function (_React$Component) {
    _inherits(GamePanel, _React$Component);

    function GamePanel() {
        _classCallCheck(this, GamePanel);

        var _this = _possibleConstructorReturn(this, (GamePanel.__proto__ || Object.getPrototypeOf(GamePanel)).call(this));

        _this.state = {
            gameState: null
        };
        return _this;
    }

    _createClass(GamePanel, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.updateGameState(this.props.gameState);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            this.updateGameState(newProps.gameState);
        }
    }, {
        key: 'updateGameState',
        value: function updateGameState(newState) {
            this.setState({
                gameState: newState
            });
        }
    }, {
        key: 'updateGlobalGameState',
        value: function updateGlobalGameState(newState) {
            this.updateGameState(newState);
            this.props.onGameUpdate(newState);
        }
    }]);

    return GamePanel;
}(_react2.default.Component);

exports.default = GamePanel;

},{"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GamePanel2 = require('./GamePanel');

var _GamePanel3 = _interopRequireDefault(_GamePanel2);

var _Points = require('../Utils/Points');

var _Points2 = _interopRequireDefault(_Points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_GamePanel) {
    _inherits(Player, _GamePanel);

    function Player() {
        _classCallCheck(this, Player);

        return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).apply(this, arguments));
    }

    _createClass(Player, [{
        key: 'onClickButton',
        value: function onClickButton() {
            var gameState = this.state.gameState;
            // move to the hub
            gameState.currentPosition.type = 'spoke';
            this.updateGlobalGameState(gameState);
        }
    }, {
        key: 'render',
        value: function render() {
            var player = this.state.gameState.player;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    player.name
                ),
                React.createElement(_Points2.default, {
                    timeNow: this.state.gameState.currentTime,
                    value: player.points,
                    time: player.pointsCalculationTime,
                    rate: player.pointsRate
                }),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        'button',
                        { onClick: this.onClickButton.bind(this) },
                        'Begin travelling'
                    )
                )
            );
        }
    }]);

    return Player;
}(_GamePanel3.default);

exports.default = Player;

},{"../Utils/Points":6,"./GamePanel":4}],6:[function(require,module,exports){
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

},{"react":"react"}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}]},{},[1]);
