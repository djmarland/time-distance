import GamePanel from './GamePanel';
import FetchJson from '../../utils/FetchJson';
import Points from '../Utils/Points';
import BoardSpoke from './Board/Spoke';
import BoardMap from './Board/Map';
import Lightbox from '../../utils/Lightbox';

export default class Board extends GamePanel {
    constructor() {
        super();
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

        if (!gameState.position.isInHub) {
            return (
                <div className="board">
                    <BoardSpoke
                        onGameStateChange={this.updateGlobalGameState.bind(this)}
                        position={gameState.position} />
                </div>
            )
        }

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
                        <div className="board__hub-flag">FLAGGY FLAG!</div>
                        <BoardLocationHub onTakeHub={this.takeHub.bind(this)}
                                          onGameStateChange={this.updateGlobalGameState.bind(this)}
                                          gameState={gameState} />
                    </div>
                </div>
                <div className="board__map">
                    <BoardMap onChangeHub={this.changeHub.bind(this)} gameState={this.state.gameState}/>
                    <div className="board__hub-detail">
                        <div className="layout-limit">
                            {playersPresent}
                            <div>
                                <h2>Abilities here</h2>
                                <div>{abilities}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

class BoardLocationHub extends React.Component {
    constructor() {
        super();
        this.state = {
            modalOpen : false
        };
    }

    openModal() {
        this.setState({
            modalOpen : true
        });
    }

    modalCloseCallback() {
        this.setState({
            modalOpen : false
        });
    }

    useAbility(abilityId) {
        FetchJson.postUrl(
            '/play/use-ability.json',
            abilityId,
            function(newGameState) {
                this.props.onGameStateChange(newGameState);
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
        let haven = null,
            options = null,
            gameState = this.props.gameState,
            position = gameState.position,
            protectionScore = null,
            owner = null;

        if (position.location.isHaven) {
            haven = (<p>(Safe Haven)</p>);
        } else {
            protectionScore = (
                <h3 className="protection">{Math.floor(position.location.protectionScore).toLocaleString()}</h3>
            );
            if (position.location.owner) {
                owner = (<h3>Owner {position.location.owner.nickname}</h3>);
            }
            if (position.location.owner) {
                if (position.location.owner.nickname == gameState.player.nickname) {
                    options = (
                        <div>
                            <button onClick={this.openModal.bind(this)} className="button">
                                Protect & Manage
                            </button>
                            <Lightbox modalIsOpen={this.state.modalOpen}
                                      closeCallback={this.modalCloseCallback.bind(this)}
                                      title="Protect the hub">
                                <DefendPanel gameState={gameState} useAbility={this.useAbility.bind(this)} />
                            </Lightbox>
                        </div>
                    );
                } else {
                    options = (
                        <div>
                            <button onClick={this.openModal.bind(this)} className="button">
                                Attack
                            </button>
                            <Lightbox modalIsOpen={this.state.modalOpen}
                                      closeCallback={this.modalCloseCallback.bind(this)}
                                      title="Attack">
                                <AttackPanel gameState={gameState} useAbility={this.useAbility.bind(this)} />
                            </Lightbox>
                        </div>
                    );
                }
            } else {
                let disabled = (gameState.player.points < gameState.gameSettings.originalPurchaseCost);
                options = (
                    <div>
                        <button
                            className="button"
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

class AttackPanel extends React.Component {
    render() {
        let gameState = this.props.gameState;
        return (
            <p>List all the attacking abilities</p>
        );
    }
}

class DefendPanel extends React.Component {
    filterAbilities(abilityGroups, type) {
        let abilities = [];
        abilityGroups.forEach(function(group) {
            group.items.forEach(function(ability) {
                if (ability.ability && type == ability.ability.class) {
                    abilities.push(ability);
                }
            });
        });
        return abilities;
    }

    render() {
        let gameState = this.props.gameState,
            abilities = this.filterAbilities(gameState.abilities, 'hub-defend'),
            availableAbilities = [];

        abilities.forEach(function(ability, i) {
            let ab = ability.ability,
                click = function() {
                    this.props.useAbility(ab.id);
                }.bind(this);
            availableAbilities.push(
                <li key={i}>
                    <div className="grid">
                        <div className="3/4">
                            <div>
                                <h3>{ab.name}</h3>
                                <p>{ab.description}</p>
                            </div>
                        </div>
                        <div className="g 1/8">
                            {ability.count}
                        </div>
                        <div className="g 1/8">
                            <button className="button" onClick={click.bind(this)}>Use</button>
                        </div>
                    </div>
                </li>
            );
        });

        return (
            <div>
                <ul className="list--unstyled">
                {availableAbilities}
                </ul>
            </div>
        );
    }
}