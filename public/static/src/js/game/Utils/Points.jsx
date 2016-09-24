import React from 'react';

export default class Points extends React.Component {
    constructor() {
        super();
        this.allowAnimationUpdate = false;
        this.state = {
            pointValue : 0
        };
    };

    componentWillMount() {
        this.allowAnimationUpdate = true;
        this.updatePoints();
    }

    componentWillUnmount() {
        this.allowAnimationUpdate = false;
    }

    updatePoints() {
        if (!this.allowAnimationUpdate) {
            return;
        }

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
        return (
            <span className="points">
                <span className="points__icon">
                    <svg
                        viewBox="0 0 104 120"
                        xmlns="http://www.w3.org/2000/svg">
                        <use xlinkHref="#icon-hexagon" />
                    </svg>
                </span>
                {this.state.pointValue}
            </span>
        );
    };
}
