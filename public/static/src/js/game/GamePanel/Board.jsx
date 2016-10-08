import GamePanel from './GamePanel';
import FetchJson from '../../utils/FetchJson';
import Points from '../Utils/Points';
import BoardSpoke from './Board/Spoke';
import BoardMap from './Board/Map';

export default class Board extends GamePanel {
    changeHub(bearing) {
        // todo loading state (fancy animation?)
        FetchJson.postUrl(
            '/play/move.json',
            bearing,
            function(newGameState) {
                this.updateGlobalGameState(newGameState);
            }.bind(this),
            function(e) {
                // todo - better error handling!
                let message = 'Error making move';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            }
        );
    }

    hubOption(key, direction) {
        return (<BoardHubOption
            key={key}
            directionKey={key}
            direction={direction}
            distanceMultiplier={this.state.gameState.gameSettings.distanceMultiplier}
            onChangeHub={this.changeHub.bind(this)} />);
    }

    render() {
        let gameState = this.state.gameState;
        if (!gameState.position.isInHub) {
            return (
                <div className="grid">
                    <div className="g">
                        <BoardSpoke
                            onGameStateChange={this.updateGlobalGameState.bind(this)}
                            position={gameState.position} />
                    </div>
                </div>
            );
        }

        let location = (<BoardLocationHub position={gameState.position} />),
            hubOptions = [
            this.hubOption('nw', gameState.directions.nw),
            this.hubOption('ne', gameState.directions.ne),
            this.hubOption('w', gameState.directions.w),
            this.hubOption('e', gameState.directions.e),
            this.hubOption('sw', gameState.directions.sw),
            this.hubOption('se', gameState.directions.se),
        ];

        let playersPresent = null;
        if (gameState.playersPresent && gameState.playersPresent.length > 0) {
            let players = [];

            gameState.playersPresent.forEach(function (player) {
                players.push(
                    <li className="g 1/2" key={player.nickname}>
                        <h5>{player.nickname}</h5>
                        <Points
                        value={player.points}
                        time={player.pointsCalculationTime}
                        rate={player.pointsRate}
                        />
                    </li>
                )
            });

            playersPresent = (
                <div>
                    <h2>Players here</h2>
                    <ul className="grid">{players}</ul>
                </div>
            );
        }

        return (
            <div className="grid grid--flat">
                <div className="g 1/2">
                    <BoardMap/>
                </div>
                <div className="g 1/2 game__panel--location">
                    {location}
                    <hr />
                    {playersPresent}
                    </div>
            </div>
        );
    };
}

class BoardHubOption extends React.Component {
    goToHub() {
        this.props.onChangeHub(this.props.direction.bearing);
    }

    displayDistance(distance) {
        if (distance === 0) {
            let secs = Math.floor(this.props.distanceMultiplier/60);
            return Math.max(secs, 1) + ' seconds';
        }
        let totalSeconds = distance * this.props.distanceMultiplier,
            hours = (totalSeconds / 3600);

        if (hours == 1) {
            return hours + ' hour';
        } else if (hours > 1) {
            return hours + ' hours';
        }
        return totalSeconds/60 + ' minutes';
    }

    render() {
        let directionEl = null,
            direction = this.props.direction;

        if (direction) {
            let crossingVoid = null;
            if (direction.crossesTheVoid) {
                crossingVoid = (<p>CROSSING THE VOID</p>);
            }
            directionEl = (
                <div>
                    <h4>{direction.hub.name} - {direction.hub.cluster.name}</h4>
                    <p>
                        Distance: {this.displayDistance(direction.distance)}
                        <button onClick={this.goToHub.bind(this)}>Go there</button>
                    </p>
                    {crossingVoid}
                </div>
            );
        }

        return (
            <div className="g 1/2">
                <h3>{this.props.directionKey}</h3>
                {directionEl}
            </div>
        );
    }
}


class BoardLocationHub extends React.Component {
    render() {
        let haven = null;
        if (this.props.position.location.isHaven) {
            haven = (<p>(Safe Haven)</p>);
        }

        return (
            <div>
                <h1>{this.props.position.location.name}</h1>
                <h2>{this.props.position.location.cluster.name}</h2>
                {haven}
            </div>
        );
    }
}
