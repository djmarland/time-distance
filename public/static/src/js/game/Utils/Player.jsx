import React from 'react';
import Points from './Points';

export default class Player extends React.Component {
    render() {
        let player = this.props.player;
        return (
            <a href={player.url} className="player">
                <h4 className="player__nickname">{player.nickname}</h4>
                <p className="player__points">
                    <Points
                        value={player.points}
                        time={player.pointsCalculationTime}
                        rate={player.pointsRate}
                    />
                </p>
            </a>
        );
    };
}
