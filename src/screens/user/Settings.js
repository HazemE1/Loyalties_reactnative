import React, { Component } from 'react';
import { View, Text, Image, Switch } from 'react-native';
import { styling, getLogo, getColorScheme } from "../../assets/components/schematics"
import { FontAwesome } from '@expo/vector-icons';
import User from "../../assets/enteties/User"

export default class Settings extends Component {
    constructor(props) {
        super(props);
        var user = new User();
        this.state = {
            user: user,

            settings: { ...user.settings },
        };
    }

    render() {
        if (true)
            return (
                <View style={styling.wrapper}>
                    <View style={styling.container}>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Image ref={(im) => this.image = im} style={{ width: 100, height: 100, borderRadius: 100, margin: 5 }} source={{ uri: this.state.user.image }} />
                            <Text style={{ fontWeight: "bold" }}>BYT PROFILBILD</Text>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 40 }}>

                        </View>
                        <View style={{ flex: 1, marginBottom: 30, justifyContent: "flex-end" }}>
                            <Text style={{ textAlign: "center", fontSize: 30, color: "red", textDecorationColor: "red", textDecorationStyle: "solid", textDecorationLine: "underline" }}>RADERA KONTO</Text>
                        </View>
                    </View>
                </View >
            );
        else {
            return (
                <View>
                    <Text> Settings </Text>
                </View>
            );
        }
    }
}
