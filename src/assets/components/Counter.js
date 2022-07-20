import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: this.props.value
        }
    }


    render() {
        return (
            <View style={[{flexDirection: "row", alignItems: "center"}, this.props.style]}>
                {this.state.count > this.props.min &&
                    <TouchableOpacity onPress={() => {
                        if (this.state.count <= this.props.min)
                            return
                        this.setState({count: this.state.count - 1}, this.props.onChange(this.state.count - 1))
                    }}>
                        <Text style={[this.props.arrow, this.props.remove]}>
                            -
                        </Text>
                    </TouchableOpacity>
                }
                <Text style={this.props.counter}>
                    {this.state.count}
                </Text>
                {this.state.count < this.props.max &&
                    <TouchableOpacity onPress onPress={() => {
                        if (this.state.count === this.props.max)
                            return
                        this.setState({count: this.state.count + 1}, this.props.onChange(this.state.count + 1))
                    }}>
                        <Text style={[this.props.arrow, this.props.add]}>
                            +
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

export default Counter;
