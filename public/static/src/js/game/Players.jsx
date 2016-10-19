import React from 'react';
import FetchJson from '../utils/FetchJson';
import Player from './Utils/Player';

export default class Hub extends React.Component {
    constructor() {
        super();
        this.refetchInterval = null;
        this.state = {
            data : null
        };
    };

    componentWillMount() {
        this.setState({
            data : this.props.initialData
        });
        setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
    }


    fetchLatestData() {
        FetchJson.getUrl(
            '/players.json',
            function(data) {
                this.setState({
                    data : data
                });
                setTimeout(this.fetchLatestData.bind(this), this.props.updateInterval);
            }.bind(this),
            function(e) {
                // fail silently
            }
        );
    }

    render() {
        let players = [];

        this.state.data.players.forEach(function (player, i) {
            players.push(
                <li className="g 1/2">
                    <Player key={i} player={player}/>
                </li>
            );
        });

        return (
            <div>
                <h1 className="g-unit">Players</h1>
                <ul className="grid">
                    {players}
                </ul>
            </div>
        );
    };
}
