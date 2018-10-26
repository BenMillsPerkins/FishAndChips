import React, { Component } from 'react';
import io from 'socket.io-client';
let socket = io();
import OrderForm from './OrderForm.jsx';

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1 className="banner-text bold">Get yer fish and chips here</h1>
                <OrderForm />
            </div>
        );
    }
}

export default App;