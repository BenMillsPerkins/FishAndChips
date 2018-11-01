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
        falseOrderHandle -= 1;
        falseOrder[handle] = falseOrderHandle;
        this.setState({falseOrder})
    }

    sendOrder() {
        var orderObj = {};
        orderObj['initials'] = this.state.initials;
        orderObj['order'] = this.state.order;
        socket.emit('sendOrder', orderObj);
    }

    renderStage1() {
        const menuItems = ['test1', 'test2'];
        return Object.entries(menuItems).map(([key, value]) => {
            return (

                <div className="gutter-bottom-10">
                    <div key={key}>
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

    render() {
        return (
            <div>
                { this.state.stage === 0
                    ? <Landing
                    initials = {this.state.initials}
                    update = {name => this.update(name)}
                        />
                    : null
                }
                { this.state.stage === 1
                    ? this.renderStage1()
                    : null
                }
                { this.state.stage === 2
                    ? this.renderOrder()
                    : null
                }
                <div className="button-row">
                    {this.state.stage !== 0
                        ? <button className="back-button" type="button" onClick = {() => this.setState({stage: this.state.stage - 1})}><i className="fa fa-chevron-left"></i> Back</button>
                        : null
                    }
                    { this.state.stage == 0
                        ? <button className="next-q-button" type="button" onClick = {() => this.setState({stage: this.state.stage + 1})}>On To Order <i className="fa fa-chevron-right"></i></button>
                        : null
                    }
                    { this.state.stage == 1
                        ? <button className="next-q-button" type="button" onClick = {() => this.setState({stage: this.state.stage + 1})}>Finish Order <i className="fa fa-chevron-right"></i></button>
                        : null
                    }
                    {
                        this.state.stage == 2
                        ? <button className="next-q-button" type="button" onClick = {() => this.sendOrder()}>Yes, this is my order <i className="fa fa-chevron-right"></i></button>
                        : null
                    }
               </div>
           </div>
        );
    }
}

function Landing(props) {
    return (
        <div>
        <div className="gutter-bottom-10">
            <label className="font16" htmlFor="initInput">Initials: </label>
            <input className="font16" id="initInput" type="text" name="initials" onChange={props.update} value={props.initials}/>
        </div>
        </div>
    )
}

function MenuItem(props) {
    return (
        <div className={"menu-item " + (props.order[props.input] ? 'active-menu-item' : 'inactive-menu-item')}>
            <label className="font16" htmlFor={props.input + "Input"}> {props.input} </label>
            <div className="order-buttons">
                <div className="input-buttons">
                    <button className="increment-order-button take-from-order" type="button" name={props.input} onClick = {() => props.falseMinusFromOrder(props.input)}><i className="fa fa-minus"></i></button>
                    <input className="font16 order-input-field" id="NSinput" type="number" name={props.input} onChange={props.updateFalseOrder} value={props.falseOrder[props.input]}/>
                    <button className="increment-order-button add-to-order" type="button" name={props.input} onClick = {() => props.falseAddToOrder(props.input)}><i className="fa fa-plus"></i></button>
                </div>
                <div>
                {!props.order[props.input] ?
                    <button className="add-to-order-button" type="button" name={props.input} onClick = {() => props.updateOrder(props.input)}> updateOrder </button>
                    : <button className="remove-from-order-button" type="button" name={props.input} onClick = {() => props.removeFromOrder(props.input)}> Remove From Order </button>
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