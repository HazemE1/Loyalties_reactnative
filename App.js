import React from 'react';
import {SafeAreaView, StyleSheet, View, TouchableWithoutFeedback,Text} from 'react-native';
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

import firebase from "firebase/compat/app";
import firebaseConfig from "./src/assets/model/FirebaseConfig"
import {initializeAuth} from "firebase/auth"
import {getReactNativePersistence} from "firebase/auth/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Organisation from "./src/assets/enteties/Organisation";
import Update from "./src/assets/model/Update";
import * as ImagePicker from "expo-image-picker";


let defaultApp;
try {
    defaultApp = firebase.initializeApp(firebaseConfig());
    initializeAuth(defaultApp, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (e) {

}


function Test() {
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            return result.uri;
        } else {
        }
    };

    const uploadImageAsync = async (path, img) => {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed')); // error occurred, rejecting
            };
            xhr.responseType = 'blob'; // use BlobModule's UriHandler
            xhr.open('GET', img, true); // fetch the blob from uri in async mode
            xhr.send(null); // no initial data
        });
        const ref = firebase
            .storage()
            .ref()
            .child(path)
        const snapshot = await ref.put(blob);
        const remoteUri = await snapshot.ref.getDownloadURL();

        blob.close();

        return remoteUri;
    }


    return (
        <SafeAreaView>
            <View >
                <TouchableWithoutFeedback onPress={async () => await uploadImageAsync("asdtest/asd", await pickImage())}>
                    <Text>Press me</Text>
                </TouchableWithoutFeedback>
            </View>
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
                    initialRouteName='OrgSelect'
                    screenOptions={{
                        headerShown: false,
                        gestureEnabled: false

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
