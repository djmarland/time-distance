import React from 'react';
import GamePanel from './GamePanel';

export default class Hubs extends GamePanel {
    render() {
        let hubs = this.state.gameState.playerHubs,
            hubsState = (
                <p>You own no hubs</p>
            );

        if (hubs.length > 0) {
            let hubItems = [];
            hubs.forEach(function(item, i) {
                hubItems.push(
                    <Hub key={i} hub={item} />
                );
            });
            hubsState = (
                <ul>{hubItems}</ul>
            );
        }

        return (
            <div className="layout-limit">
                <h1>Hubs</h1>
                {hubsState}
            </div>
        );
    };
}

class Hub extends React.Component {
    render() {
        let hub = this.props.hub;
        return (
            <li>
                <div className="grid">
                    <div className="g 1/3">
                        <div>
                            <h3>{hub.name}</h3>
                            <h4>{hub.cluster.name}</h4>
                        </div>
                    </div>
                    <div className="g 1/3">
                        <p className="protection">{Math.floor(hub.protectionScore).toLocaleString()}</p>
                    </div>
                    <div className="g 1/3">
                        <button>Protect</button>
                    </div>
                </div>
            </li>
        )
    }
}