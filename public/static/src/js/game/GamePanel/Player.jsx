import GamePanel from './GamePanel';
import Points from '../Utils/Points';

export default class Player extends GamePanel {
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
            </div>
        );
    };
}
