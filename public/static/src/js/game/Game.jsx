import React from 'react';
import Header from './GamePanel/Header';
import Board from './GamePanel/Board';
import Abilities from './GamePanel/Abilities';

export default class Game extends React.Component {
    static get PANEL_BOARD() { return 'board'; }
    static get PANEL_HUBS() { return 'hubs'; }
    static get PANEL_ABILITIES() { return 'abilities'; }
    static get PANEL_CLANS() { return 'clans'; }
    static get PANEL_STATS() { return 'stats'; }
    static get PANEL_SETTINGS() { return 'settings'; }
    constructor() {
        super();
        this.state = {
            activePanel : Game.PANEL_BOARD,
            gameState : null
        };
    };

    componentWillMount() {
        this.updateGameState(this.props.initialData);
    }

    updateGameState(newState) {
        this.setState({
            gameState : newState
        });
    }

    changeTab(newTab) {
        if (newTab == this.state.activePanel) {
            return; // no change to be made
        }
        this.setState({
            activePanel : newTab
        });
    }

    render() {
        let visiblePanel = null;
        switch (this.state.activePanel) {
            case Game.PANEL_HUBS:
                visiblePanel = 'HUBS';
                break;
            case Game.PANEL_ABILITIES:
                visiblePanel = (
                    <Abilities gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />
                );
                break;
            case Game.PANEL_CLANS:
                visiblePanel = 'CLANS COMING SOON';
                break;
            case Game.PANEL_STATS:
                visiblePanel = 'STATS';
                break;
            case Game.PANEL_SETTINGS:
                visiblePanel = 'SETTINGS';
                break;
            default:
            case Game.PANEL_BOARD:
                visiblePanel = (
                    <Board gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />
                );
                break;
        }

        {/*let panels = [];*/}

        {/*if (this.state.activePanel == Game.PANEL_SETTINGS) {*/}
            {/*panels.push(<div key="panel-settings">SETTINGS</div>);*/}
        {/*} else {*/}
            {/*let activeClass = "game__panel--active",*/}
                {/*boardClass = this.state.activePanel == Game.PANEL_BOARD ? activeClass : null,*/}
                {/*playerClass = this.state.activePanel == Game.PANEL_PLAYER ? activeClass : null,*/}
                {/*abilitiesClass = this.state.activePanel == Game.PANEL_ABILITIES ? activeClass : null;*/}

            {/*panels.push(*/}
                {/*<div key="panel-board" className={"game__panel game__panel--board g " + boardClass}>*/}
                    {/*<Board gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />*/}
                {/*</div>*/}
            {/*);*/}
        //     panels.push(
        //         <div key="panel-player" className={"game__panel game__panel--player g 1/2@xl " + playerClass}>
        //             <Player gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />
        //         </div>
        //     );
        //     panels.push(
        //         <div key="panel-abilities" className={"game__panel game__panel--abilities g 1/2@xl " + abilitiesClass}>
        //             <Abilities gameState={this.state.gameState} onGameUpdate={this.updateGameState.bind(this)} />
        //         </div>
        //     );
        // }

        let tabData = [
                { key : Game.PANEL_BOARD, title : 'Location' },
                { key : Game.PANEL_HUBS, title : 'Hubs' },
                { key : Game.PANEL_ABILITIES, title : 'Abilities' },
                { key : Game.PANEL_CLANS, title : 'Clans' },
                { key : Game.PANEL_STATS, title : 'Stats' },
            ],
            tabs = [];
        tabData.forEach(function(tab, i) {
            let isActive = (tab.key == this.state.activePanel);
            tabs.push(
                <GameTab
                    key={i}
                    tabKey={tab.key}
                    isActive={isActive}
                    title={tab.title}
                    onClick={this.changeTab.bind(this)} />
            );
        }.bind(this));


        return (
            <div className="game">
                <div className="game__header">
                    <Header gameState={this.state.gameState} />
                </div>
                <div className="game__main">
                    {visiblePanel}
                </div>
                <div className="game__tabs">
                    <div className="layout-limit">
                        <ul className="game__tabs-list">{tabs}</ul>
                    </div>
                </div>
            </div>
        );
    };
}

class GameTab extends React.Component {
    changeTab() {
        this.props.onClick(this.props.tabKey);
    }
    render() {
        let itemClass = 'game__tab ';
        if (this.props.isActive) {
            itemClass += 'game__tab--active';
        }
        let textClass = 'game__tabtext game__tabtext--' + this.props.tabKey;
        return (
            <li className={itemClass}>
                <button className="game__tab-button" onClick={this.changeTab.bind(this)} disabled={this.props.isActive}>
                    <span className={textClass}>{this.props.title}</span>
                </button>
            </li>
        );
    }
}