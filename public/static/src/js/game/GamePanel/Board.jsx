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
                let message = 'Error making move (did you try to cheat)';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            }
        );
    }

    takeHub() {
        // todo loading state (fancy animation?)
        FetchJson.postUrl(
            '/play/take-hub.json',
            null,
            function(newGameState) {
                this.updateGlobalGameState(newGameState);
            }.bind(this),
            function(e) {
                // todo - better error handling!
                let message = 'Error (did you try to cheat)';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            }
        );
    }

    render() {
        let gameState = this.state.gameState;
        if (!gameState.position.isInHub) {
            return (
                <BoardSpoke
                    onGameStateChange={this.updateGlobalGameState.bind(this)}
                    position={gameState.position} />
            );
        }

        let location = (<BoardLocationHub onTakeHub={this.takeHub.bind(this)} gameState={gameState} />);

        let playersPresent = null;
        if (gameState.playersPresent && gameState.playersPresent.length > 0) {
            let players = [];

            gameState.playersPresent.forEach(function (player, i) {
                players.push(
                    <li className="g 1/2" key={i}>
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

        let abilities = [];
        if (gameState.abilitiesPresent && gameState.abilitiesPresent.length > 0) {
            gameState.abilitiesPresent.forEach(function(ability, i) {
                abilities.push(
                    <p key={i}>{ability.name}</p>
                );
            });
        }

        return (
            <div className="grid grid--flat">
                <div className="g 2/3@xl">
                    <BoardMap onChangeHub={this.changeHub.bind(this)} gameState={this.state.gameState}/>
                </div>
                <div className="g 1/3@xl game__panel--location">
                    {location}
                    {playersPresent}
                    <div>
                        <h2>Abilities here</h2>
                        {abilities}
                    </div>
                </div>
            </div>
        );
    };
}

class BoardLocationHub extends React.Component {
    render() {
        let haven = null,
            options = null,
            gameState = this.props.gameState,
            position = gameState.position,
            protectionScore = null,
            owner = null;
        if (position.location.isHaven) {
            haven = (<p>(Safe Haven)</p>);
        } else {
            if (position.location.protectionScore) {
                protectionScore = (<h3>{protectionScore}</h3>);
            }
            if (position.location.owner) {
                owner = (<h3>Owner {position.location.owner.nickname}</h3>);
            }
            if (position.location.owner) {
                // todo - no attack buttons if it's your own hub
                options = (
                    <div>
                        <button>Attack</button>
                    </div>
                );
            } else {
                let disabled = (gameState.player.points < gameState.gameSettings.originalPurchaseCost);
                options = (
                    <div>
                        <button
                            onClick={this.props.onTakeHub.bind(this)}
                            disabled={disabled}>
                            Take this hub ({gameState.gameSettings.originalPurchaseCost})
                        </button>
                    </div>
                )
            }
        }

        return (
            <div>
                <h1>{position.location.name}</h1>
                <h2>{position.location.cluster.name}</h2>
                {protectionScore}
                {owner}
                {haven}
                {options}
            </div>
        );
    }
}



/*
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
 */
