import React from 'react';
import FetchJson from '../utils/FetchJson';
import Points from './utils/Points';

export default class Player extends React.Component {
    constructor() {
        super();
        this.refetchInterval = null;
        this.state = {
            gameState : null
        };
    };

    componentWillMount() {
        this.fetchLatestData();
    }

    fetchLatestData() {
        FetchJson.getUrl(
            '/play/status.json',
            function(data) {
                this.setState({
                    gameState : data
                });
                // temporailly disabled due to sandbox performance
                // setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
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
            <div className="header__player">
                <span className="header__points"><Points
                    value={player.points}
                    time={player.pointsCalculationTime}
                    rate={player.pointsRate}
                /></span>
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
        );
    };
}