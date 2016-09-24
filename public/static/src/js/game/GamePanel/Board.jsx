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
                        <BoardLocationSpoke position={gameState.position}  />
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
            timeLeft : null
        };
    };

    componentWillMount() {
        this.allowAnimationUpdate = true;
        this.updateTimeLeft();
    }

    componentWillUnmount() {
        this.allowAnimationUpdate = false;
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
            secondsDiff = Math.floor((calcTime.getTime() - now.getTime()) / 1000),
            hours = Math.floor(secondsDiff / 3600),
            hoursRem = secondsDiff - (hours * 3600),
            minutes = Math.floor(hoursRem / 60),
            seconds = hoursRem - (minutes * 60);

        if (secondsDiff <= 0) {
            this.setState({
                timeLeft : 0
            });
            // todo - actually go and fetch the status and updating inline rather than refreshing
            window.location.reload();
            return;
        }

        let timeLeft = hours + ':' + this.padNumber(minutes) + ':' + this.padNumber(seconds);

        this.setState({
            timeLeft : timeLeft
        });
        window.requestAnimationFrame(this.updateTimeLeft.bind(this));
    }

    render() {
        let destination = this.props.position.destination,
            arrivalTime;

        if (this.state.timeLeft === 0) {
            arrivalTime = (<h1>Arriving now....</h1>)
        } else {
            arrivalTime = (<h1>Arriving in {this.state.timeLeft}</h1>);
        }

        return (
            <div>
                <h1>Travelling</h1>
                <h2>Destination</h2>
                <h3>{destination.name}</h3>
                <h4>{destination.cluster.name}</h4>
                {arrivalTime}
            </div>
        );
    }
}