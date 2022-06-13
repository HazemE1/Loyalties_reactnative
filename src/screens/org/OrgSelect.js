import React, {Component} from 'react';
import {SafeAreaView, Text, TouchableWithoutFeedback, View} from 'react-native';

import {getColorScheme, styling} from "../../assets/components/schematics"

export default class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: global.user,
        };
    }

    render() {
        return (
            <SafeAreaView style={[styling.wrapper, {backgroundColor: getColorScheme().bg_color}]}>
                <View style={[styling.container, {backgroundColor: getColorScheme().bg_color}]}>
                    <Text
                        style={{fontFamily: "Pacifico_400Regular", textAlign: "center", fontSize: 30, color: "white"}}>NY
                        ORGANISATION</Text>

                    <View style={{flex: 1, margin: 10, borderRadius: 20}}>
                        <Text style={{fontSize: 20, textAlign: "center", color: "white"}}>Ska du registrera en ny
                            orginastion {"\n"}väljer du här vilken nivå du vill ha</Text>

                        <TouchableWithoutFeedback onPress={() => {
                            this.props.navigation.navigate("OrgRegister", {grade: "basic"})
                        }} style={{
                            flex: 2,
                            backgroundColor: "rgba(0,255,0,0.34)",
                            marginBottom: 10,
                            marginTop: 5,
                            borderRadius: 10,
                            overflow: "hidden"
                        }}>
                            <View style={{
                                backgroundColor: "rgba(0,255,0,0.34)",
                                marginBottom: 10,
                                marginTop: 5,
                                borderRadius: 10,
                                overflow: "hidden"
                            }}>
                                <Text style={{
                                    fontFamily: "Pacifico_400Regular",
                                    textAlign: "center",
                                    fontSize: 20,
                                    color: "white",
                                    backgroundColor: "rgba(0,0,0,0.2)",
                                    marginBottom: 5
                                }}>BASIC</Text>
                                <Text style={{paddingLeft: 10, color: "white"}}>
                                    <Text style={{
                                        fontWeight: "bold",
                                        color: "rgb(200,200,200)",
                                        fontSize: 15
                                    }}>Fördelar</Text>
                                    {"\n"}
                                    {"\n"}
                                    + Tillgång till ett basic företagskonto {"\n"}{"\n"}
                                    + Tillgång till fem medarbetare.{"\n"}{"\n"}
                                    + Skapa upp till tjugo nya nyheter.{"\n"}{"\n"}
                                </Text>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: "rgb(220,255,220)",
                                    fontSize: 20,
                                    textAlign: "center"
                                }}>599kr/månad</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={{
                            flex: 3,
                            backgroundColor: "rgba(126,126,255,0.34)",
                            borderRadius: 10,
                            overflow: "hidden"
                        }}>
                            <View style={{
                                backgroundColor: "rgba(126,126,255,0.34)",
                                borderRadius: 10,
                                overflow: "hidden"
                            }}>
                                <Text style={{
                                    fontFamily: "Pacifico_400Regular",
                                    textAlign: "center", fontSize: 20,
                                    color: "rgb(67,255,137)",
                                    backgroundColor: "rgba(0,0,0,0.54)",
                                    marginBottom: 5
                                }}> + PREMIUM +</Text>
                                <Text style={{paddingLeft: 10, color: "white"}}>
                                    <Text style={{
                                        fontWeight: "bold",
                                        color: "rgb(67,255,137)",
                                        fontSize: 15
                                    }}>Fördelar</Text>
                                    {"\n"}
                                    {"\n"}
                                    + Lägga till oändligt många medarbetare{"\n"}{"\n"}
                                    + Ladda upp oändligt många nyheter{"\n"} {"\n"}
                                    + Kan redigera stämpelkortet.{"\n"} {"\n"}
                                    + Tillgång till avancerad statestik.{"\n"} {"\n"}
                                    + Mer synlig för användare{"\n"} {"\n"}
                                    + Snabbare uppdateringar{"\n"} {"\n"}
                                    + tillgång till beta funktioner{"\n"}

                                </Text>
                                <Text style={{
                                    fontWeight: "bold",
                                    color: "rgb(67,255,137)",
                                    fontSize: 20,
                                    textAlign: "center"
                                }}>799kr/månad</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        this.props.navigation.navigate("home")
                    }}>
                        <Text style={{
                            alignSelf: "center",
                            margin: 5,
                            fontSize: 20,
                            color: "white",
                            fontWeight: "bold"
                        }}>AVBRYT</Text>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        );
    }
}
