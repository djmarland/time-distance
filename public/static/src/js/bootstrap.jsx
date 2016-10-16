import React from 'react';
import ReactDOM from 'react-dom';
import FetchJson from './utils/FetchJson';
import Game from './game/Game';
import Hub from './game/Hub';
import Player from './game/Player';
import Players from './game/Players';
import Header from './game/Header';

(function() {
    "use strict";

    let appHeader = document.getElementById('app-header'),
        appGame = document.getElementById('app-game'),
        appHub = document.getElementById('app-hub'),
        appPlayer = document.getElementById('app-player'),
        appPlayersList = document.getElementById('app-players-list'),
        updateInterval = (20 * 1000);

    function unsupported() {
        if (appGame) {
            appGame.innerHTML = '<p>Your browser does not support this game</p>';
        }
    }

    function init() {

        // todo - get the header to update dynamically (when hearing an event)?

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
            let hubData = appHub.dataset.initial;

            if (hubData) {
                hubData = JSON.parse(hubData);
            } else {
                hubData = [];
            }
            ReactDOM.render(
                <Hub
                    hubData={hubData}
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

        if (appPlayersList) {
            let initialData = JSON.parse(appPlayersList.dataset.initial);
            ReactDOM.render(
                <Players
                    initialData={initialData}
                    updateInterval={updateInterval}
                />,
                appPlayersList
            );
        }

        // todo - reuse code in this bootstrap file
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
