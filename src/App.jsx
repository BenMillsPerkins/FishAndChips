import React, { Component } from 'react';
import io from 'socket.io-client';
let socket = io();
import OrderForm from './OrderForm.jsx';
import Order from './Order.jsx'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stage: 'DisplayOrder'
        }
    }

    render() {
        return (
            <div>
                <h1 className="banner-text bold">Fish and Chip Order Form</h1>
                {this.state.stage === 'DisplayOrder' ?
                <div className="order-display">
                    Current Order:
                    <Order />
                    <button className="next-q-button" type="button" onClick = {() => this.setState({stage: 'OrderForm'})}> Add my order <i className="fa fa-chevron-right"></i></button>
                </div>
                :
                <div>
                    <OrderForm />
                </div>
                }
            </div>
        );
    }
}

export default App;