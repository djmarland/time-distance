import React from 'react';
// import THREE from 'three'; // todo - figure out why this isn't importing properly
import FetchJson from '../../../utils/FetchJson';
import Points from '../../Utils/Points';

export default class Spoke extends React.Component {
    constructor() {
        super();
        this.allowAnimationUpdate = false;
        this.state = {
            timeLeft : null,
            containerWidth: null,
            containerHeight: null
        };
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.tunnelTexture = null;
        this.clock = null;
    };

    handleSize() {
        if (this.refs.visualContainer) {
            let {clientHeight, clientWidth} = this.refs.visualContainer;
            this.setState({
                containerHeight: clientHeight,
                containerWidth: clientWidth
            });
        }
    }

    makeScene() {
        let {clientHeight, clientWidth} = this.refs.visualContainer; // todo - handle a resize

        // scene
        this.scene = new THREE.Scene();

        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.setSize( clientWidth, clientHeight );

        // camera
        this.camera = new THREE.PerspectiveCamera( 75, clientWidth / clientHeight, 0.1, 1000 );
        this.camera.position.z = -100;
        this.camera.lookAt(this.scene.position);

        let loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
            // resource URL
            '/static/dist/img/spoke.png',
            // Function when resource is loaded
            function (texture) {
                // do something with the texture
                // var material = new THREE.MeshBasicMaterial( {
                //     map: texture
                // } );
                this.tunnelTexture = texture;
                this.tunnelTexture.wrapT = this.tunnelTexture.wrapS = THREE.RepeatWrapping;
                this.tunnelTexture.repeat.set(1, 2);

                // Tunnel Mesh
                let color = 0x999999,
                    tunnelMesh = new THREE.Mesh(
                        new THREE.CylinderGeometry(4, 50, 1024, 6, 32, true),
                        new THREE.MeshBasicMaterial({
                            color: color,
                            transparent: true,
                            alphaMap: this.tunnelTexture,
                            side: THREE.BackSide,
                        })
                    );
                tunnelMesh.rotation.x = Math.PI / 2;
                tunnelMesh.rotation.y = Math.PI / 2;
                tunnelMesh.position.z = 0;
                this.scene.add(tunnelMesh);
            }.bind(this)
        );

        // tunnel
        // THREE.ImageUtils.crossOrigin = '';
        // this.tunnelTexture = THREE.ImageUtils.loadTexture('/static/dist/img/spoke.jpg');
        // this.tunnelTexture.wrapT = this.tunnelTexture.wrapS = THREE.RepeatWrapping;
        // this.tunnelTexture.repeat.set(1, 2);



        this.clock = new THREE.Clock();

        this.refs.visualContainer.appendChild( this.renderer.domElement );
    }

    componentDidMount(){
        this.allowAnimationUpdate = true;
        this.handleSize();
        this.makeScene();
        this.animationFrame();
        window.addEventListener('resize', this.handleSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleSize.bind(this));
        this.allowAnimationUpdate = false;
    }

    animationFrame() {
        if (!this.allowAnimationUpdate) {
            return;
        }

        this.updateTimeLeft();
        this.updateScene();

        window.requestAnimationFrame(this.animationFrame.bind(this));
    }

    updateScene() {
        if (this.tunnelTexture) {
            this.tunnelTexture.offset.y = this.clock.getElapsedTime() / 12;
            this.renderer.render(this.scene, this.camera);
        }
    }

    arrival() {
        FetchJson.getUrl(
            '/play/status.json',
            function(newGameState) {
                if (newGameState.position.isInHub) {
                    this.props.onGameStateChange(newGameState);
                } else {
                    // try again (in case the JS is ahead of the server somehow)
                    setTimeout(function() {
                        this.arrival();
                    }.bind(this), 1000);
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
        let now = new Date(),
            calcTime = new Date(this.props.position.exitTime),
            secondsDiff = (calcTime.getTime() - now.getTime()) / 1000,
            roundedSecondsDiff = Math.floor(secondsDiff),
            hours = Math.floor(roundedSecondsDiff / 3600),
            hoursRem = roundedSecondsDiff - (hours * 3600),
            minutes = Math.floor(hoursRem / 60),
            seconds = hoursRem - (minutes * 60);

        if (secondsDiff <= 0) {
            this.setState({
                timeLeft : 0
            });
            this.allowAnimationUpdate = false;
            this.arrival();
            return;
        }

        let timeLeft = hours + ':' + this.padNumber(minutes) + ':' + this.padNumber(seconds);

        this.setState({
            timeLeft : timeLeft
        });
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
            <div className="game__travelling">
                <div id="Game-Spoke-Visual" className="game__travelling-visual" ref="visualContainer"></div>
                <div className="game__travelling-details">
                    <div className="travel-detail">
                        <h2>Travelling</h2>
                        <p>Origin: {origin.name} - {origin.cluster.name}</p>
                        <p>Arrving: {arrivalTime}</p>
                        <p>Points earned: <Points
                            value={0}
                            time={this.props.position.entryTime}
                            rate={1}
                            /></p>
                        <p>Destination: {destination.name} - {destination.cluster.name}</p>
                    </div>
                </div>
            </div>
        );
    }
}