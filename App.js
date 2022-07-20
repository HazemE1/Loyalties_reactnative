import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Pacifico_400Regular} from '@expo-google-fonts/pacifico';
import * as Font from "expo-font"
import AppLoading from 'expo-app-loading';

import Register from "./src/screens/Register";
import Home from "./src/screens/user/Home";
import Settings from './src/screens/user/Settings';
import LoginScreen from './src/screens/LoginScreen';
import OrgHome from "./src/screens/org/OrgHome"
import OrgRegister from "./src/screens/org/OrgRegister"
import OrgSelect from './src/screens/org/OrgSelect';
import Counter from "./src/assets/components/Counter";

import firebase from "firebase/compat/app";
import {initializeAuth} from "firebase/auth"
import {getReactNativePersistence} from "firebase/auth/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Organisation from "./src/assets/enteties/Organisation";

global.firebaseConfig = {
    apiKey: "AIzaSyDDTBNcxR7CTgKEdgPYMsMIPwMHuZHjtiw",
    authDomain: "loyalties-c545a.firebaseapp.com",
    databaseURL: "https://loyalties-c545a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "loyalties-c545a",
    storageBucket: "loyalties-c545a.appspot.com",
    messagingSenderId: "414687032159",
    appId: "1:414687032159:web:7b8cf8fc062d1251eafcea",
    measurementId: "G-BBN6F96306"
};
let defaultApp;
try {
    defaultApp = firebase.initializeApp(firebaseConfig);
    initializeAuth(defaultApp, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (e) {

}


function Test() {
    return (
        <SafeAreaView>
            <Counter
                max={10}
                min={0}
                arrow={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: 50,
                    margin: 10
                }}
                add={{
                    color: "green"
                }}
                remove={{
                    color: "red"
                }}
                counter={{
                    fontWeight: "bold",
                    color: "blue",
                    fontSize: 100,

                }
                }/>
        </SafeAreaView>
    );
}

const Stack = createNativeStackNavigator();

let fonts = {
    "Pacifico_400Regular": Pacifico_400Regular,

}

export default class App extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            loaded: false,
        }
        global.organisations = {}

    }

    componentDidMount() {
        Font.loadAsync(fonts).then(r => this.setState({loaded: true}))

        firebase.database().ref("organisations").once("value", (snapshot) => {
            snapshot.forEach(org => {

                global.organisations[org.val().uid] = new Organisation(org.val())
            })
        })
    }

    render() {
        if (!this.state.loaded) {
            return <AppLoading/>;
        }


        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName='login'
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <Stack.Screen name="login" component={LoginScreen}/>
                    <Stack.Screen name="register" component={Register}/>
                    <Stack.Screen name="home" component={Home}/>
                    <Stack.Screen name="Settings" component={Settings}/>
                    <Stack.Screen name="OrgSelect" component={OrgSelect}/>
                    <Stack.Screen name="OrgHome" component={OrgHome}/>
                    <Stack.Screen name="OrgRegister" component={OrgRegister}/>

                    <Stack.Screen name="test" component={Test}/>

                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
