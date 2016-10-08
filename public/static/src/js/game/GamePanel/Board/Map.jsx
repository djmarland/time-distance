import React from 'react';

export default class Map extends React.Component {
    constructor() {
        super();
        this.hexRadius = 30;
        this.averageVerticalDiameter = 1.5 * this.hexRadius;
        this.innerRadius = (Math.sqrt(3)/2) * this.hexRadius;
        this.innerDiameter = this.innerRadius * 2;
        this.state = {
            containerHeight : null,
            containerWidth : null
        };
    };

    handleSize() {
        let { clientHeight, clientWidth } = this.refs.mapContainer;
        this.setState({
            containerHeight : clientHeight,
            containerWidth: clientWidth
        });
    }

    componentDidMount(){
        this.handleSize();
        window.addEventListener('resize', this.handleSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleSize.bind(this));
    }

    hexPoints(xCoord, yCoord) {
        let offset = (Math.sqrt(3) * this.hexRadius) / 2,
            x = this.innerRadius + offset * xCoord * 2,
            y = this.hexRadius + offset * yCoord * Math.sqrt(3),
            points = [],
            theta;
        if (yCoord % 2 !== 0) x += offset;
        for (theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
            let pointX = x + this.hexRadius * Math.sin(theta);
            let pointY = y + this.hexRadius * Math.cos(theta);
            points.push(pointX + ',' + pointY);
        }
        return points.join(' ');
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

    drawGrid() {
        let totalCol = Math.ceil(this.state.containerWidth /this.innerDiameter),
            totalRow = Math.ceil(this.state.containerHeight /this.averageVerticalDiameter),
            middleX = Math.floor(totalCol / 2) - 1,
            middleY = Math.floor(totalRow / 2) - 1,
            polygons = [],
            col, row;

        // todo - calculate the visibility server-side
        let revealed = [];
        revealed[middleY-2] = {};
        revealed[middleY-2][middleX-1] = true;
        revealed[middleY-2][middleX] = true;
        revealed[middleY-2][middleX+1] = true;

        revealed[middleY-1] = {};
        revealed[middleY-1][middleX-2] = !(middleY%2);
        revealed[middleY-1][middleX-1] = true;
        revealed[middleY-1][middleX] = true;
        revealed[middleY-1][middleX+1] = true;
        revealed[middleY-1][middleX+2] = middleY % 2;

        revealed[middleY] = {};
        revealed[middleY][middleX-2] = true;
        revealed[middleY][middleX-1] = true;
        revealed[middleY][middleX] = true;
        revealed[middleY][middleX+1] = true;
        revealed[middleY][middleX+2] = true;

        revealed[middleY+1] = {};
        revealed[middleY+1][middleX-2] = !(middleY%2);
        revealed[middleY+1][middleX-1] = true;
        revealed[middleY+1][middleX] = true;
        revealed[middleY+1][middleX+1] = true;
        revealed[middleY+1][middleX+2] = middleY % 2;

        revealed[middleY+2] = {};
        revealed[middleY+2][middleX-1] = true;
        revealed[middleY+2][middleX] = true;
        revealed[middleY+2][middleX+1] = true;

        for (col = -1; col < totalCol; col++) {
            for (row = -1; row < totalRow; row++) {
                let className = 'map__grid ';

                if (revealed[row] && revealed[row][col]) {
                    className += 'map__grid--visible';
                }

                polygons.push(this.makeHexagonPolygon(col, row, className));
            }
        }
        return polygons;
    }

    render() {
        let items = this.drawGrid();
        return (
            <div className="map" ref="mapContainer">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width={this.state.containerWidth}
                     height={this.state.containerHeight}>{items}</svg>
            </div>
        );
    }
}