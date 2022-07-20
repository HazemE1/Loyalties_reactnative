import React, {Component} from 'react';
import {Text, View} from 'react-native';

class Reward extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: "",
            info: {
              name: "",
              photoUrl: ""
            },
            owner: "",
            org: "",
        }
    }
    render() {
        return (
            <Text>

            </Text>
        );
    }
}

export default Reward;
