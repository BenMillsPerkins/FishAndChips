import React, { Component } from 'react';
import io from 'socket.io-client';
let socket = io();

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            prices: {}
        }
    }

    componentDidMount() {
        fetch('./donotdelete.json')
            .then((res) => res.json())
            .then((data) => {
                this.setState({data});
        })

        fetch('./prices.json')
            .then((res) => res.json())
            .then((prices) => {
                this.setState({prices});
        })
    }

    parseOrder() {
        var data = this.state.data;
        var fullOrder = [];
        fullOrder["Total Chips"] = [];
        var chipCount = 0;
        for (var i in data) {
            for (var j in data[i].order) {
                const count = data[i].order[j];
                if (j == 'Team Chips') {
                    chipCount += 0.5;
                }
                if (j == 'Chips') {
                    chipCount += 1;
                }

                fullOrder[j] ? '' : fullOrder[j] = [];
                for (var k = 0; k < count; k++) {
                    fullOrder[j].push(data[i].initials);
                }
            }
        }

        chipCount = Math.ceil(chipCount);

        for (var k = 0; k < chipCount; k++) {
            fullOrder['Total Chips'].push('|');
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

        // Removes duplicates
        const cleanString = str => {
            str = str.split(" ");
            str = str.filter((n, i) => str.indexOf(n) === i);
            return str.join(" ");
        }

        return cleanString(orderedInits);
    }

    calcPrice() {
        var data = this.state.data;
        var prices = this.state.prices;
        var price = 0;
        if (prices[0]) {
            for (var i in data) {
                for (var j in data[i].order) {
                    const count = data[i].order[j];
                    prices[0][j] ? price = price + (count * prices[0][j]) : '' ;
                }
            }
        }
        return price;
    }


    renderPrice() {
        const calcPrice = this.calcPrice().toFixed(2);

        return (
            <div>
                Approximate Price: £{calcPrice}
            </div>
        )
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
                    <div>
                        {this.renderPrice()}
                    </div>
                    <h2 className="subtitle">Current Order:</h2>
                    <div className="order-list">
                        {this.renderOrder()}
                    </div>
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
