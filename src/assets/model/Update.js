import React, {Component} from 'react';
import {Animated, Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {getColorScheme} from "../components/schematics"
import {AntDesign, EvilIcons} from '@expo/vector-icons';

class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false,
            animation: new Animated.Value(0),
            title: this.props.title,
            photoUrl: this.props.photoUrl,
            desc: this.props.desc,
            uuid: this.props.uuid,
        }
        this.showEdit = this.props.showEdit

    }

    startAnimation = () => {
        this.setState({
            fullScreen: true
        })
        if (this.state.fullScreen !== true) {
            Animated.timing(this.state.animation, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            }).start()
        } else {
            Animated.timing(this.state.animation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start(() => {
                this.setState({
                    fullScreen: false
                })
            })
        }
    }

    componentDidMount() {
        if (this.props.fullScreen === true)
            this.startAnimation()
    }

    render() {

        const widthInterpolate = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["33%", "100%"],
        });

        const heightInterpolate = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["100%", "100%"],
        });
        return (
            <Animated.View key={this.state.uuid} style={{
                width: widthInterpolate,
                maxHeight: heightInterpolate, overflow: "hidden"
            }}>
                <TouchableWithoutFeedback onPress={() => this.props.pressed()}>
                    <View style={{
                        backgroundColor: getColorScheme().bg_color,
                        borderRadius: 10,
                        borderBottomEndRadius: 0,
                        borderBottomLeftRadius: 0,
                        padding: 10
                    }}>
                        {this.props.showEdit && this.state.fullScreen &&
                            <View style={{
                                position: "absolute",
                                height: "20%",
                                width: "100%",
                                flexDirection: "row",
                                zIndex: 10,
                                alignSelf: "center",
                                borderRadius:10
                            }}>
                                <TouchableWithoutFeedback onPress={async () => this.props.trash(this.state.uuid)}>
                                    <EvilIcons name="trash" size={24} color="white"/>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={async () => this.props.edit(this.state.uuid)}>
                                    <AntDesign name="edit" size={24} style={{flex: 1, textAlign: "right"}}
                                               color="white"/>
                                </TouchableWithoutFeedback>
                            </View>
                        }
                        <Image
                            style={{width: "100%", height:300, borderRadius: 10}}
                            source={{uri: this.state.photoUrl}}/>
                        <Text adjustsFontSizeToFit={true}
                              numberOfLines={1} style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            textAlign: "center",
                            color: "white"
                        }}>{this.state.title}</Text>

                        {this.state.fullScreen && <Text style={{color: "white"}}>
                            {this.state.desc}
                        </Text>}
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        );
    }

}


export default Update;
