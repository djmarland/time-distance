require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FetchJson = require('./utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Game = require('./game/Game');

var _Game2 = _interopRequireDefault(_Game);

var _Hub = require('./game/Hub');

var _Hub2 = _interopRequireDefault(_Hub);

var _Player = require('./game/Player');

var _Player2 = _interopRequireDefault(_Player);

var _Header = require('./game/Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    "use strict";

    var appHeader = document.getElementById('app-header'),
        appGame = document.getElementById('app-game'),
        appHub = document.getElementById('app-hub'),
        appPlayer = document.getElementById('app-player'),
        updateInterval = 20 * 1000;

    function unsupported() {
        if (appGame) {
            appGame.innerHTML = '<p>Your browser does not support this game</p>';
        }
    }

    function init() {

        // todo - get the header to update dynamically?

        if (appHeader) {
            // todo - use initial state if present?
            _reactDom2.default.render(_react2.default.createElement(_Header2.default, {
                updateInterval: updateInterval
            }), appHeader);
        }

        if (appGame) {
            // todo - use initial state for the game to be faster
            _FetchJson2.default.getUrl('/play/status.json', function (gameState) {

                if (appGame) {
                    _reactDom2.default.render(_react2.default.createElement(_Game2.default, { gameState: gameState }), appGame);
                }
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

        if (appHub) {
            // todo - initial should be whole dataset (and then not need a hubkey)
            var playersData = appHub.dataset.initial;

            if (playersData) {
                playersData = JSON.parse(playersData);
            } else {
                playersData = [];
            }
            _reactDom2.default.render(_react2.default.createElement(_Hub2.default, {
                playersData: playersData,
                hubKey: appHub.dataset.hubkey,
                updateInterval: updateInterval
            }), appHub);
        }

        if (appPlayer) {
            var playerData = JSON.parse(appPlayer.dataset.initial);
            _reactDom2.default.render(_react2.default.createElement(_Player2.default, {
                playerData: playerData,
                updateInterval: updateInterval
            }), appPlayer);
        }
    }

    if (document.getElementsByClassName && document.addEventListener) {
        init();
    } else {
        unsupported();
    }
})();

},{"./game/Game":2,"./game/Header":6,"./game/Hub":7,"./game/Player":8,"./utils/FetchJson":11,"react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
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
        value: function changeHub(bearing) {
            // todo loading state (fancy animation?)
            _FetchJson2.default.postUrl('/play/move.json', bearing, function (newGameState) {
                this.updateGlobalGameState(newGameState);
            }.bind(this), function (e) {
                // todo - better error handling!
                var message = 'Error making move';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            });
        }
    }, {
        key: 'hubOption',
        value: function hubOption(key, direction) {
            return React.createElement(BoardHubOption, {
                key: key,
                directionKey: key,
                direction: direction,
                distanceMultiplier: this.state.gameState.gameSettings.distanceMultiplier,
                onChangeHub: this.changeHub.bind(this) });
        }
    }, {
        key: 'render',
        value: function render() {
            var gameState = this.state.gameState;
            if (!gameState.position.isInHub) {
                return React.createElement(
                    'div',
                    { className: 'grid' },
                    React.createElement(
                        'div',
                        { className: 'g' },
                        React.createElement(BoardLocationSpoke, { position: gameState.position })
                    )
                );
            }

            var location = React.createElement(BoardLocationHub, { position: gameState.position }),
                hubOptions = [this.hubOption('nw', gameState.directions.nw), this.hubOption('ne', gameState.directions.ne), this.hubOption('w', gameState.directions.w), this.hubOption('e', gameState.directions.e), this.hubOption('sw', gameState.directions.sw), this.hubOption('se', gameState.directions.se)];

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
            this.props.onChangeHub(this.props.direction.bearing);
        }
    }, {
        key: 'displayDistance',
        value: function displayDistance(distance) {
            if (distance === 0) {
                var secs = Math.floor(this.props.distanceMultiplier / 60);
                return Math.max(secs, 1) + ' seconds';
            }
            var totalSeconds = distance * this.props.distanceMultiplier,
                hours = totalSeconds / 3600;

            if (hours == 1) {
                return hours + ' hour';
            } else if (hours > 1) {
                return hours + ' hours';
            }
            return totalSeconds / 60 + ' minutes';
        }
    }, {
        key: 'render',
        value: function render() {
            var directionEl = null,
                direction = this.props.direction;

            if (direction) {
                var crossingVoid = null;
                if (direction.crossesTheVoid) {
                    crossingVoid = React.createElement(
                        'p',
                        null,
                        'CROSSING THE VOID'
                    );
                }
                directionEl = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h4',
                        null,
                        direction.hub.name,
                        ' - ',
                        direction.hub.cluster.name
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Distance: ',
                        this.displayDistance(direction.distance),
                        React.createElement(
                            'button',
                            { onClick: this.goToHub.bind(this) },
                            'Go there'
                        )
                    ),
                    crossingVoid
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
                directionEl
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
            var haven = null;
            if (this.props.position.location.isHaven) {
                haven = React.createElement(
                    'p',
                    null,
                    '(Safe Haven)'
                );
            }

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    this.props.position.location.name
                ),
                React.createElement(
                    'h2',
                    null,
                    this.props.position.location.cluster.name
                ),
                haven
            );
        }
    }]);

    return BoardLocationHub;
}(React.Component);

var BoardLocationSpoke = function (_React$Component3) {
    _inherits(BoardLocationSpoke, _React$Component3);

    function BoardLocationSpoke() {
        _classCallCheck(this, BoardLocationSpoke);

        var _this4 = _possibleConstructorReturn(this, (BoardLocationSpoke.__proto__ || Object.getPrototypeOf(BoardLocationSpoke)).call(this));

        _this4.allowAnimationUpdate = false;
        _this4.state = {
            timeLeft: null
        };
        return _this4;
    }

    _createClass(BoardLocationSpoke, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.allowAnimationUpdate = true;
            this.updateTimeLeft();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.allowAnimationUpdate = false;
        }
    }, {
        key: 'padNumber',
        value: function padNumber(number) {
            number = number.toString();
            var pad = '00';
            return pad.substring(0, pad.length - number.length) + number;
        }
    }, {
        key: 'updateTimeLeft',
        value: function updateTimeLeft() {
            if (!this.allowAnimationUpdate) {
                return;
            }

            var now = new Date(),
                calcTime = new Date(this.props.position.exitTime),
                secondsDiff = Math.floor((calcTime.getTime() - now.getTime()) / 1000),
                hours = Math.floor(secondsDiff / 3600),
                hoursRem = secondsDiff - hours * 3600,
                minutes = Math.floor(hoursRem / 60),
                seconds = hoursRem - minutes * 60;

            if (secondsDiff <= 0) {
                this.setState({
                    timeLeft: 0
                });
                // todo - actually go and fetch the status and updating inline rather than refreshing
                window.location.reload();
                return;
            }

            var timeLeft = hours + ':' + this.padNumber(minutes) + ':' + this.padNumber(seconds);

            this.setState({
                timeLeft: timeLeft
            });
            window.requestAnimationFrame(this.updateTimeLeft.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var destination = this.props.position.destination,
                arrivalTime = void 0;

            if (this.state.timeLeft === 0) {
                arrivalTime = React.createElement(
                    'h1',
                    null,
                    'Arriving now....'
                );
            } else {
                arrivalTime = React.createElement(
                    'h1',
                    null,
                    'Arriving in ',
                    this.state.timeLeft
                );
            }

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    'Travelling'
                ),
                React.createElement(
                    'h2',
                    null,
                    'Destination'
                ),
                React.createElement(
                    'h3',
                    null,
                    destination.name
                ),
                React.createElement(
                    'h4',
                    null,
                    destination.cluster.name
                ),
                arrivalTime
            );
        }
    }]);

    return BoardLocationSpoke;
}(React.Component);

},{"../../utils/FetchJson":11,"../Utils/Points":9,"./GamePanel":4}],4:[function(require,module,exports){
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
                    player.nickname
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

},{"../Utils/Points":9,"./GamePanel":4}],6:[function(require,module,exports){
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

var Player = function (_React$Component) {
    _inherits(Player, _React$Component);

    function Player() {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

        _this.refetchInterval = null;
        _this.state = {
            gameState: null
        };
        return _this;
    }

    _createClass(Player, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.fetchLatestData();
        }
    }, {
        key: 'fetchLatestData',
        value: function fetchLatestData() {
            _FetchJson2.default.getUrl('/play/status.json', function (data) {
                this.setState({
                    gameState: data
                });
                // temporailly disabled due to sandbox performance
                // setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this), function (e) {
                // fail silently
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.state.gameState) {
                return null;
            }

            var player = this.state.gameState.player;
            return _react2.default.createElement(
                'div',
                { className: 'header__player' },
                _react2.default.createElement(
                    'span',
                    { className: 'header__points' },
                    _react2.default.createElement(_Points2.default, {
                        value: player.points,
                        time: player.pointsCalculationTime,
                        rate: player.pointsRate
                    })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'header__playername' },
                    player.nickname
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'header__settings' },
                    _react2.default.createElement(
                        'svg',
                        {
                            className: 'header__settings-icon',
                            viewBox: '0 0 24 24',
                            xmlns: 'http://www.w3.org/2000/svg' },
                        _react2.default.createElement('use', { xlinkHref: '#icon-settings' })
                    )
                )
            );
        }
    }]);

    return Player;
}(_react2.default.Component);

exports.default = Player;

},{"../utils/FetchJson":11,"./utils/Points":10,"react":"react"}],7:[function(require,module,exports){
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
            this.setState({
                playersData: this.props.playersData
            });
            setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
        }
    }, {
        key: 'fetchLatestData',
        value: function fetchLatestData() {
            _FetchJson2.default.getUrl('/hubs/' + this.props.hubKey + '.json', function (data) {
                this.setState({
                    playersData: data.players
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
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

},{"../utils/FetchJson":11,"./utils/Points":10,"react":"react"}],8:[function(require,module,exports){
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

var Player = function (_React$Component) {
    _inherits(Player, _React$Component);

    function Player() {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

        _this.refetchInterval = null;
        _this.state = {
            player: null,
            position: null
        };
        return _this;
    }

    _createClass(Player, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({
                player: this.props.playerData.player,
                position: this.props.playerData.position
            });
            setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
        }
    }, {
        key: 'fetchLatestData',
        value: function fetchLatestData() {
            _FetchJson2.default.getUrl(this.state.player.url + '.json', function (data) {
                this.setState({
                    player: data.player,
                    position: data.position
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this), function (e) {
                // fail silently
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var player = this.state.player,
                position = this.state.position,
                positionState = _react2.default.createElement(
                'p',
                null,
                'Travelling'
            );

            if (position.isInHub) {
                var hub = position.location;
                positionState = _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'h3',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: hub.url },
                            hub.name
                        )
                    ),
                    _react2.default.createElement(
                        'p',
                        null,
                        hub.cluster.name
                    )
                );
            }

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h1',
                    { className: 'g-unit' },
                    player.nickname
                ),
                _react2.default.createElement(_Points2.default, {
                    value: player.points,
                    time: player.pointsCalculationTime,
                    rate: player.pointsRate
                }),
                _react2.default.createElement(
                    'h2',
                    null,
                    'Clan'
                ),
                _react2.default.createElement(
                    'p',
                    null,
                    'Not a clan member'
                ),
                _react2.default.createElement(
                    'h2',
                    null,
                    'Current Location'
                ),
                positionState,
                _react2.default.createElement(
                    'h2',
                    null,
                    'Hubs owned'
                )
            );
        }
    }]);

    return Player;
}(_react2.default.Component);

exports.default = Player;

},{"../utils/FetchJson":11,"./utils/Points":10,"react":"react"}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

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
        key: "componentWillMount",
        value: function componentWillMount() {
            this.allowAnimationUpdate = true;
            this.updatePoints();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.allowAnimationUpdate = false;
        }
    }, {
        key: "updatePoints",
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
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "span",
                { className: "points" },
                _react2.default.createElement(
                    "span",
                    { className: "points__icon" },
                    _react2.default.createElement(
                        "svg",
                        {
                            viewBox: "0 0 104 120",
                            xmlns: "http://www.w3.org/2000/svg" },
                        _react2.default.createElement("use", { xlinkHref: "#icon-hexagon" })
                    )
                ),
                this.state.pointValue
            );
        }
    }]);

    return Points;
}(_react2.default.Component);

exports.default = Points;

},{"react":"react"}],10:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9,"react":"react"}],11:[function(require,module,exports){
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
    }, {
        key: 'postUrl',
        value: function postUrl(url, data, successCallback, failureCallback) {
            var request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

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

            request.send(data);
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
