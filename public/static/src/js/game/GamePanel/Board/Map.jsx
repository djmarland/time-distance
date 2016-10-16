import GamePanel from '../GamePanel';
import React from 'react';

export default class Map extends GamePanel {
    constructor() {
        super();
        this.hexRadius = 32;
        this.averageVerticalDiameter = 1.5 * this.hexRadius;
        this.innerRadius = (Math.sqrt(3)/2) * this.hexRadius;
        this.innerDiameter = this.innerRadius * 2;
        this.xOffset = 0;
        this.yOffset = 0;
        this.middleX = 0;
        this.middleY = 0;
        this.totalCol = 0;
        this.totalRow = 0;
        this.state.containerHeight = null;
        this.state.containerWidth = null;
    };

    handleSize() {
        let { clientHeight, clientWidth } = this.refs.mapContainer;
        this.setState({
            containerHeight : clientHeight,
            containerWidth : clientWidth
        });
    }

    componentDidMount(){
        this.handleSize();
        window.addEventListener('resize', this.handleSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleSize.bind(this));
    }

    handleMove(bearing) {
        this.props.onChangeHub(bearing);
    }

    hexPoints(xCoord, yCoord) {
        let center = this.coordToHexCentre(xCoord, yCoord),
            x = center.x,
            y = center.y,
            points = [],
            theta;
        for (theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
            let pointX = x + this.hexRadius * Math.sin(theta);
            let pointY = y + this.hexRadius * Math.cos(theta);
            points.push(pointX + ',' + pointY);
        }
        return points.join(' ');
    }

    coordToHexCentre(col, row) {
        let offset = (Math.sqrt(3) * this.hexRadius) / 2,
            x = this.xOffset + offset * col * 2,
            y = this.yOffset + offset * row * Math.sqrt(3);
        if (row % 2 !== 0) {
            x = x + offset;
        }
        return {x: x, y: y};
    }

    makeHexagonPolygon(x, y, className) {
        let coord = x + '-' + y;
        return (
            <polygon
                key={coord}
                xmlns="http://www.w3.org/2000/svg"
                points={this.hexPoints(x, y)}
                className={className} />
        )
    }

    colToX(col) {
        return col - this.middleX;
    }
    rowToY(row) {
        return row - this.middleY;
    }
    xToCol(x) {
        return x + this.middleX;
    }
    yToRow(y) {
        return y + this.middleY;
    }

    calculateLayout() {
        this.totalCol = Math.ceil(this.state.containerWidth / this.innerDiameter);
        this.totalRow = Math.ceil(this.state.containerHeight / this.averageVerticalDiameter);
        this.middleX = Math.floor(this.totalCol / 2) - 1;
        this.middleY = Math.floor(this.totalRow / 2) - 1;

        // middleY needs to always be an odd numbered row for the maths to work
        if (!(this.middleY % 2)) {
            this.middleY++;
        }

        // how close is the middle of the centre hex from the middle of the container
        let centerX = this.innerRadius * ((this.middleX * 2) + 1);
        let centerY = (this.averageVerticalDiameter * this.middleY);

        this.xOffset = (this.state.containerWidth/2) - centerX;
        this.yOffset = (this.state.containerHeight/2) - centerY;
    }

    drawGrid() {
        let col, row, polygons = [];

        let revealed = this.state.gameState.map.visibleSpaces;

        // going from -1 to 1 over to ensure we don't see the edges
        for (col = -1; col <= this.totalCol; col++) {
            for (row = -1; row <= this.totalRow; row++) {
                let className = 'map__grid ',
                    x = this.colToX(col),
                    y = this.rowToY(row);

                if (revealed[y] && revealed[y][x]) {
                    className += 'map__grid--visible';
                }

                polygons.push(this.makeHexagonPolygon(col, row, className));
            }
        }
        return polygons;
    }

    drawCurrentHub() {
        // current position is always at the origin
        let position = this.state.gameState.map.currentMapPosition.position,
            className = 'map__hub map__hub--current ';
        if (position.isInHub && position.location.isHaven) {
            className += 'map__hub--haven';
        }
        return this.makeHexagonPolygon(this.xToCol(0), this.yToRow(0), className);
    }

    drawHubs() {
        let hubs = [];
        this.state.gameState.map.linkedHubs.forEach(function(hub) {
            let onClick = function() {
                this.handleMove(hub.bearing);
            }.bind(this),
                className = 'map__hub map__hub--available ';
            if (hub.hub.isHaven) {
                className += 'map__hub--haven';
            }
            hubs.push(
                <MapPolygon points={this.hexPoints(this.xToCol(hub.x),this.yToRow(hub.y))}
                            hub={hub}
                            onClick={onClick}
                            key={hub.x + '-' + hub.y}
                            className={className} />
            );
        }.bind(this));
        return hubs;
    }

    drawSpokes() {
        let spokes = [];
        this.state.gameState.map.linkedHubs.forEach(function(hub) {
            let start = this.coordToHexCentre(this.xToCol(0), this.yToRow(0)),
                end = this.coordToHexCentre(this.xToCol(hub.x), this.yToRow(hub.y)),
                className = 'map__spoke ';
            if (hub.crossesTheVoid) {
                className += 'map__spoke--void';
            }
            spokes.push(
                <MapSpoke key={Math.random()}
                          x1={start.x}
                          y1={start.y}
                          x2={end.x}
                          y2={end.y}
                          className={className} />
            );
        }.bind(this));
        return spokes;
    }

    render() {
        this.calculateLayout();
        let grid = this.drawGrid(),
            current = this.drawCurrentHub(),
            hubs = this.drawHubs(),
            spokes = this.drawSpokes();
        return (
            <div className="map" ref="mapContainer">
                <svg className="map__board" xmlns="http://www.w3.org/2000/svg"
                     width={this.state.containerWidth}
                     height={this.state.containerHeight}>
                    {grid}
                    {spokes}
                    {hubs}
                    {current}
                </svg>
            </div>
        );
    }
}

class MapPolygon extends React.Component {
    render() {
        return (
            <polygon
                xmlns="http://www.w3.org/2000/svg"
                points={this.props.points}
                onClick={this.props.onClick}
                className={this.props.className} />
        );
    }
}

class MapSpoke extends React.Component {
    render() {
        return (
            <line
                xmlns="http://www.w3.org/2000/svg"
                x1={this.props.x1}
                x2={this.props.x2}
                y1={this.props.y1}
                y2={this.props.y2}
                className={this.props.className} />
        );
    }
}