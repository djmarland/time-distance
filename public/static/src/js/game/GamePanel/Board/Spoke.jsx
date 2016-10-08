import React from 'react';
import FetchJson from '../../../utils/FetchJson';
import Points from '../../Utils/Points';

export default class Spoke extends React.Component {
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
                    // try again (in case the JS is ahead of the server somehow)
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