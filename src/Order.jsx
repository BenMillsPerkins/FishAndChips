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

    parseOrder() {
        var data = this.state.data;
        var fullOrder = [];
        for (var i in data) {
            for (var j in data[i].order) {
                const count = data[i].order[j];
                fullOrder[j] ? '' : fullOrder[j] = [];
                for (var k = 0; k < count; k++) {
                    fullOrder[j].push(data[i].initials);
                }
            }
        }

        if (this.state.data.length != 0) {
            var parsedOrder = [];
            for (var item in fullOrder) {
                parsedOrder[item] = [
                    '', fullOrder[item].length
                ];
                for (var initial in fullOrder[item]) {
                    parsedOrder[item][0] = parsedOrder[item][0] + ' ' + fullOrder[item][initial];
                }
            };
        };

        return parsedOrder
    }

    parseInits() {
        var data = this.state.data;
        var orderedInits = '';
        for (var i in data) {
            for (var j in data[i].order) {
                orderedInits += data[i].initials + ' ';
            }
        }

        return orderedInits
    }

    renderInits() {
        const parsedInits = this.parseInits();

        return (
            <div className="has-ordered__list">
                {parsedInits}
            </div>
        )
    }


    renderOrder() {
        const parsedOrder = this.parseOrder();

        return Object.entries(parsedOrder).map(([key, value]) => {
                return (
                    <div className="order-list-item" key={key}>
                        <span className="has-text-weight-bold">{value[1]} {key}:</span> {value[0]}
                    </div>
                )
            })
        }

    render() {
        return (
            <div className="columns">
                <div className="column is-mobile order-list">
                    <h2 className="subtitle">Current Order:</h2>
                    {this.renderOrder()}
                </div>
                <div className="column is-mobile has-ordered">
                    <h2 className="subtitle">People Who Have Ordered:</h2>
                    {this.renderInits()}
                </div>
            </div>
        );
    }
}

export default Order;