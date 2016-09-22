import React from 'react';
import ReactDOM from 'react-dom';
import FetchJson from './utils/FetchJson';
import Game from './game/Game';

(function() {
    "use strict";

    function unsupported() {
        // todo - state that your browser is unsupported for this game
    }

    function init() {
        var appContainer = document.getElementById('app-container');

        FetchJson.getUrl(
            '/status.json',
            function(gameState) {
                document.body.classList.add('game-body');
                ReactDOM.render(<Game gameState={gameState.status} />, appContainer);
            },
            function(e) {
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

    // Cut the mustard
    if (
        document.getElementsByClassName &&
        document.addEventListener
    ) {
        init();
    } else {
        unsupported();
    }
})();
