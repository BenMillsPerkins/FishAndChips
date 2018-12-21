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
                <section className="hero has-background-light">
                    <div className="hero-body">
                        <div className="container">
                        <h1 className="title">Fish and Chips</h1>
                        <h2 className="subtitle">Order Form</h2>
                        </div>
                    </div>
                </section>
                {this.state.stage === 'DisplayOrder' ?
                <div className="order-display">
                    Current Order:
                    <Order />
                    <button className="button order-add" type="button" onClick = {() => this.setState({stage: 'OrderForm'})}> Add my order <i className="fa fa-chevron-circle-right"></i></button>
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