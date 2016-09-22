import React from 'react';

export default class GamePanel extends React.Component {
    constructor() {
        super();
        this.state = {
            gameState : null
        };
    };

    componentWillMount() {
        this.updateGameState(this.props.gameState);
    }

    componentWillReceiveProps(newProps) {
        this.updateGameState(newProps.gameState);
    }

    updateGameState(newState) {
        this.setState({
            gameState : newState
        });
    }

    updateGlobalGameState(newState) {
        this.updateGameState(newState);
        this.props.onGameUpdate(newState);
    }
}
