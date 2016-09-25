import GamePanel from './GamePanel';
import FetchJson from '../../utils/FetchJson';
import Points from '../Utils/Points';

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
                        <BoardLocationSpoke
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
            <div className="grid">
                <div className="g 1/2">
                    {location}
                    <hr />
                    <h2>Hubs to choose from</h2>
                    <div className="grid">{hubOptions}</div>
                </div>
                <div className="g 1/2">{playersPresent}</div>
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

class BoardLocationSpoke extends React.Component {
    constructor() {
        super();
        this.allowAnimationUpdate = false;
        this.state = {
            timeLeft : null,
            positionStyle : null
        };
    };

    componentWillMount() {
        this.allowAnimationUpdate = true;
        this.updateTimeLeft();
    }

    componentWillUnmount() {
        this.allowAnimationUpdate = false;
    }

    arrival() {
        FetchJson.getUrl(
            '/play/arrival.json',
            function(newGameState) {
                if (newGameState.position.isInHub) {
                    this.props.onGameStateChange(newGameState);
                } else {
                    // try again (in case the JS is ahead of the server)
                    this.arrival();
                }
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

    padNumber(number) {
        number = number.toString();
        let pad = '00';
        return pad.substring(0, pad.length - number.length) + number
    }

    updateTimeLeft() {
        if (!this.allowAnimationUpdate) {
            return;
        }

        let now = new Date(),
            calcTime = new Date(this.props.position.exitTime),
            entryCalcTime = new Date(this.props.position.entryTime),
            secondsDiff = (calcTime.getTime() - now.getTime()) / 1000,
            roundedSecondsDiff = Math.floor(secondsDiff),
            totalDiff = (calcTime.getTime() - entryCalcTime.getTime()) / 1000,
            hours = Math.floor(roundedSecondsDiff / 3600),
            hoursRem = roundedSecondsDiff - (hours * 3600),
            minutes = Math.floor(hoursRem / 60),
            seconds = hoursRem - (minutes * 60),
            positionPercent = ((totalDiff - secondsDiff) / totalDiff) * 100,
            positionStyle = {left:positionPercent + '%'};


        if (secondsDiff <= 0) {
            this.setState({
                timeLeft : 0,
                positionStyle : {left:'100%'}
            });
            this.arrival();
            return;
        }

        let timeLeft = hours + ':' + this.padNumber(minutes) + ':' + this.padNumber(seconds);

        this.setState({
            timeLeft : timeLeft,
            positionStyle : positionStyle
        });
        window.requestAnimationFrame(this.updateTimeLeft.bind(this));
    }

    render() {
        let destination = this.props.position.destination,
            origin = this.props.position.origin,
            arrivalTime;

        if (this.state.timeLeft === 0) {
            arrivalTime = 'now'
        } else {
            arrivalTime = this.state.timeLeft;
        }

        return (
            <div className="game__travelling grid">
                <div className="g">
                    <p className="a text--center">Travelling</p>
                </div>
                <div className="g">
                <div className="grid grid--flush">
                    <div className="g 1/6 g--align-center">
                        <div className="text--right game__travelling-hubname">
                            <h3>{origin.name}</h3>
                            <h4>{origin.cluster.name}</h4>
                        </div>
                    </div>
                    <div className="g 1/6 g--align-center">
                        <div className="game__travelling-hub">
                            <svg
                                viewBox="0 0 104 120"
                                xmlns="http://www.w3.org/2000/svg">
                                <use xlinkHref="#icon-hexagon" />
                            </svg>
                        </div>
                    </div>
                    <div className="g 1/3 g--align-center">
                        <p className="text--center">
                            <span className="b">Arriving</span>
                            <br />
                            <span className="c">{arrivalTime}</span>
                        </p>
                        <div className="game__travelling-map">
                            <div className="game__travelling-line"></div>
                            <div className="game__travelling-position" style={this.state.positionStyle}>
                                <span className="location"></span>
                            </div>
                        </div>
                        <p className="text--center">
                            <span className="c">
                                <Points
                                    value={0}
                                    time={this.props.position.entryTime}
                                    rate={1}
                                />
                            </span>
                            <br />
                            <span className="b">Earned on this journey</span>
                        </p>
                    </div>
                    <div className="g 1/6 g--align-center">
                        <div className="game__travelling-hub">
                            <svg
                                viewBox="0 0 104 120"
                                xmlns="http://www.w3.org/2000/svg">
                                <use xlinkHref="#icon-hexagon" />
                            </svg>
                        </div>
                    </div>
                    <div className="g 1/6 g--align-center">
                        <div className="game__travelling-hubname">
                            <h3>{destination.name}</h3>
                            <h4>{destination.cluster.name}</h4>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}