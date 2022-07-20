import {Appearance, Image, Platform, StyleSheet} from "react-native"
import logo from "../images/logo.png"
import Constants from "expo-constants";


const cs = {
    dark: {
        first_color: "rgba(0,0,0,1)",
        secondary_color: "rgba(50,50,50,1)",
        third_color: "rgba(100,100,100,1)",
        fourth_color: "rgba(150,150,150,1)",
        overlay_color: "rgba(0,0,0,0.7)",
        bg_color: "rgba(9, 0, 51,1)",
        text_color: "rgba(255,255,255,1)",

    },

    light: {
        first_color: "rgba(255,255,255,1)",
        secondary_color: "rgba(200,200,200,1)",
        third_color: "rgba(150,150,150,1)",
        fourth_color: "rgba(100,100,100,1)",
        overlay_color: "rgba(255,255,255,0.7)",
        bg_color: "rgba(23, 0, 130,1)",

        text_color: "rgba(0,0,0,1)",

    }
}

export function getColorScheme() {
    if (Appearance.getColorScheme() == "dark")
        return cs.dark;
    else
        return cs.light;
}

export function genUUID() {
    return String(
        Math.random() * 50 +
        Date.now() + Math.random() * 50 +
        Math.random() * 50).replace(",", "").replace("-", "").replace(".", "")
}

const statusBarHeight = Platform.OS === "ios" ? 0 : Constants.statusBarHeight + 5;

export const styling = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: getColorScheme().bg_color
    },
    container: {
        flex: 1,

        marginTop: statusBarHeight,
        backgroundColor: getColorScheme().bg_color
    },
    title: {
        color: getColorScheme().text_color,
        fontSize: 40,
        fontWeight: "bold"
    },
    subtitle: {
        color: getColorScheme().text_color,
        fontSize: 30,
    },
    text: {
        color: getColorScheme().text_color,
        fontSize: 20,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 20
    }
});

export function getLogo(style) {
    return (<Image source={logo} style={{...style, resizeMode: "contain"}}/>)
}