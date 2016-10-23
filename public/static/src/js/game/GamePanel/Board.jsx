import GamePanel from './GamePanel';
import FetchJson from '../../utils/FetchJson';
import Points from '../Utils/Points';
import BoardSpoke from './Board/Spoke';
import BoardMap from './Board/Map';

export default class Board extends GamePanel {
    constructor() {
        super();
        this.state.viewMap = false;
    }

    switchView() {
        this.setState({
           viewMap : !this.state.viewMap
        });
    }

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

    takeAbility(unique) {
        // todo loading state (fancy animation?)
        FetchJson.postUrl(
            '/play/take-ability.json',
            unique,
            function(newGameState) {
                this.updateGlobalGameState(newGameState);
            }.bind(this),
            function(e) {
                // todo - better error handling! (especially if someone else has already taken it)
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

        if (this.state.viewMap) {
            return (
                <div className="board">
                    <BoardMap onChangeHub={this.changeHub.bind(this)} gameState={this.state.gameState}/>
                    <button className="board__view-switch board__view-switch--location"
                            onClick={this.switchView.bind(this)}>
                        <span className="board__view-switch-text">Location</span>
                    </button>
                </div>
            );
        }

        let viewSwitcher = (
            <button className="board__view-switch board__view-switch--map"
                    onClick={this.switchView.bind(this)}>
                <span className="board__view-switch-text">Map</span>
            </button>
        );

        if (!gameState.position.isInHub) {
            return (
                <div className="board">
                    <BoardSpoke
                        onGameStateChange={this.updateGlobalGameState.bind(this)}
                        position={gameState.position} />
                    {viewSwitcher}
                </div>
            )
        }

        let position = gameState.position;

        // {/*let location = (<BoardLocationHub onTakeHub={this.takeHub.bind(this)} gameState={gameState} />);*/}

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
                let onClick = function() {
                    this.takeAbility(ability.uniqueKey);
                }.bind(this);
                abilities.push(
                    <button key={i} onClick={onClick} className="ability ability--hub">
                        <span className="ability__name">{ability.name}</span>
                    </button>
                );
            }.bind(this));
        }

        return (
            <div className="board">
                <div className="board__hub-intro">
                    <div className="layout-limit">
                        <div className="board__hub-flag">FLAG</div>
                        <h1>{position.location.name}</h1>
                        <h2>{position.location.cluster.name}</h2>
                    </div>
                </div>
                <div className="layout-limit">
                    <div className="grid grid--flat">
                        <div className="g 1/2@xl">
                            BIG HEXAGON
                        </div>
                        <div className="g 1/2@xl">
                            {playersPresent}
                            <div>
                                <h2>Abilities here</h2>
                                <div>{abilities}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {viewSwitcher}
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
