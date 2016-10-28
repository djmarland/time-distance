import React from 'react';

export default class SvgViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            matrix: [1, 0, 0, 1, 0, 0],
            dragging: false, // useful later in the blog
        };
    }

    componentDidMount() {
        if (this.props.initialPan) {
            const m = this.state.matrix;
            m[4] = this.props.initialPan[0];
            m[5] = this.props.initialPan[1];
            this.setState({ matrix: m });
        }
    }

    onDragStart(e) {
        // Find start position of drag based on touch/mouse coordinates.
        const startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;
        const startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;

        // Update state with above coordinates, and set dragging to true.
        const state = {
            dragging: true,
            startX,
            startY,
        };

        this.setState(state);
    }

    onDragMove(e) {
        // First check if the state is dragging, if not we can just return
        // so we do not move unless the user wants to move
        if (!this.state.dragging) {
            return;
        }

        // Get the new x coordinates
        const x = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;
        const y = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;

        // Take the delta where we are minus where we came from.
        const dx = x - this.state.startX;
        const dy = y - this.state.startY;

        // Pan using the deltas
        this.pan(dx, dy);

        // Update the state
        this.setState({
            startX: x,
            startY: y,
        });
    }

    onDragEnd() {
        this.setState({ dragging: false });
    }

    onWheel(e) {
        if (e.deltaY < 0) {
            this.zoom(1.05);
        } else {
            this.zoom(0.95);
        }
    }

    pan(dx, dy) {
        const m = this.state.matrix;
        m[4] += dx;
        m[5] += dy;
        this.setState({ matrix: m });
    }

    zoom(scale) {
        const m = this.state.matrix;
        const len = m.length;
        for (let i = 0; i < len; i++) {
            m[i] *= scale;
        }
        m[4] += (1 - scale) * this.props.width / 2;
        m[5] += (1 - scale) * this.props.height / 2;
        this.setState({ matrix: m });
    }


    render() {
        const {height, width} = this.props;
        return (
            <svg
                height={height}
                width={width}
                onMouseDown={this.onDragStart.bind(this)}
                onTouchStart={this.onDragStart.bind(this)}
                onMouseMove={this.onDragMove.bind(this)}
                onTouchMove={this.onDragMove.bind(this)}
                onMouseUp={this.onDragEnd.bind(this)}
                onTouchEnd={this.onDragEnd.bind(this)}
                onWheel={this.onWheel.bind(this)}>
                <g transform={`matrix(${this.state.matrix.join(' ')})`}>
                    {this.props.children}
                </g>
            </svg>
        );
    }
}
