import React from 'react';
import GamePanel from './GamePanel';
import FetchJson from '../../utils/FetchJson';
import Points from '../utils/Points';

export default class Player extends GamePanel {
    constructor() {
        super();
        this.state = {
            gameState : null
        };
    };

    componentWillMount() {
        super.componentWillMount();
        if (this.props.updateInterval) {
            this.fetchLatestData();
        }
    }

    fetchLatestData() {
        FetchJson.getUrl(
            '/play/status.json',
            function(data) {
                this.setState({
                    gameState : data
                });
                if (this.props.updateInterval) {
                    setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
                }
            }.bind(this),
            function(e) {
                // fail silently
            }
        );
    }

    render() {
        if (!this.state.gameState) {
            return null;
        }

        let player = this.state.gameState.player;
        return (
            <div className="header">
                <div className="layout-limit"><div className="grid grid--flush">
                    <div className="header__points g 1/2">
                        <div>
                            <Points
                                value={player.points}
                                time={player.pointsCalculationTime}
                                rate={player.pointsRate} />
                        </div>
                    </div>
                    <div className="header__player g 1/2">
                        <div>
                            <span className="header__playername">{player.nickname}</span>
                            <span className="header__settings">
                                <svg
                                    className="header__settings-icon"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <use xlinkHref="#icon-settings" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div></div>
            </div>
        );
    };
}