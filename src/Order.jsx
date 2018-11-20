import React, { Component } from 'react';
import io from 'socket.io-client';
let socket = io();

var data = require('../donotdelete.json');

class Order extends Component {
    constructor(props) {
        super(props)
    }

    renderOrder() {
        var fullOrder = [];
        for (var i in data) {
            console.log(data[i].order);
            for (var j in data[i].order) {
                console.log(j);
                fullOrder[j] ? '' : fullOrder[j] = [];
                fullOrder[j].push(data[i].initials);
            }
        }
        console.log(fullOrder);
        return Object.entries(fullOrder).map(([key, value]) => {
            return (
                <div key={key}>
                    {key}: {value}   {value.length}
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.renderOrder()}
            </div>
        );
    }
}

export default Order;