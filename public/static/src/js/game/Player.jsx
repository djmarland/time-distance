import React from 'react';
import FetchJson from '../utils/FetchJson';
import Points from './utils/Points';

export default class Player extends React.Component {
    constructor() {
        super();
        this.refetchInterval = null;
        this.state = {
            player : null,
            position : null
        };
    };

    componentWillMount() {
        this.setState({
            player : this.props.playerData.player,
            position : this.props.playerData.position
        });
        setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
    }


    fetchLatestData() {
        FetchJson.getUrl(
            this.state.player.url + '.json',
            function(data) {
                this.setState({
                    player : data.player,
                    position : data.position
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this),
            function(e) {
                // fail silently
            }
        );
    }

    render() {
        let player = this.state.player,
            position = this.state.position,
            positionState = (<p>Travelling</p>);

        if (position.isInHub) {
            let hub = position.location;
            positionState = (
                <div>
                    <h3><a href={hub.url}>{hub.name}</a></h3>
                    <p>{hub.cluster.name}</p>
                </div>
            );
        }

        return (
            <div>
                <h1 className="g-unit">{ player.nickname }</h1>
                <Points
                    value={player.points}
                    time={player.pointsCalculationTime}
                    rate={player.pointsRate}
                />
                <h2>Clan</h2>
                <p>Not a clan member</p>
                <h2>Current Location</h2>
                {positionState}
                <h2>Hubs owned</h2>
            </div>
        );
    };
}