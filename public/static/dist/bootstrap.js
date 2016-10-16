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

var _Players = require('./game/Players');

var _Players2 = _interopRequireDefault(_Players);

var _Header = require('./game/Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    "use strict";

    var appHeader = document.getElementById('app-header'),
        appGame = document.getElementById('app-game'),
        appHub = document.getElementById('app-hub'),
        appPlayer = document.getElementById('app-player'),
        appPlayersList = document.getElementById('app-players-list'),
        updateInterval = 20 * 1000;

    function unsupported() {
        if (appGame) {
            appGame.innerHTML = '<p>Your browser does not support this game</p>';
        }
    }

    function init() {

        // todo - get the header to update dynamically (when hearing an event)?

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
            var hubData = appHub.dataset.initial;

            if (hubData) {
                hubData = JSON.parse(hubData);
            } else {
                hubData = [];
            }
            _reactDom2.default.render(_react2.default.createElement(_Hub2.default, {
                hubData: hubData,
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

        if (appPlayersList) {
            var initialData = JSON.parse(appPlayersList.dataset.initial);
            _reactDom2.default.render(_react2.default.createElement(_Players2.default, {
                initialData: initialData,
                updateInterval: updateInterval
            }), appPlayersList);
        }

        // todo - reuse code in this bootstrap file
    }

    if (document.getElementsByClassName && document.addEventListener) {
        init();
    } else {
        unsupported();
    }
})();

},{"./game/Game":2,"./game/Header":9,"./game/Hub":10,"./game/Player":11,"./game/Players":12,"./utils/FetchJson":17,"react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
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

var _Abilities = require('./GamePanel/Abilities');

var _Abilities2 = _interopRequireDefault(_Abilities);

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
                    _react2.default.createElement(_Abilities2.default, { gameState: this.state.gameState, onGameUpdate: this.updateGameState.bind(this) })
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

},{"./GamePanel/Abilities":3,"./GamePanel/Board":4,"./GamePanel/Player":8,"react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GamePanel2 = require('./GamePanel');

var _GamePanel3 = _interopRequireDefault(_GamePanel2);

var _Lightbox = require('../../utils/Lightbox');

var _Lightbox2 = _interopRequireDefault(_Lightbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Abilities = function (_GamePanel) {
    _inherits(Abilities, _GamePanel);

    function Abilities() {
        _classCallCheck(this, Abilities);

        return _possibleConstructorReturn(this, (Abilities.__proto__ || Object.getPrototypeOf(Abilities)).apply(this, arguments));
    }

    _createClass(Abilities, [{
        key: 'render',
        value: function render() {
            var abilities = this.state.gameState.abilities,
                groups = [];

            abilities.forEach(function (group, i) {
                groups.push(_react2.default.createElement(
                    'li',
                    { key: i, className: 'abilities-list__group' },
                    _react2.default.createElement(AbilitiesGroup, { group: group })
                ));
            });

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h2',
                    null,
                    'Abilities'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'abilities-list' },
                    groups
                )
            );
        }
    }]);

    return Abilities;
}(_GamePanel3.default);

exports.default = Abilities;

var AbilitiesGroup = function (_React$Component) {
    _inherits(AbilitiesGroup, _React$Component);

    function AbilitiesGroup() {
        _classCallCheck(this, AbilitiesGroup);

        return _possibleConstructorReturn(this, (AbilitiesGroup.__proto__ || Object.getPrototypeOf(AbilitiesGroup)).apply(this, arguments));
    }

    _createClass(AbilitiesGroup, [{
        key: 'render',
        value: function render() {
            var items = [];

            this.props.group.items.forEach(function (item, i) {
                items.push(_react2.default.createElement(
                    'li',
                    { key: i, className: 'abilities-list__item g' },
                    _react2.default.createElement(AbilitiesItem, { item: item })
                ));
            });

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h3',
                    { className: 'abilities-list__group-heading e' },
                    this.props.group.title
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'abilities-list__group-items grid' },
                    items
                )
            );
        }
    }]);

    return AbilitiesGroup;
}(_react2.default.Component);

var AbilitiesItem = function (_React$Component2) {
    _inherits(AbilitiesItem, _React$Component2);

    function AbilitiesItem() {
        _classCallCheck(this, AbilitiesItem);

        var _this3 = _possibleConstructorReturn(this, (AbilitiesItem.__proto__ || Object.getPrototypeOf(AbilitiesItem)).call(this));

        _this3.state = {
            modalOpen: false
        };
        return _this3;
    }

    _createClass(AbilitiesItem, [{
        key: 'onClick',
        value: function onClick() {
            this.setState({
                modalOpen: true
            });
        }
    }, {
        key: 'useAbility',
        value: function useAbility() {
            alert('Forcefield!');
        }
    }, {
        key: 'modalCloseCallback',
        value: function modalCloseCallback() {
            this.setState({
                modalOpen: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var item = this.props.item;

            if (item.mystery) {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'button',
                        { className: 'ability ability--mystery', onClick: this.onClick.bind(this) },
                        _react2.default.createElement(
                            'span',
                            { className: 'ability__name' },
                            '?'
                        ),
                        _react2.default.createElement(
                            'span',
                            { className: 'ability__count' },
                            '-'
                        )
                    ),
                    _react2.default.createElement(
                        _Lightbox2.default,
                        { modalIsOpen: this.state.modalOpen,
                            closeCallback: this.modalCloseCallback.bind(this),
                            title: '?' },
                        _react2.default.createElement(
                            'p',
                            null,
                            'You are yet to unlock this ability (by finding it in the wild)'
                        )
                    )
                );
            }

            var abilityClass = 'ability ',
                useButton = null;

            if (item.count) {
                useButton = _react2.default.createElement(
                    'p',
                    { className: 'text--center' },
                    _react2.default.createElement(
                        'button',
                        { onClick: this.useAbility.bind(this) },
                        'Use now'
                    )
                );
            } else {
                abilityClass += 'ability--empty';
            }
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'button',
                    { className: abilityClass, onClick: this.onClick.bind(this) },
                    _react2.default.createElement(
                        'span',
                        { className: 'ability__name' },
                        item.ability.name
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'ability__count' },
                        item.count
                    )
                ),
                _react2.default.createElement(
                    _Lightbox2.default,
                    { modalIsOpen: this.state.modalOpen,
                        closeCallback: this.modalCloseCallback.bind(this),
                        title: item.ability.name },
                    _react2.default.createElement(
                        'p',
                        null,
                        item.ability.description
                    ),
                    _react2.default.createElement(
                        'p',
                        { className: 'text--center' },
                        'Number available: ',
                        item.count
                    ),
                    useButton
                )
            );
        }
    }]);

    return AbilitiesItem;
}(_react2.default.Component);

},{"../../utils/Lightbox":18,"./GamePanel":7,"react":"react"}],4:[function(require,module,exports){
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

var _Spoke = require('./Board/Spoke');

var _Spoke2 = _interopRequireDefault(_Spoke);

var _Map = require('./Board/Map');

var _Map2 = _interopRequireDefault(_Map);

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
                var message = 'Error making move (did you try to cheat)';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            });
        }
    }, {
        key: 'takeHub',
        value: function takeHub() {
            // todo loading state (fancy animation?)
            _FetchJson2.default.postUrl('/play/take-hub.json', null, function (newGameState) {
                this.updateGlobalGameState(newGameState);
            }.bind(this), function (e) {
                // todo - better error handling!
                var message = 'Error (did you try to cheat)';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var gameState = this.state.gameState;
            if (!gameState.position.isInHub) {
                return React.createElement(
                    'div',
                    { className: 'grid grid--flat' },
                    React.createElement(
                        'div',
                        { className: 'g 2/3@xl' },
                        React.createElement(_Map2.default, { gameState: this.state.gameState })
                    ),
                    React.createElement(
                        'div',
                        { className: 'g 1/3@xl game__panel--location' },
                        React.createElement(_Spoke2.default, {
                            onGameStateChange: this.updateGlobalGameState.bind(this),
                            position: gameState.position })
                    )
                );
            }

            var location = React.createElement(BoardLocationHub, { onTakeHub: this.takeHub.bind(this), gameState: gameState });

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

            var abilities = [];
            if (gameState.abilitiesPresent && gameState.abilitiesPresent.length > 0) {
                gameState.abilitiesPresent.forEach(function (ability, i) {
                    abilities.push(React.createElement(
                        'p',
                        { key: i },
                        ability.name
                    ));
                });
            }

            return React.createElement(
                'div',
                { className: 'grid grid--flat' },
                React.createElement(
                    'div',
                    { className: 'g 2/3@xl' },
                    React.createElement(_Map2.default, { onChangeHub: this.changeHub.bind(this), gameState: this.state.gameState })
                ),
                React.createElement(
                    'div',
                    { className: 'g 1/3@xl game__panel--location' },
                    location,
                    playersPresent,
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h2',
                            null,
                            'Abilities here'
                        ),
                        abilities
                    )
                )
            );
        }
    }]);

    return Board;
}(_GamePanel3.default);

exports.default = Board;

var BoardLocationHub = function (_React$Component) {
    _inherits(BoardLocationHub, _React$Component);

    function BoardLocationHub() {
        _classCallCheck(this, BoardLocationHub);

        return _possibleConstructorReturn(this, (BoardLocationHub.__proto__ || Object.getPrototypeOf(BoardLocationHub)).apply(this, arguments));
    }

    _createClass(BoardLocationHub, [{
        key: 'render',
        value: function render() {
            var haven = null,
                options = null,
                gameState = this.props.gameState,
                position = gameState.position,
                protectionScore = null,
                owner = null;
            if (position.location.isHaven) {
                haven = React.createElement(
                    'p',
                    null,
                    '(Safe Haven)'
                );
            } else {
                if (position.location.protectionScore) {
                    protectionScore = React.createElement(
                        'h3',
                        null,
                        protectionScore
                    );
                }
                if (position.location.owner) {
                    owner = React.createElement(
                        'h3',
                        null,
                        'Owner ',
                        position.location.owner.nickname
                    );
                }
                if (position.location.owner) {
                    // todo - no attack buttons if it's your own hub
                    options = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'button',
                            null,
                            'Attack'
                        )
                    );
                } else {
                    var disabled = gameState.player.points < gameState.gameSettings.originalPurchaseCost;
                    options = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'button',
                            {
                                onClick: this.props.onTakeHub.bind(this),
                                disabled: disabled },
                            'Take this hub (',
                            gameState.gameSettings.originalPurchaseCost,
                            ')'
                        )
                    );
                }
            }

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    position.location.name
                ),
                React.createElement(
                    'h2',
                    null,
                    position.location.cluster.name
                ),
                protectionScore,
                owner,
                haven,
                options
            );
        }
    }]);

    return BoardLocationHub;
}(React.Component);

/*
 class BoardHubOption extends React.Component {
 goToHub() {
 this.props.onChangeHub(this.props.direction.bearing);
 }

 displayDistance(distance) {
 if (distance === 0) {
 let secs = Math.floor(this.props.distanceMultiplier/60);
 return Math.max(secs, 1) + ' seconds';
 }
 let totalSeconds = distance * this.props.distanceMultiplier,
 hours = (totalSeconds / 3600);

 if (hours == 1) {
 return hours + ' hour';
 } else if (hours > 1) {
 return hours + ' hours';
 }
 return totalSeconds/60 + ' minutes';
 }

 render() {
 let directionEl = null,
 direction = this.props.direction;

 if (direction) {
 let crossingVoid = null;
 if (direction.crossesTheVoid) {
 crossingVoid = (<p>CROSSING THE VOID</p>);
 }
 directionEl = (
 <div>
 <h4>{direction.hub.name} - {direction.hub.cluster.name}</h4>
 <p>
 Distance: {this.displayDistance(direction.distance)}
 <button onClick={this.goToHub.bind(this)}>Go there</button>
 </p>
 {crossingVoid}
 </div>
 );
 }

 return (
 <div className="g 1/2">
 <h3>{this.props.directionKey}</h3>
 {directionEl}
 </div>
 );
 }
 }
 */

},{"../../utils/FetchJson":17,"../Utils/Points":14,"./Board/Map":5,"./Board/Spoke":6,"./GamePanel":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GamePanel2 = require('../GamePanel');

var _GamePanel3 = _interopRequireDefault(_GamePanel2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Map = function (_GamePanel) {
    _inherits(Map, _GamePanel);

    function Map() {
        _classCallCheck(this, Map);

        var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this));

        _this.hexRadius = 32;
        _this.averageVerticalDiameter = 1.5 * _this.hexRadius;
        _this.innerRadius = Math.sqrt(3) / 2 * _this.hexRadius;
        _this.innerDiameter = _this.innerRadius * 2;
        _this.xOffset = 0;
        _this.yOffset = 0;
        _this.middleX = 0;
        _this.middleY = 0;
        _this.totalCol = 0;
        _this.totalRow = 0;
        _this.state.containerHeight = null;
        _this.state.containerWidth = null;
        return _this;
    }

    _createClass(Map, [{
        key: 'handleSize',
        value: function handleSize() {
            var _refs$mapContainer = this.refs.mapContainer;
            var clientHeight = _refs$mapContainer.clientHeight;
            var clientWidth = _refs$mapContainer.clientWidth;

            this.setState({
                containerHeight: clientHeight,
                containerWidth: clientWidth
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.handleSize();
            window.addEventListener('resize', this.handleSize.bind(this));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.handleSize.bind(this));
        }
    }, {
        key: 'handleMove',
        value: function handleMove(bearing) {
            this.props.onChangeHub(bearing);
        }
    }, {
        key: 'hexPoints',
        value: function hexPoints(xCoord, yCoord) {
            var center = this.coordToHexCentre(xCoord, yCoord),
                x = center.x,
                y = center.y,
                points = [],
                theta = void 0;
            for (theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
                var pointX = x + this.hexRadius * Math.sin(theta);
                var pointY = y + this.hexRadius * Math.cos(theta);
                points.push(pointX + ',' + pointY);
            }
            return points.join(' ');
        }
    }, {
        key: 'coordToHexCentre',
        value: function coordToHexCentre(col, row) {
            var offset = Math.sqrt(3) * this.hexRadius / 2,
                x = this.xOffset + offset * col * 2,
                y = this.yOffset + offset * row * Math.sqrt(3);
            if (row % 2 !== 0) {
                x = x + offset;
            }
            return { x: x, y: y };
        }
    }, {
        key: 'makeHexagonPolygon',
        value: function makeHexagonPolygon(x, y, className) {
            var coord = x + '-' + y;
            return _react2.default.createElement('polygon', {
                key: coord,
                xmlns: 'http://www.w3.org/2000/svg',
                points: this.hexPoints(x, y),
                className: className });
        }
    }, {
        key: 'colToX',
        value: function colToX(col) {
            return col - this.middleX;
        }
    }, {
        key: 'rowToY',
        value: function rowToY(row) {
            return row - this.middleY;
        }
    }, {
        key: 'xToCol',
        value: function xToCol(x) {
            return x + this.middleX;
        }
    }, {
        key: 'yToRow',
        value: function yToRow(y) {
            return y + this.middleY;
        }
    }, {
        key: 'calculateLayout',
        value: function calculateLayout() {
            this.totalCol = Math.ceil(this.state.containerWidth / this.innerDiameter);
            this.totalRow = Math.ceil(this.state.containerHeight / this.averageVerticalDiameter);
            this.middleX = Math.floor(this.totalCol / 2) - 1;
            this.middleY = Math.floor(this.totalRow / 2) - 1;

            // middleY needs to always be an odd numbered row for the maths to work
            if (!(this.middleY % 2)) {
                this.middleY++;
            }

            // how close is the middle of the centre hex from the middle of the container
            var centerX = this.innerRadius * (this.middleX * 2 + 1);
            var centerY = this.averageVerticalDiameter * this.middleY;

            this.xOffset = this.state.containerWidth / 2 - centerX;
            this.yOffset = this.state.containerHeight / 2 - centerY;
        }
    }, {
        key: 'drawGrid',
        value: function drawGrid() {
            var col = void 0,
                row = void 0,
                polygons = [];

            var revealed = this.state.gameState.map.visibleSpaces;

            // going from -1 to 1 over to ensure we don't see the edges
            for (col = -1; col <= this.totalCol; col++) {
                for (row = -1; row <= this.totalRow; row++) {
                    var className = 'map__grid ',
                        x = this.colToX(col),
                        y = this.rowToY(row);

                    if (revealed[y] && revealed[y][x]) {
                        className += 'map__grid--visible';
                    }

                    polygons.push(this.makeHexagonPolygon(col, row, className));
                }
            }
            return polygons;
        }
    }, {
        key: 'drawCurrentHub',
        value: function drawCurrentHub() {
            // current position is always at the origin
            var position = this.state.gameState.map.currentMapPosition.position,
                className = 'map__hub map__hub--current ';
            if (position.isInHub && position.location.isHaven) {
                className += 'map__hub--haven';
            }
            return this.makeHexagonPolygon(this.xToCol(0), this.yToRow(0), className);
        }
    }, {
        key: 'drawHubs',
        value: function drawHubs() {
            var hubs = [];
            this.state.gameState.map.linkedHubs.forEach(function (hub) {
                var onClick = function () {
                    this.handleMove(hub.bearing);
                }.bind(this),
                    className = 'map__hub map__hub--available ';
                if (hub.hub.isHaven) {
                    className += 'map__hub--haven';
                }
                hubs.push(_react2.default.createElement(MapPolygon, { points: this.hexPoints(this.xToCol(hub.x), this.yToRow(hub.y)),
                    hub: hub,
                    onClick: onClick,
                    key: hub.x + '-' + hub.y,
                    className: className }));
            }.bind(this));
            return hubs;
        }
    }, {
        key: 'drawSpokes',
        value: function drawSpokes() {
            var spokes = [];
            this.state.gameState.map.linkedHubs.forEach(function (hub) {
                var start = this.coordToHexCentre(this.xToCol(0), this.yToRow(0)),
                    end = this.coordToHexCentre(this.xToCol(hub.x), this.yToRow(hub.y)),
                    className = 'map__spoke ';
                if (hub.crossesTheVoid) {
                    className += 'map__spoke--void';
                }
                spokes.push(_react2.default.createElement(MapSpoke, { key: Math.random(),
                    x1: start.x,
                    y1: start.y,
                    x2: end.x,
                    y2: end.y,
                    className: className }));
            }.bind(this));
            return spokes;
        }
    }, {
        key: 'render',
        value: function render() {
            this.calculateLayout();
            var grid = this.drawGrid(),
                current = this.drawCurrentHub(),
                hubs = this.drawHubs(),
                spokes = this.drawSpokes();
            return _react2.default.createElement(
                'div',
                { className: 'map', ref: 'mapContainer' },
                _react2.default.createElement(
                    'svg',
                    { className: 'map__board', xmlns: 'http://www.w3.org/2000/svg',
                        width: this.state.containerWidth,
                        height: this.state.containerHeight },
                    grid,
                    spokes,
                    hubs,
                    current
                )
            );
        }
    }]);

    return Map;
}(_GamePanel3.default);

exports.default = Map;

var MapPolygon = function (_React$Component) {
    _inherits(MapPolygon, _React$Component);

    function MapPolygon() {
        _classCallCheck(this, MapPolygon);

        return _possibleConstructorReturn(this, (MapPolygon.__proto__ || Object.getPrototypeOf(MapPolygon)).apply(this, arguments));
    }

    _createClass(MapPolygon, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement('polygon', {
                xmlns: 'http://www.w3.org/2000/svg',
                points: this.props.points,
                onClick: this.props.onClick,
                className: this.props.className });
        }
    }]);

    return MapPolygon;
}(_react2.default.Component);

var MapSpoke = function (_React$Component2) {
    _inherits(MapSpoke, _React$Component2);

    function MapSpoke() {
        _classCallCheck(this, MapSpoke);

        return _possibleConstructorReturn(this, (MapSpoke.__proto__ || Object.getPrototypeOf(MapSpoke)).apply(this, arguments));
    }

    _createClass(MapSpoke, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement('line', {
                xmlns: 'http://www.w3.org/2000/svg',
                x1: this.props.x1,
                x2: this.props.x2,
                y1: this.props.y1,
                y2: this.props.y2,
                className: this.props.className });
        }
    }]);

    return MapSpoke;
}(_react2.default.Component);

},{"../GamePanel":7,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FetchJson = require('../../../utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Points = require('../../Utils/Points');

var _Points2 = _interopRequireDefault(_Points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Spoke = function (_React$Component) {
    _inherits(Spoke, _React$Component);

    function Spoke() {
        _classCallCheck(this, Spoke);

        var _this = _possibleConstructorReturn(this, (Spoke.__proto__ || Object.getPrototypeOf(Spoke)).call(this));

        _this.allowAnimationUpdate = false;
        _this.state = {
            timeLeft: null,
            positionStyle: null
        };
        return _this;
    }

    _createClass(Spoke, [{
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
        key: 'arrival',
        value: function arrival() {
            _FetchJson2.default.getUrl('/play/arrival.json', function (newGameState) {
                if (newGameState.position.isInHub) {
                    this.props.onGameStateChange(newGameState);
                } else {
                    // try again (in case the JS is ahead of the server somehow)
                    this.arrival();
                }
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
                entryCalcTime = new Date(this.props.position.entryTime),
                secondsDiff = (calcTime.getTime() - now.getTime()) / 1000,
                roundedSecondsDiff = Math.floor(secondsDiff),
                totalDiff = (calcTime.getTime() - entryCalcTime.getTime()) / 1000,
                hours = Math.floor(roundedSecondsDiff / 3600),
                hoursRem = roundedSecondsDiff - hours * 3600,
                minutes = Math.floor(hoursRem / 60),
                seconds = hoursRem - minutes * 60,
                positionPercent = (totalDiff - secondsDiff) / totalDiff * 100,
                positionStyle = { left: positionPercent + '%' };

            if (secondsDiff <= 0) {
                this.setState({
                    timeLeft: 0,
                    positionStyle: { left: '100%' }
                });
                this.arrival();
                return;
            }

            var timeLeft = hours + ':' + this.padNumber(minutes) + ':' + this.padNumber(seconds);

            this.setState({
                timeLeft: timeLeft,
                positionStyle: positionStyle
            });
            window.requestAnimationFrame(this.updateTimeLeft.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var destination = this.props.position.destination,
                origin = this.props.position.origin,
                arrivalTime = void 0;

            if (this.state.timeLeft === 0) {
                arrivalTime = 'now';
            } else {
                arrivalTime = this.state.timeLeft;
            }

            return _react2.default.createElement(
                'div',
                { className: 'game__travelling grid' },
                _react2.default.createElement(
                    'div',
                    { className: 'g' },
                    _react2.default.createElement(
                        'p',
                        { className: 'a text--center' },
                        'Travelling'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'g' },
                    _react2.default.createElement(
                        'div',
                        { className: 'grid grid--flush' },
                        _react2.default.createElement(
                            'div',
                            { className: 'g 1/6 g--align-center' },
                            _react2.default.createElement(
                                'div',
                                { className: 'text--right game__travelling-hubname' },
                                _react2.default.createElement(
                                    'h3',
                                    null,
                                    origin.name
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    origin.cluster.name
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'g 1/6 g--align-center' },
                            _react2.default.createElement(
                                'div',
                                { className: 'game__travelling-hub' },
                                _react2.default.createElement(
                                    'svg',
                                    {
                                        viewBox: '0 0 104 120',
                                        xmlns: 'http://www.w3.org/2000/svg' },
                                    _react2.default.createElement('use', { xlinkHref: '#icon-hexagon' })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'g 1/3 g--align-center' },
                            _react2.default.createElement(
                                'p',
                                { className: 'text--center' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'b' },
                                    'Arriving'
                                ),
                                _react2.default.createElement('br', null),
                                _react2.default.createElement(
                                    'span',
                                    { className: 'c' },
                                    arrivalTime
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'game__travelling-map' },
                                _react2.default.createElement('div', { className: 'game__travelling-line' }),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'game__travelling-position', style: this.state.positionStyle },
                                    _react2.default.createElement('span', { className: 'location' })
                                )
                            ),
                            _react2.default.createElement(
                                'p',
                                { className: 'text--center' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'c' },
                                    _react2.default.createElement(_Points2.default, {
                                        value: 0,
                                        time: this.props.position.entryTime,
                                        rate: 1
                                    })
                                ),
                                _react2.default.createElement('br', null),
                                _react2.default.createElement(
                                    'span',
                                    { className: 'b' },
                                    'Earned on this journey'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'g 1/6 g--align-center' },
                            _react2.default.createElement(
                                'div',
                                { className: 'game__travelling-hub' },
                                _react2.default.createElement(
                                    'svg',
                                    {
                                        viewBox: '0 0 104 120',
                                        xmlns: 'http://www.w3.org/2000/svg' },
                                    _react2.default.createElement('use', { xlinkHref: '#icon-hexagon' })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'g 1/6 g--align-center' },
                            _react2.default.createElement(
                                'div',
                                { className: 'game__travelling-hubname' },
                                _react2.default.createElement(
                                    'h3',
                                    null,
                                    destination.name
                                ),
                                _react2.default.createElement(
                                    'h4',
                                    null,
                                    destination.cluster.name
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Spoke;
}(_react2.default.Component);

exports.default = Spoke;

},{"../../../utils/FetchJson":17,"../../Utils/Points":14,"react":"react"}],7:[function(require,module,exports){
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

},{"react":"react"}],8:[function(require,module,exports){
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
                })
            );
        }
    }]);

    return Player;
}(_GamePanel3.default);

exports.default = Player;

},{"../Utils/Points":14,"./GamePanel":7}],9:[function(require,module,exports){
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

},{"../utils/FetchJson":17,"./utils/Points":16,"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FetchJson = require('../utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Player = require('./utils/Player');

var _Player2 = _interopRequireDefault(_Player);

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
            hubData: null
        };
        return _this;
    }

    _createClass(Hub, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({
                hubData: this.props.hubData
            });
            setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
        }
    }, {
        key: 'fetchLatestData',
        value: function fetchLatestData() {
            _FetchJson2.default.getUrl(this.state.hubData.hub.url + '.json', function (data) {
                this.setState({
                    hubData: data
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this), function (e) {
                // fail silently
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var hub = this.state.hubData.hub,
                owner = 'Unowned',
                playersPresent = _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'p',
                    null,
                    'No players present in this hub'
                )
            );

            if (this.state.hubData.playersPresent) {
                (function () {

                    var players = [];

                    _this2.state.hubData.players.forEach(function (player) {
                        players.push(_react2.default.createElement(
                            'li',
                            { key: player.nickname, className: 'g 1/3' },
                            _react2.default.createElement(_Player2.default, { player: player })
                        ));
                    });

                    playersPresent = _react2.default.createElement(
                        'ul',
                        { className: 'grid' },
                        players
                    );
                })();
            }

            if (hub.owner) {
                owner = _react2.default.createElement(_Player2.default, { player: hub.owner });
            }

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h1',
                    { className: 'g-unit' },
                    hub.name
                ),
                _react2.default.createElement(
                    'p',
                    null,
                    hub.clusterName
                ),
                _react2.default.createElement(
                    'h2',
                    null,
                    'Owned by:'
                ),
                _react2.default.createElement(
                    'div',
                    { className: '1/3' },
                    owner
                ),
                _react2.default.createElement(
                    'h2',
                    null,
                    'Clan:'
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    '--clan--'
                ),
                _react2.default.createElement(
                    'h2',
                    null,
                    'Players present'
                ),
                playersPresent,
                _react2.default.createElement(
                    'h2',
                    null,
                    'Abilities available for pickup'
                )
            );
        }
    }]);

    return Hub;
}(_react2.default.Component);

exports.default = Hub;

},{"../utils/FetchJson":17,"./utils/Player":15,"react":"react"}],11:[function(require,module,exports){
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

},{"../utils/FetchJson":17,"./utils/Points":16,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FetchJson = require('../utils/FetchJson');

var _FetchJson2 = _interopRequireDefault(_FetchJson);

var _Player = require('./Utils/Player');

var _Player2 = _interopRequireDefault(_Player);

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
            data: null
        };
        return _this;
    }

    _createClass(Hub, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({
                data: this.props.initialData
            });
            setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
        }
    }, {
        key: 'fetchLatestData',
        value: function fetchLatestData() {
            _FetchJson2.default.getUrl('/players.json', function (data) {
                this.setState({
                    data: data
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this), function (e) {
                // fail silently
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var players = [];

            this.state.data.players.forEach(function (player) {
                players.push(_react2.default.createElement(
                    'li',
                    { className: 'g 1/2' },
                    _react2.default.createElement(_Player2.default, { key: player.nickname, player: player })
                ));
            });

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h1',
                    { className: 'g-unit' },
                    'Players'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'grid' },
                    players
                )
            );
        }
    }]);

    return Hub;
}(_react2.default.Component);

exports.default = Hub;

},{"../utils/FetchJson":17,"./Utils/Player":13,"react":"react"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Points = require('./Points');

var _Points2 = _interopRequireDefault(_Points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_React$Component) {
    _inherits(Player, _React$Component);

    function Player() {
        _classCallCheck(this, Player);

        return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).apply(this, arguments));
    }

    _createClass(Player, [{
        key: 'render',
        value: function render() {
            var player = this.props.player;
            return _react2.default.createElement(
                'a',
                { href: player.url, className: 'player' },
                _react2.default.createElement(
                    'h4',
                    { className: 'player__nickname' },
                    player.nickname
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'player__points' },
                    _react2.default.createElement(_Points2.default, {
                        value: player.points,
                        time: player.pointsCalculationTime,
                        rate: player.pointsRate
                    })
                )
            );
        }
    }]);

    return Player;
}(_react2.default.Component);

exports.default = Player;

},{"./Points":14,"react":"react"}],14:[function(require,module,exports){
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
                this.state.pointValue
            );
        }
    }]);

    return Points;
}(_react2.default.Component);

exports.default = Points;

},{"react":"react"}],15:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./Points":16,"dup":13,"react":"react"}],16:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14,"react":"react"}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Lightbox = function (_React$Component) {
    _inherits(Lightbox, _React$Component);

    function Lightbox() {
        _classCallCheck(this, Lightbox);

        var _this = _possibleConstructorReturn(this, (Lightbox.__proto__ || Object.getPrototypeOf(Lightbox)).call(this));

        _this.state = { modalIsOpen: false };
        return _this;
    }

    _createClass(Lightbox, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            this.setState({
                modalIsOpen: props.modalIsOpen
            });
        }
    }, {
        key: 'show',
        value: function show() {
            this.setState({ modalIsOpen: true });
        }
    }, {
        key: 'close',
        value: function close() {
            this.setState({ modalIsOpen: false });
            if (this.props.closeCallback) {
                this.props.closeCallback();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactModal2.default,
                {
                    isOpen: this.state.modalIsOpen,
                    onRequestClose: this.close.bind(this),
                    className: 'lightbox__panel',
                    overlayClassName: 'lightbox__overlay' },
                _react2.default.createElement(
                    'div',
                    { className: 'lightbox__topbar' },
                    _react2.default.createElement(
                        'button',
                        { className: 'lightbox__close', onClick: this.close.bind(this) },
                        _react2.default.createElement(
                            'svg',
                            {
                                viewBox: '0 0 24 24',
                                xmlns: 'http://www.w3.org/2000/svg' },
                            _react2.default.createElement('use', { xlinkHref: '#icon-close' })
                        )
                    ),
                    _react2.default.createElement(
                        'p',
                        { className: 'lightbox__title' },
                        this.props.title
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'lightbox__body' },
                    this.props.children
                )
            );
        }
    }]);

    return Lightbox;
}(_react2.default.Component);

exports.default = Lightbox;
;

},{"react":"react","react-modal":"react-modal"}],"react-dom":[function(require,module,exports){
"use strict";

module.exports = window.ReactDOM;

},{}],"react-modal":[function(require,module,exports){
"use strict";

module.exports = window.ReactModal;

},{}],"react":[function(require,module,exports){
"use strict";

module.exports = window.React;

},{}]},{},[1]);
