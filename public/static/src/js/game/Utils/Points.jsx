import React from 'react';

export default class Points extends React.Component {
    constructor() {
        super();
        this.state = {
            pointValue : 0
        };
    };

    componentWillMount() {
        this.updatePoints();
    }

    updatePoints() {
        let now = new Date(),
            calcTime = new Date(this.props.time),
            secondsDiff = (now.getTime() - calcTime.getTime()) / 1000,
            earned = secondsDiff * this.props.rate,
            current = this.props.value + earned;

        if (current < 0) {
            current = 0;
        }

        // @todo - handle what happens when you hit zero to "kill" the player
        // @todo - special effects when it gets low

        this.setState({
            pointValue : Math.floor(current).toLocaleString()
        });
        window.requestAnimationFrame(this.updatePoints.bind(this));
    }

    render() {
        let arrow = null;
        if (this.state.pointValue && this.props.rate > 0) {
            arrow = (<span> ^ </span>);
        }
        if (this.state.pointValue && this.props.rate < 0) {
            arrow = (<span> V </span>);
        }
        return (
            <div>
                {this.state.pointValue}
                {arrow}
                {this.props.rate}
            </div>
        );
    };
}
