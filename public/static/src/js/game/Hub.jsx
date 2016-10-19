import React from 'react';
import FetchJson from '../utils/FetchJson';
import Player from './utils/Player';

export default class Hub extends React.Component {
    constructor() {
        super();
        this.refetchInterval = null;
        this.state = {
            hubData : null
        };
    };

    componentWillMount() {
        this.setState({
            hubData : this.props.hubData
        });
        setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
    }


    fetchLatestData() {
        FetchJson.getUrl(
            this.state.hubData.hub.url + '.json',
            function(data) {
                this.setState({
                    hubData : data
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this),
            function(e) {
                // fail silently
            }
        );
    }

    render() {
        let hub = this.state.hubData.hub,
            owner = 'Unowned',
            playersPresent = (
                <div>
                    <p>No players present in this hub</p>
                </div>
            );

        if (this.state.hubData.playersPresent) {

            let players = [];

            this.state.hubData.players.forEach(function (player, i) {
                players.push(
                    <li key={i} className="g 1/3">
                        <Player player={player}/>
                    </li>
                );
            });

            playersPresent = (
                <ul className="grid">
                    {players}
                </ul>
            );
        }

        if (hub.owner) {
            owner = (
                <Player player={hub.owner} />
            );
        }

        return (
            <div>
                <h1 className="g-unit">{ hub.name }</h1>
                <p>{ hub.clusterName }</p>

                <h2>Owned by:</h2>
                <div className="1/3">{owner}</div>

                <h2>Clan:</h2>
                <div>--clan--</div>

                <h2>Players present</h2>
                {playersPresent}

                <h2>Abilities available for pickup</h2>
            </div>
        );
    };
}
