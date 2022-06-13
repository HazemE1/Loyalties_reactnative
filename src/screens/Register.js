import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import {getColorScheme, styling} from "../assets/components/schematics"

import User from "../assets/enteties/User";

import * as ImagePicker from 'expo-image-picker';
import {AntDesign} from '@expo/vector-icons';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";


export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            mail: "",
            err: "",
            photoUrl: "",
            creating: false,
            creatingMessage: "Skapar ditt konto kan ta någon minut...",
            User: null,
            gender: "Man",
            notifications: true,
        };
    }

    genderSelector = (gender) => {
        this.setState({gender: gender});
    }
    settingsConfirm = async () => {
        await Alert.alert('Notiser', 'Vi behöver ha ditt tilllåtelse för att skkicka notiser. ' +
            '\n vi använder notiser för att hålla dig uppdaterad om dina favorit resturanger. \n Tack :) !', [
            {
                text: 'Nej tack!',
                onPress: () => this.setState({notifications: false}),
                style: 'cancel',
            },
            {text: 'Ge tillåtelse', onPress: () => this.setState({notifications: true})},
        ]);


        if (this.state.notifications){

        }

    }

    getCurrentGender = () => {
        return this.state.gender
    }

    pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            this.setState({photoUrl: result.uri});
        } else {
            this.setState({err: "Du måste välja profilbild"})
        }
    };

    uploadImageAsync = async () => {
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
            xhr.open('GET', this.state.photoUrl, true); // fetch the blob from uri in async mode
            xhr.send(null); // no initial data
        });
        const ref = firebase
            .storage()
            .ref()
            .child("profile_pictures")
            .child(firebase.auth().currentUser.uid);
        const snapshot = await ref.put(blob);
        const remoteUri = snapshot.ref.getDownloadURL();

        this.setState({photoUrl: remoteUri})
        blob.close();

        return remoteUri;
    }


    render() {
        if (this.state.creating)
            return (<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color="#0000ff"/>

                <Text>{"\n"}{this.state.creatingMessage}</Text>
            </View>)
        else
            return (<View style={{...styling.wrapper}}>
                <SafeAreaView/>
                <View style={styling.container}>
                    <Text style={{...styling.subtitle, fontWeight: "bold"}}>Skapa konto</Text>
                    <Text style={{...styling.text, fontStyle: "italic",}}>Mata in din information
                        tack!</Text>
                    <Text style={{
                        color: "red",
                        fontSize: 15,
                        fontWeight: "bold",
                        textAlign: "center"
                    }}>{this.state.err}</Text>

                    <View style={{flex: 1, alignItems: 'center', justifyContent: "center", borderTopLeftRadius: 350}}>
                        <TouchableWithoutFeedback onPress={() => this.pickImage()} style={{flex: 1}}>
                            {this.state.photoUrl === "" ?
                                <View style={{flex: 1, alignItems: "center", margin: 40, overflow: "none"}}>
                                    <AntDesign name="user" size={70} style={{
                                        borderColor: getColorScheme().text_color,
                                        borderWidth: 2,
                                        borderRadius: 10,
                                        padding: 10
                                    }} color={getColorScheme().text_color}/>
                                    <Text style={{
                                        ...styling.text,
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}>Välj
                                        profilbild</Text>
                                </View>
                                :
                                <View style={{flex: 1, alignItems: "center", margin: 40, overflow: "none"}}>
                                    <Image source={{uri: this.state.photoUrl}} style={{
                                        backgroundColor: getColorScheme().first_color,
                                        width: 90,
                                        height: 90,
                                        borderRadius: 10,
                                        padding: 20,
                                        resizeMode: "stretch",
                                    }}/>
                                    <Text style={{
                                        ...styling.text,
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}>Välj
                                        profilbild</Text>
                                </View>
                            }
                        </TouchableWithoutFeedback>
                    </View>
                    <View keyboardVerticalOffset={0} behavior={"padding"} style={{flex: 1, margin: 5}}>

                        <Text style={{...styling.text, fontSize: 25}}>För-/Efternamn</Text>
                        <View style={{
                            marginVertical: 5,
                            justifyContent: "center",
                            alignItems: "center", ...styling.shadow,
                        }}>
                            <TextInput onChangeText={(t) => {
                                this.setState({name: t});
                            }} value={this.state.name} placeholder='För/Efternamn'
                                       style={{...styling.text, fontSize: 25}}/>
                        </View>
                        <Text style={{...styling.text, fontSize: 25}}>Mail</Text>
                        <View style={{
                            marginVertical: 5,
                            justifyContent: "center",
                            alignItems: "center", ...styling.shadow,
                        }}>
                            <TextInput onChangeText={(t) => {
                                this.setState({mail: t});
                            }} value={this.state.mail} keyboardType={"email-address"} placeholder='Din-mail@adress.se'
                                       style={{...styling.text, fontSize: 25}}/>
                        </View>

                        <Text style={{...styling.text, fontSize: 25}}>Kön</Text>
                        <View style={{
                            marginVertical: 5,
                            ...styling.shadow,
                            flexDirection: "row",
                        }}>
                            <TouchableHighlight onPress={() => this.genderSelector("Man")} style={{
                                padding: 10,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.33)",
                                margin: 5,
                                backgroundColor: this.getCurrentGender() === "Man" ? "rgba(69,187,91,0.47)" : "rgba(0,0,0,0)"
                            }}>
                                <Text style={{...styling.text}}>MAN</Text>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => this.genderSelector("Kvinna")} style={{
                                padding: 10,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.33)",
                                margin: 5,
                                backgroundColor: this.getCurrentGender() === "Kvinna" ? "rgba(69,187,91,0.47)" : "rgba(0,0,0,0)"
                            }}>
                                <Text style={{...styling.text}}>Kvinna</Text>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => this.genderSelector("Annat")} style={{
                                padding: 10,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.33)",
                                margin: 5,
                                backgroundColor: this.getCurrentGender() === "Annat" ? "rgba(69,187,91,0.47)" : "rgba(0,0,0,0)"
                            }}>
                                <Text style={{...styling.text}}>Annat</Text>
                            </TouchableHighlight>
                        </View>

                        <Text style={{...styling.text, fontSize: 25}}>Telefonnummer</Text>
                        <View style={{
                            marginVertical: 5,
                            ...styling.shadow,
                        }}>
                            <Text style={[styling.text, {
                                textAlign: "left",
                                color: "grey"
                            }]}>{firebase.auth().currentUser.phoneNumber}</Text>

                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: "column-reverse", alignItems: "center", ...styling.shadow}}>
                        <TouchableHighlight underlayColor={getColorScheme().secondary_color}
                                            onPress={() => this.createUser()} style={{
                            ...styling.shadow,
                            margin: 20,
                            borderRadius: 10,
                        }}>

                            <Text style={{
                                ...styling.text, ...styling.shadow, textAlign: "center", width: 200, padding: 20
                            }}>REGISTRERA</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>);
    }

    async createUser() {
        if (this.state.name === "") {
            this.setState({err: "Välj ett namn"});
            return;
        }
        if (this.state.mail === "" || !this.state.mail.includes("@") || !this.state.mail.includes(".") || this.state.mail.length < 5) {
            this.setState({err: "Ogiltligt mail"});
            return;
        }
        if (this.state.photoUrl === "") {
            this.setState({err: "Välj en profilbild"});
            return;
        }
        if (this.state.gender === "") {
            this.setState({err: "Välj en kön!"});
            return;
        }

        this.setState({creating: true})
        setTimeout(() => {
        }, 500)
        this.setState({creatingMessage: "Skapar din profil..."})
        await this.settingsConfirm();
        this.setState({creating: true})
        await firebase.auth().currentUser.updateEmail(this.state.mail);
        await firebase.auth().currentUser.updateProfile({
            displayName: this.state.name,
            photoURL: this.state.photoUrl
        });
        await firebase.auth().currentUser.updateEmail(this.state.mail);

        await firebase.database()
            .ref("users")
            .child(firebase.auth().currentUser.uid)
            .child("settings")
            .child("gender")
            .set(this.state.gender)
        await firebase.database()
            .ref("users")
            .child(firebase.auth().currentUser.uid)
            .child("settings")
            .child("notifications")
            .set(this.state.notifications)
        this.setState({creatingMessage: "Laddar upp profilbild..."})
        await this.uploadImageAsync();
        global.user = new User(firebase.auth().currentUser, true)
        this.setState({creatingMessage: "Perfekt! Nu ska vi logga in!"})
        setTimeout(() => {
            this.props.navigation.navigate("home")
        }, 500)
    }
}
