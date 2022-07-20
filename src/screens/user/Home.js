import React, {Component} from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {getColorScheme, getLogo, styling} from "../../assets/components/schematics"
import PPComponent from '../../assets/components/ppcomponent';
import {AntDesign} from '@expo/vector-icons';

import {BlurView} from 'expo-blur';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showQr: false,
            hasLoaded: false
        };
        console.log(global.user)
    }


    getRandomImage() {
        return {uri: "https://random.imagecdn.app/101/100"}
    }

    toggleQR() {
        this.setState({showQr: !this.state.showQr})
    }

    select(selection) {
        if (selection === "new_org") {
            this.props.navigation.navigate("new_org")
        }
    }

    setHasLoaded() {
        this.setState({hasLoaded: true})
    }

    renderItem(item) {
        return (
            <View key={item.uuid} style={{...styling.shadow, flex: 1, flexBasis: "45%", height: 200, margin: 5}}>
                <TouchableOpacity key={item.uuid} style={{flex: 1}}>
                    <ImageBackground imageStyle={{opacity: 0.8, borderRadius: 10}} source={{uri: item.img}}
                                     key={item.uid}
                                     style={{
                                         flex: 1,
                                         borderRadius: 10,
                                         backgroundColor: getColorScheme().first_color,
                                     }}>
                        <Text style={{
                            ...styling.text,
                            backgroundColor: "rgba(0,0,0,0.3) ",
                            padding: 5
                        }}>{item.name}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        );
    }

    render() {

        if (global.user === undefined) {
            return <div/>
        }
        const list = {
            ...global.organisations
        }


        return (
            <SafeAreaView style={styling.wrapper}>
                {this.state.showQr &&
                    <TouchableWithoutFeedback onPress={() => this.toggleQR()}>
                        <BlurView intensity={5} style={{
                            position: "absolute",
                            height: "120%",
                            width: "100%",
                            backgroundColor: "rgba(255,255,255,0.5)",
                            zIndex: 100
                        }}>
                            <View style={{
                                flex: 1,
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <View style={{
                                    height: 250,
                                    width: 250,
                                    borderRadius: 70,
                                    backgroundColor: getColorScheme().bg_color,
                                    borderColor: "black",
                                    borderWidth: 2,
                                    alignContent: "center",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Image style={{width: 170, height: 170}}
                                           source={{uri: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=255-255-255&bgcolor=9-0-51&data=" + global.user.uuid}}/>
                                    <Text style={{textAlign: "center", color: "white"}}>Skanna mig</Text>
                                </View>
                            </View>

                        </BlurView>
                    </TouchableWithoutFeedback>
                }
                <View style={styling.container}>
                    <View style={{flexDirection: "row", zIndex: 1}}>
                        <View style={{flex: 1, alignItems: "center"}}>
                            <View style={{
                                ...styling.shadow,
                                height: 90,
                                width: 90,
                                borderRadius: 100,
                                backgroundColor: "white"
                            }}>
                                <PPComponent navigation={this.props.navigation} select={this.select}
                                             user={global.user}/>
                            </View>
                        </View>
                        <View style={{
                            flex: 2,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-end",
                            zIndex:10
                        }}>
                            <View style={{flex: 1}}>
                                <Text style={{...styling.text, textAlign: "center"}}>Stämplar</Text>
                                <Text style={{
                                    ...styling.text,
                                    textAlign: "center",
                                    zIndex:0

                                }}>{global.user.stats.stamps} st</Text>

                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{...styling.text}}>klara</Text>
                                <Text style={{...styling.text}}>{global.user.stats.done} st</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {
                        }}>
                            <View style={{
                                zIndex: 1,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 40,
                            }}>
                                <AntDesign name="search1" size={25} color={getColorScheme().text_color}
                                           style={{fontWeight: "bold"}}/>
                                <Text style={{
                                    ...styling.shadow,
                                    textAlign: "center",
                                    margin: 10,
                                    color: getColorScheme().text_color,
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}>SÖK</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={{height: "100%"}}
                        contentContainerStyle={{display: "flex", flexWrap: 1, flexDirection: "row"}}>
                        {Object.keys(list).map(v => this.renderItem(list[v]))}
                    </ScrollView>
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <TouchableWithoutFeedback onPress={() => this.toggleQR()}>
                            {getLogo({

                                margin: 10,
                                height: 80,
                                width: 80,

                            })}
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
