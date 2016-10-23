import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game/Game';
import Hub from './game/Hub';
import Player from './game/Player';
import Players from './game/Players';
import Header from './game/GamePanel/Header';

(function() {
    "use strict";

    let appContainer = document.getElementById('app-container'),
        headerContainer = document.getElementById('header-container'),
        loadingContainer = document.getElementById('app-loading'),
        updateInterval = (20 * 1000);

    function unsupported() {
        if (loadingContainer) {
            loadingContainer.innerHTML = '<p>Sorry, your browser does not support playing this game</p>';
        }
    }

    function init() {
        let app = appContainer.dataset.app ? appContainer : headerContainer,
            appType = app.dataset.app,
            initial = app.dataset.initial,
            initialData = null,
            appComponent = null;

        if (initial) {
            initialData = JSON.parse(initial);
        }

        switch (appType) {
            case 'header':
                appComponent = (<Header updateInterval={updateInterval} gameState={initialData} />);
                break;
            case 'game':
                appComponent = (<Game updateInterval={updateInterval} initialData={initialData} />);
                break;
            case 'hub':
                appComponent = (<Hub updateInterval={updateInterval} initialData={initialData} />);
                break;
            case 'player':
                appComponent = (<Player updateInterval={updateInterval} initialData={initialData} />);
                break;
            case 'players-list':
                appComponent = (<Players updateInterval={updateInterval} initialData={initialData} />);
                break;
            default:
        }

        if (appComponent) {
            ReactDOM.render(appComponent, app);
        }
    }

    if (
        JSON &&
        document.getElementsByClassName &&
        document.addEventListener
    ) {
        init();
    } else {
        unsupported();
    }
})();
