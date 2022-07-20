import React, {Component} from 'react';
import {Animated, Image, Text, TouchableWithoutFeedback, View} from 'react-native';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import {styling} from "./schematics"

export default class PPComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            animation: {
                opacity: new Animated.Value(0)
            }
        };
    }


    animateIn = () => {
        this.setState({show: true})

        Animated.timing(this.state.animation.opacity, {
            toValue: 0.99,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

    animateOut = () => {
        Animated.timing(this.state.animation.opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => this.setState({show: false}));
    }


    render() {


        return (
            <View>
                <View style={{zIndex: 1, width: 90, height: 90}}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (!this.state.show) {
                            this.animateIn();
                        } else {
                            this.animateOut();
                        }
                    }}>
                        {global.user.selectedUser === "" ?
                            <Image ref={(im) => this.image = im}
                                   style={{width: 90, height: 90, resizeMode: "stretch", borderRadius: 200}}
                                   source={{uri: firebase.auth().currentUser.photoURL}}/>
                            :
                            <Image ref={(im) => this.image = im}
                                   style={{width: 90, height: 90, resizeMode: "stretch", borderRadius: 200}}
                                   source={{uri: global.organisations[global.user.selectedUser].img}}/>
                        }
                    </TouchableWithoutFeedback>
                </View>

                {this.state.show &&
                    <Animated.View style={{
                        ...styling.shadow,
                        zIndex: 2,
                        position: "absolute",
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: "rgb(255,255,255)",
                        width: "150%",
                        opacity: this.state.animation.opacity
                    }}>
                        {global.user.workPlaces.map((i) => {
                            return (
                                <TouchableWithoutFeedback key={i} onPress={() => {
                                    global.user.selectedUser = i
                                    this.animateOut()
                                    this.props.navigation.navigate("OrgHome")
                                }}
                                                          style={{marginTop: 10}}>
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}>{global.organisations[i].name}</Text>
                                </TouchableWithoutFeedback>)
                        })}

                        <TouchableWithoutFeedback onPress={() => {
                            this.props.navigation.navigate("OrgSelect")
                            this.animateOut()
                        }} style={{margin: 5}}>
                            <Text style={{color: "green", fontSize: 20, fontWeight: "bold", textAlign: "center"}}>NY
                                ORG</Text>
                        </TouchableWithoutFeedback>

                        {/*<TouchableHighlight onPress={() => console.log("INSTÄLLNINGAR")} style={{paddingTop: 10, fontSize:10}}>*/}
                        {/*    <Text style={{*/}
                        {/*        color: "blue",*/}
                        {/*        fontSize: 10,*/}
                        {/*        fontWeight: "bold",*/}
                        {/*        textAlign: "center"*/}
                        {/*    }}>INSTÄLLNINGAR</Text>*
                        /}
                        {/*</TouchableHighlight>*/}
                        <TouchableWithoutFeedback onPress={() => this.animateOut()} style={{paddingTop: 10}}>
                            <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>AVBRYT</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {
                            this.animateOut()

                            this.props.navigation.navigate("home")
                            global.user.selectedUser = ""
                        }} style={{paddingTop: 10}}>
                            <Text style={{
                                color: "blue",
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>HEM</Text>
                        </TouchableWithoutFeedback>
                    </Animated.View>

                }
            </View>
        );
    }
}


