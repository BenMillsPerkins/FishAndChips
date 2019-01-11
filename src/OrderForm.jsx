import React, { Component } from 'react';
import io from 'socket.io-client';
let socket = io();

class OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initials: '',
            order: {},
            falseOrder: {},
            stage: 0
        }
    }

    update(handle) {
        this.setState({[handle.target.name]: handle.target.value})
    }

    updateOrder(update) {
        const order = this.state.order;
        if (this.state.falseOrder[update] < 1) {
            return this.removeFromOrder(update);
        }
        if (!isNaN(this.state.falseOrder[update])) {
            order[update] = this.state.falseOrder[update];
        }


        this.setState({order})
    }

    removeFromOrder(update) {
        const order = this.state.order;
        delete(order[update]);

        this.setState({order})
    }

    updateFalseOrder(update) {
        const falseOrder = this.state.falseOrder;
        falseOrder[update.target.name] = update.target.value;
        this.setState({falseOrder})
    }

    falseAddToOrder(handle) {
        const falseOrder = this.state.falseOrder;
        var falseOrderHandle = parseInt(falseOrder[handle]);
        if (isNaN(falseOrderHandle)) {
            falseOrderHandle = 0
        }
        falseOrderHandle += 1;
        falseOrder[handle] = falseOrderHandle;
        this.setState({falseOrder})
    }

    falseMinusFromOrder(handle) {
        const falseOrder = this.state.falseOrder;
        var falseOrderHandle = parseInt(falseOrder[handle]);
        if (falseOrderHandle > 0) {
            falseOrderHandle -= 1;
            falseOrder[handle] = falseOrderHandle;
            this.setState({falseOrder})
        }
    }

    sendOrder() {
        var orderObj = {};
        orderObj['initials'] = this.state.initials;
        orderObj['order'] = this.state.order;
        socket.emit('sendOrder', orderObj);
        const stage = this.state.stage + 1;
        this.setState({stage});
    }

    renderStage1() {
        const menuItems = ['Team Chips', 'Fish', 'Fish Butty', 'Battered Sausage', 'Plain Sausage', 'Battered Sausage Butty', 'Cheesy Chips', 'Chip Butty', 'Curry Sauce - Small', 'Curry Sauce - Large', 'Mushy Peas - Small', 'Mushy Peas - Large', 'Gravy - Small', 'Gravy - Large', 'Fish and Chips', 'Small Chips', 'Scampi', 'Beans - Small', 'Beans - Large', 'Chicken Nuggets', 'Steak n Kidney Pie (Chip Shop)', 'Meat Pie (Chip Shop)', 'Beef and Onion Pie (Chip Shop)', 'Chicken and Mushroom Pie (Chip Shop)', 'Steak n Kidney Pie (Pastry Shop)', 'Meat Pie (Pastry Shop)', 'Beef and Onion Pie (Pastry Shop)', 'Chicken and Mushroom Pie (Pastry Shop)'];
        return Object.entries(menuItems).map(([key, value]) => {
            return (
                this.state.order[value] ? ''
                :
                <div key={key} className={"menu-item " + (this.state.order[value] ? 'active-menu-item' : 'inactive-menu-item')}>
                    <MenuItem

                    input = {value}
                    order = {this.state.order}
                    falseOrder = {this.state.falseOrder}
                    updateOrder = {name => this.updateOrder(name)}
                    updateFalseOrder = {name => this.updateFalseOrder(name)}
                    falseAddToOrder = {name => this.falseAddToOrder(name)}
                    falseMinusFromOrder = {name => this.falseMinusFromOrder(name)}
                    removeFromOrder = {name => this.removeFromOrder(name)}
                    />
                </div>
            )
        })
    }

    renderBasket() {
        const order = this.state.order;
        return Object.entries(order).map(([key, value]) => {
            return (
                <div className="basket-item">
                    <MenuItem

                    input = {key}
                    order = {order}
                    falseOrder = {this.state.falseOrder}
                    updateOrder = {name => this.updateOrder(name)}
                    updateFalseOrder = {name => this.updateFalseOrder(name)}
                    falseAddToOrder = {name => this.falseAddToOrder(name)}
                    falseMinusFromOrder = {name => this.falseMinusFromOrder(name)}
                    removeFromOrder = {name => this.removeFromOrder(name)}
                    />
                </div>
            )
        })
    }

    renderOrder() {
        const order = this.state.order;
        return Object.entries(order).map(([key, value]) => {
			return (
                <div key={key}>
                    Item: {key}: {value}
                </div>
			)
		})
    }

    refreshPage() {
        window.location.reload();
    }

    render() {
        const initials = this.state.initials;

        var submitDisabled = 'test';
        submitDisabled = initials ? false : true;

        return (
            <div className="container main-content">
                { this.state.stage === 0
                    ? <Landing
                    initials = {this.state.initials}
                    update = {name => this.update(name)}
                        />
                    : null
                }
                { this.state.stage === 1
                    ?
                    <div className="columns">
                        <div className="column is-mobile inactive-order"> {this.renderStage1()} </div>
                        <div className="column is-mobile basket"> {this.renderBasket()} </div>
                    </div>
                    : null
                }
                { this.state.stage === 2
                    ? <article className="message is-warning">
                        <div className="message-header">
                            <p>Is this your order?</p>
                        </div>
                        <div className="message-body">
                            {this.renderOrder()}
                        </div>
                    </article>
                    : null
                }
                { this.state.stage === 3
                    ? <div>
                        <article className="message is-success">
                            <div className="message-header">
                                <p>Confirmed!</p>
                            </div>
                            <div className="message-body">
                                Thanks, your order has been placed!
                            </div>
                        </article>
                        <div>
                            <button className="button is-info full-order" type="button" onClick = {() => this.refreshPage()}><i className="fa fa-list"></i> See the full order</button>
                        </div>
                    </div>
                    : null
                }
                <div className="container main-content main-content--initials">
                    {this.state.stage !== 0 && this.state.stage !== 3
                        ? <button className="button is-info back-button" type="button" onClick = {() => this.setState({stage: this.state.stage - 1})}><i className="fa fa-chevron-left"></i> Back</button>
                        : null
                    }
                    { this.state.stage == 0
                        ? <button className="button is-info to-order" type="button" disabled={submitDisabled} onClick = {() => this.setState({stage: this.state.stage + 1})}>On To Order <i className="fa fa-chevron-right"></i></button>
                        : null
                    }
                    { this.state.stage == 1
                        ? <button className="button is-success finish-order" type="button" onClick = {() => this.setState({stage: this.state.stage + 1})}>Finish Order <i className="fa fa-chevron-right"></i></button>
                        : null
                    }
                    {
                        this.state.stage == 2
                        ? <button className="button is-success confirm-order" type="button" onClick = {() => this.sendOrder()}>Yes, this is my order <i className="fa fa-chevron-right"></i></button>
                        : null
                    }
               </div>
           </div>
        );
    }
}

function Landing(props) {
    return (
        <div className="container main-content">
            <div className="gutter-bottom-10">
                <label className="is-size-6 has-text-weight-bold" htmlFor="initInput">Initials: </label>
                <input className="is-size-6" id="initInput" type="text" name="initials" onChange={props.update} value={props.initials}/>
            </div>
        </div>
    )
}

function MenuItem(props) {
    return (
        <div>
            <p className="food-item-label" htmlFor={props.input + "Input"}>
                <span className="has-text-weight-bold">{props.input}:</span> <label className="order-quantity" id="NSinput" name={props.input} onChange={props.updateFalseOrder} value={props.falseOrder[props.input]}>{props.falseOrder[props.input]}</label>
            </p>
            <div className="order-buttons">
                <div className="input-buttons buttons has-addons">
                    <button className="button is-info is-outlined increment-order-button take-from-order" type="button" name={props.input} onClick = {() => props.falseMinusFromOrder(props.input)}>
                        <span className="icon is-small">
                            <i className="fa fa-minus"></i>
                        </span>
                        <span>Less</span>
                    </button>
                    <button className="button is-info is-outlined increment-order-button add-to-order" type="button" name={props.input} onClick = {() => props.falseAddToOrder(props.input)}>
                        <span className="icon is-small">
                            <i className="fa fa-plus"></i>
                        </span>
                        <span>More</span>
                    </button>
                    <button className="button is-info is-outlined add-to-order-button" type="button" name={props.input} onClick = {() => props.updateOrder(props.input)}>
                    <span class="icon is-small">
                        <i class="fa fa-check"></i>
                    </span>
                    <span>Update Order</span>
                    </button>
                    {!props.order[props.input] ? ''
                        : <button className="button is-info is-outlined remove-from-order-button" type="button" name={props.input} onClick = {() => props.removeFromOrder(props.input)}>
                            <span className="icon is-small">
                                <i className="fa fa-trash"></i>
                            </span>
                            <span>Remove</span>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

function Stage2(props)
{
    return (
        <div>
            <div>
                <label className="font16" htmlFor="TestInput"> Is this your order? </label>
            </div>
            <div>
                {props.order}
            </div>
        </div>
    )
}

export default OrderForm;