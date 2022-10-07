import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {getColorScheme, styling} from "./schematics";

const list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

class CardView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /*
    <CardView
    done={0}
    amount={5}
    bg_img={"src"}
    stamp_img={"Src"}
    stamp_bg = {"src"}
    title = {"test"}
    desc = {"desc"}
    />
     */

    render() {



        const list = []
        for (let x = 0; x < this.props.amount; x++) {
            if (this.props.rewards[x] === undefined)
                list.push(
                    <ImageBackground
                        resizeMode={"stretch"} source={{uri: this.props.stamp_bg}} key={x} style={styles.stamp}>
                        {x < this.props.done &&
                            <Image
                                source={{uri: this.props.stamp_img}}
                                style={{
                                    height: "110%",
                                    transform: [{rotate: (Math.random() * 20).toString() + 'deg'}]
                                }}/>}
                    </ImageBackground>)
            else
                list.push(
                    <ImageBackground
                        resizeMode={"stretch"} source={{uri: this.props.rewards[x].photoUrl}} alt={""} key={x}
                        style={styles.stamp}>
                        {x < this.props.done &&
                            <Image
                                source={{uri: this.props.stamp_img}}
                                style={{
                                    height: "110%",
                                    transform: [{rotate: (Math.random() * 45).toString() + 'deg'}]
                                }}/>}
                    </ImageBackground>)
        }

        return (
            <SafeAreaView>
                <ImageBackground resizeMode={"stretch"}
                                 imageStyle={{width: Dimensions.get("screen").width, opacity: 0.5}}
                                 source={{uri: this.props.bg_img}}
                                 style={{
                                     width: "100%",
                                     backgroundColor: getColorScheme().bg_color,
                                     borderRadius: 20,
                                     overflow: "hidden",
                                     padding: 10,
                                 }}>
                    <Text adjustsFontSizeToFit={true}
                          numberOfLines={1} style={{
                        fontSize: 50,
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                    }}>{this.props.title}</Text>
                    <Text adjustsFontSizeToFit={true}
                          numberOfLines={3} style={{
                        fontSize: 20,
                        color: "white",
                        textAlign: "center",
                        marginBottom: 20,
                        maxHeight: 60
                    }}>{this.props.desc}</Text>
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
