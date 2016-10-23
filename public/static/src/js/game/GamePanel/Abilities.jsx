import React from 'react';
import GamePanel from './GamePanel';
import Lightbox from '../../utils/Lightbox';

export default class Abilities extends GamePanel {
    render() {
        let abilities = this.state.gameState.abilities,
            groups = [];

        abilities.forEach(function(group, i) {
            groups.push(
                <li key={i} className="abilities-list__group">
                    <AbilitiesGroup group={group} />
                </li>
            );
        });

        return (
            <ul className="abilities-list">{groups}</ul>
        );
    };
}

class AbilitiesGroup extends React.Component {
    render() {
        let items = [];

        this.props.group.items.forEach(function(item, i) {
            items.push(
                <li key={i} className="abilities-list__item g">
                    <AbilitiesItem item={item} />
                </li>
            );
        });

        return (
            <div>
                <h3 className="abilities-list__group-heading e">
                    <span className="layout-limit">{this.props.group.title}</span>
                </h3>
                <div className="layout-limit">
                    <ul className="abilities-list__group-items grid">{items}</ul>
                </div>
            </div>
        )
    }
}

class AbilitiesItem extends React.Component {
    constructor() {
        super();
        this.state = {
            modalOpen : false
        };
    };

    onClick() {
        this.setState({
            modalOpen : true
        });
    }

    useAbility() {
        alert('Forcefield!');
    }

    modalCloseCallback() {
        this.setState({
            modalOpen : false
        });
    }

    render() {
        let item = this.props.item;

        if (item.mystery) {
            return (
                <div>
                    <button className="ability ability--mystery" onClick={this.onClick.bind(this)}>
                        <span className="ability__name">?</span>
                        <span className="ability__count">-</span>
                    </button>
                    <Lightbox modalIsOpen={this.state.modalOpen}
                              closeCallback={this.modalCloseCallback.bind(this)}
                              title="?">
                        <p>You are yet to unlock this ability (by finding it in the wild)</p>
                    </Lightbox>
                </div>
            );
        }

        let abilityClass = 'ability ',
            useButton = null;

        if (item.count) {
            useButton = (
                <p className="text--center">
                    <button onClick={this.useAbility.bind(this)}>Use now</button>
                </p>
            );
        } else {
            abilityClass += 'ability--empty';
        }
        return (
            <div>
                <button className={abilityClass} onClick={this.onClick.bind(this)}>
                    <span className="ability__name">{item.ability.name}</span>
                    <span className="ability__count">{item.count}</span>
                </button>
                <Lightbox modalIsOpen={this.state.modalOpen}
                          closeCallback={this.modalCloseCallback.bind(this)}
                          title={item.ability.name}>
                    <p>
                        {item.ability.description}
                    </p>
                    <p className="text--center">
                        Number available: {item.count}
                    </p>
                    {useButton}
                </Lightbox>
            </div>
        );
    }
}