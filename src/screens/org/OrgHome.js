import React, {Component} from 'react';
import {
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
import {Ionicons} from '@expo/vector-icons';


import {BarCodeScanner} from 'expo-barcode-scanner';
import {BlurView} from "expo-blur";

export default class OrgHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: global.user,
            showQr: false,
        };
    }

   async componentDidMount() {
        await BarCodeScanner.requestPermissionsAsync();
        //console.log(global.user.selectedUser)
        //console.log(global.user.workPlaces[global.user.selectedUser])
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

    toggleQR() {
        this.setState({showQr: !this.state.showQr})
    }

    async scanQR(data){
        return true
    }

    render() {
        const org = global.organisations[global.user.selectedUser]
        const list = {
            ...global.organisations
        }


        if (org.owner === global.user.uuid)
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
                                        <BarCodeScanner
                                            style={{width: 170, height: 170}}
                                            onBarCodeScanned={async (v) => {
                                                if (await this.scanQR(v.data)){
                                                    alert("You gave the user a new stamp!")
                                                    this.toggleQR()
                                                }
                                            }}
                                        />
                                    </View>
                                </View>

                            </BlurView>
                        </TouchableWithoutFeedback>
                    }
                    <View style={styling.container}>
                        <View style={{flexDirection: "row", zIndex: 10}}>
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
                                alignItems: "flex-end"
                            }}>
                                <View style={{flex: 1}}>
                                    <Text style={{...styling.text, textAlign: "center"}}>Statestik</Text>
                                    <Ionicons name="stats-chart" style={{...styling.text, textAlign: "center"}}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={{...styling.text}}>Medarbetare</Text>
                                    <Ionicons name="people" style={{...styling.text, textAlign: "center"}}/>
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

                                    <Text style={{
                                        ...styling.shadow,
                                        textAlign: "center",
                                        margin: 10,
                                        color: getColorScheme().text_color,
                                        fontSize: 20,
                                        fontWeight: "bold",
                                    }}>UPDATES <Ionicons name="newspaper" size={20}/></Text>
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
            )
    }
}


