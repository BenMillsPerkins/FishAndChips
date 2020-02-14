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
                <section className="hero is-info">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">Fish and Chips</h1>
                            <h2 className="subtitle">Order Form</h2>
                        </div>
                    </div>
                </section>
                {this.state.stage === 'DisplayOrder' ?
                <div className="container main-content main-content--home">
                    <Order />
                    <button className="button is-info order-add" type="button" onClick = {() => this.setState({stage: 'OrderForm'})}><i className="fa fa-pencil"></i> Add my order</button>
                </div>
                :
                <div>
                    <OrderForm />
                </div>
                }
                <footer className="footer">
                    <div className="content has-text-centered">
                        <p><strong>Phone Number:</strong> 01422 842 599</p>
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;