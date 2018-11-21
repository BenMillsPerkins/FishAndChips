import React, { Component } from 'react';
import io from 'socket.io-client';
let socket = io();

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        fetch('./donotdelete.json')
          .then((res) => res.json())
          .then((data) => {
            this.setState({data});
          })
    }

    renderOrder() {
        var data = this.state.data;
        var fullOrder = [];
        for (var i in data) {
            for (var j in data[i].order) {
                console.log(data[i].order[j]);
                const count = data[i].order[j];
                fullOrder[j] ? '' : fullOrder[j] = [];
                for (var k = 0; k < count; k++) {
                    fullOrder[j].push(data[i].initials);
                }
            }
        }
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