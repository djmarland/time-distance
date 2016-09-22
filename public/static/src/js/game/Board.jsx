import GamePanel from './GamePanel';
import FetchJson from '../utils/FetchJson';

export default class Board extends GamePanel {
    changeHub(newkey) {
        // todo loading state (fancy animation?)
        FetchJson.getUrl(
            '/action/make-move.json?hub-key=' + newkey,
            function(newGameState) {
                this.updateGlobalGameState(newGameState.status);
            }.bind(this),
            function(e) {
                // todo - better error handling
                let message = 'Error making move';
                if (e) {
                    message += ' - ' + e.message;
                }
                alert(message);
            }
        );
    }

    hubOption(key, hub) {
        return (<BoardHubOption key={key} directionKey={key} hub={hub} onChangeHub={this.changeHub.bind(this)} />);
    }

    render() {
        let gameState = this.state.gameState,
            hubOptions = null,
            location = null;
        if (gameState.currentPosition.type == 'hub') {
            location = (<BoardLocationHub positionData={gameState.currentPosition} />);

            hubOptions = [
                this.hubOption('nw', gameState.currentPosition.data.paths.nw),
                this.hubOption('ne', gameState.currentPosition.data.paths.ne),
                this.hubOption('e', gameState.currentPosition.data.paths.e),
                this.hubOption('se', gameState.currentPosition.data.paths.se),
                this.hubOption('sw', gameState.currentPosition.data.paths.sw),
                this.hubOption('w', gameState.currentPosition.data.paths.w),
            ];
        }
        if (gameState.currentPosition.type == 'spoke') {
            location = (<BoardLocationSpoke positionData={gameState.currentPosition}  />);
        }


        return (
            <div className="grid grid--flush">
                <div>
                {location}
                <hr />
                <h2>Hubs to choose from</h2>
                {hubOptions}
                </div>
            </div>
        );
    };
}

class BoardHubOption extends React.Component {
    goToHub() {
        this.props.onChangeHub(this.props.hub.hub.urlKey);
    }

    render() {
        let hub = null;
        if (this.props.hub) {
            hub = (
                <div>
                    <h4>{this.props.hub.hub.name} - {this.props.hub.hub.cluster}</h4>
                    <p>
                        Distance: {this.props.hub.distance}
                        <button onClick={this.goToHub.bind(this)}>Go there</button>
                    </p>
                </div>
            );
        }

        return (
            <div>
                <h3>{this.props.directionKey}</h3>
                {hub}
            </div>
        );
    }
}


class BoardLocationHub extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.positionData.data.name}</h1>
                <h2>{this.props.positionData.data.cluster.name}</h2>
            </div>
        );
    }
}

class BoardLocationSpoke extends React.Component {
    render() {
        return (
            <div>TRAVELLING</div>
        );
    }
}