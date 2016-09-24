import React from 'react';
import ReactDOM from 'react-dom';
import FetchJson from './utils/FetchJson';
import Game from './game/Game';
import Hub from './game/Hub';
import Player from './game/Player';
import Header from './game/Header';

(function() {
    "use strict";

    let appHeader = document.getElementById('app-header'),
        appGame = document.getElementById('app-game'),
        appHub = document.getElementById('app-hub'),
        appPlayer = document.getElementById('app-player'),
        updateInterval = (20 * 1000);

    function unsupported() {
        if (appGame) {
            appGame.innerHTML = '<p>Your browser does not support this game</p>';
        }
    }

    function init() {

        // todo - get the header to update dynamically?

        if (appHeader) {
            // todo - use initial state if present?
            ReactDOM.render(
                <Header
                    updateInterval={updateInterval}
                />,
                appHeader
            );
        }

        if (appGame) {
            // todo - use initial state for the game to be faster
            FetchJson.getUrl(
                '/play/status.json',
                function (gameState) {

                    if (appGame) {
                        ReactDOM.render(<Game gameState={gameState}/>, appGame);
                    }
                },
                function (e) {
                    let message = 'Error getting status';
                    if (e) {
                        message += ' - ' + e.message;
                    }
                    alert(message);
                }
            );



            // if ('serviceWorker' in navigator ) {
            //     navigator.serviceWorker.register('/sw.js', {scope:'/'});
            // }
        }

        if (appHub) {
            // todo - initial should be whole dataset (and then not need a hubkey)
            let playersData = appHub.dataset.initial;

            if (playersData) {
                playersData = JSON.parse(playersData);
            } else {
                playersData = [];
            }
            ReactDOM.render(
                <Hub
                    playersData={playersData}
                    hubKey={appHub.dataset.hubkey}
                    updateInterval={updateInterval}
                />,
                appHub
            );
        }

        if (appPlayer) {
            let playerData = JSON.parse(appPlayer.dataset.initial);
            ReactDOM.render(
                <Player
                    playerData={playerData}
                    updateInterval={updateInterval}
                />,
                appPlayer
            );
        }
    }

    if (
        document.getElementsByClassName &&
        document.addEventListener
    ) {
        init();
    } else {
        unsupported();
    }
})();
