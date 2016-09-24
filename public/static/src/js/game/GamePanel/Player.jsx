import GamePanel from './GamePanel';
import Points from '../Utils/Points';

export default class Player extends GamePanel {

    onClickButton() {
        let gameState = this.state.gameState;
        // move to the hub
        gameState.currentPosition.type = 'spoke';
        this.updateGlobalGameState(gameState);
    }

    render() {
        let player = this.state.gameState.player;

        return (
            <div>
                <h1>{player.nickname}</h1>
                <Points
                    timeNow={this.state.gameState.currentTime}
                    value={player.points}
                    time={player.pointsCalculationTime}
                    rate={player.pointsRate}
                />
                <p>
                <button onClick={this.onClickButton.bind(this)}>Begin travelling</button>
                </p>
            </div>
        );
    };
}
