import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {getColorScheme, styling} from "./schematics";

const list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

class CardView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        let done = this.props.done
        let amount = this.props.amount
        let bg_img = this.props.bg_img
        let stamp_img = this.props.stamp_img
        let stamp_bg = this.props.stamp_bg
        let title = this.props.title
        let desc = this.props.desc
        const list = []
        for (let x = 0; x < amount; x++) {
            list.push(
                <ImageBackground imageStyle={{border: 10}}
                                 resizeMode={"stretch"} source={{uri: stamp_bg}} key={x} style={styles.stamp}>
                    {x < done ?
                        <Image
                            source={{uri: stamp_img}}
                            style={{
                                height: "110%",
                                transform: [{rotate: (Math.random() * 45).toString() + 'deg'}]
                            }}/>
                        : console.log(x + "-" + done)}
                </ImageBackground>)
        }

        return (
            <SafeAreaView>
                <ImageBackground resizeMode={"stretch"}
                                 imageStyle={{width: Dimensions.get("screen").width, opacity: 0.5}}
                                 source={{uri: bg_img}}
                                 style={{
                                     width: "100%",
                                     backgroundColor: getColorScheme().bg_color,
                                     borderRadius: 20,
                                     overflow: "hidden",
                                     padding: 10,
                                 }}>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                    }}>{title}</Text>
                    <Text style={{
                        fontSize: 20,
                        color: "white",
                        textAlign: "center",
                        marginBottom: 20,
                    }}>{desc}</Text>
                    <View style={{
                        flexDirection: "row",
                        flexWrap: 1,
                        justifyContent: "center",
                    }}>
                        {list.map((v) => {
                            return v
                        })}
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}

let size = ((Dimensions.get("screen").width - 22) / (list.length / 2)) - 16

if (list.length < 6)
    size = Dimensions.get("screen").width / list.length - 10

const styles = StyleSheet.create({
    stamp: {
        ...styling.shadow,
        margin: 8,
        height: size,
        width: size,
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center"
    }
})

export default CardView;
