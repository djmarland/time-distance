import React from 'react';
import Board from './Board';
import Player from './Player';

export default class Game extends React.Component {
    static get PANEL_BOARD() { return 'board'; }
    static get PANEL_PLAYER() { return 'player'; }
    static get PANEL_ABILITIES() { return 'abilities'; }
    static get PANEL_SETTINGS() { return 'settings'; }
    constructor() {
        super();
        this.state = {
            activePanel : 'board',
            gameState : null
        };
    };

    componentWillMount() {
        this.updateGameState(this.props.gameState);
    }

    updateGameState(newState) {
        this.setState({
            gameState : newState
        });
    }

    render() {
        let panels = [];

        if (this.state.activePanel == Game.PANEL_SETTINGS) {
            panels.push(<div key="panel-settings">SETTINGS</div>);
        } else {
            let activeClass = "game__panel--active",
                boardClass = this.state.activePanel == Game.PANEL_BOARD ? activeClass : null,
                playerClass = this.state.activePanel == Game.PANEL_PLAYER ? activeClass : null,
                abilitiesClass = this.state.activePanel == Game.PANEL_ABILITIES ? activeClass : null;

            panels.push(
                <div key="panel-board" className={"game__panel game__panel--board g " + boardClass}>
                    <Board gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />
                </div>
            );
            panels.push(
                <div key="panel-player" className={"game__panel game__panel--player g 1/2@xl " + playerClass}>
                    <Player gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />
                </div>
            );
            panels.push(<div key="panel-abilities" className={"game__panel game__panel--abilities g 1/2@xl " + abilitiesClass}>ABILITIES</div>);
        }


        return (
            <div className="game grid grid--flush">
                <div className="g game__header">HEADER</div>
                {panels}
            </div>
        );
    };
}
