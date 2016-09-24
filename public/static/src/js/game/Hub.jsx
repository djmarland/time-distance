import React from 'react';
import FetchJson from '../utils/FetchJson';
import Points from './utils/Points';

export default class Hub extends React.Component {
    constructor() {
        super();
        this.refetchInterval = null;
        this.state = {
            playersData : []
        };
    };

    componentWillMount() {
        this.setState({
            playersData : this.props.playersData
        });
        setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
    }


    fetchLatestData() {
        FetchJson.getUrl(
            '/hubs/' + this.props.hubKey + '.json',
            function(data) {
                this.setState({
                    playersData : data.players
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this),
            function(e) {
                // fail silently
            }
        );
    }

    render() {
        if (this.state.playersData.length == 0) {
            return (
                <div>
                    <p>No players present in this hub</p>
                </div>
            );
        }

        let players = [];

        this.state.playersData.forEach(function(player) {
           players.push(
               <HubPlayer key={player.nickname} player={player} />
           );
        });

        return (
            <ul>
                {players}
            </ul>
        );
    };
}

class HubPlayer extends React.Component {
    render() {
        let player = this.props.player;
        return (
            <li>
                <div className="grid">
                    <div className="g 1/2">
                        <a href={player.url}>{player.nickname}</a>
                    </div>
                    <div className="g 1/2">
                        <Points
                            value={player.points}
                            time={player.pointsCalculationTime}
                            rate={player.pointsRate}
                        />
                    </div>
                </div>
            </li>
        );
    }
}