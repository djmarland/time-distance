import React from 'react';
import Modal from 'react-modal';

export default class Lightbox extends React.Component {
    constructor() {
        super();
        this.state = {modalIsOpen: false}
    };
    componentWillReceiveProps(props) {
        this.setState({
            modalIsOpen: props.modalIsOpen
        });
    }
    show() {
        this.setState({modalIsOpen: true});
    }
    close() {
        this.setState({modalIsOpen: false});
        if (this.props.closeCallback) {
            this.props.closeCallback();
        }
    }
    render() {
        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.close.bind(this)}
                className="lightbox__panel"
                overlayClassName="lightbox__overlay">
                <div className="lightbox__topbar">
                    <button className="lightbox__close" onClick={this.close.bind(this)}><svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <use xlinkHref="#icon-close" />
                    </svg></button>
                    <p className="lightbox__title">{this.props.title}</p>
                </div>
                <div className="lightbox__body">
                    {this.props.children}
                </div>
            </Modal>
        );
    }
};