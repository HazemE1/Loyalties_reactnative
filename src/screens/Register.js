import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
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
            gender: "man",
            notifications: true,
            photoUrl: "",

            creating: false,
            creatingMessage: "Skapar ditt konto kan ta någon minut...",
            User: null,
            screen: "1",
            err: "",
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


        if (this.state.notifications) {
            /*
            *  TODO FRÅGA OM NOTIFIKATION TILLÅTELSE
            */
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
        const remoteUri = await snapshot.ref.getDownloadURL();
        console.log(remoteUri)
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

        return (<SafeAreaView style={{...styling.wrapper}}>

            <View style={styling.container}>
                <Text style={{...styling.subtitle, fontWeight: "bold"}}>NYTT KONTO</Text>
                <Text style={{...styling.text, fontStyle: "italic",}}>Mata in din information
                    tack!</Text>
                <Text style={{
                    color: "red",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginTop: 5
                }}> {this.state.err.toUpperCase()}</Text>

                {this.state.screen === "1" &&
                    <View>
                        <Text style={{
                            ...styling.text,
                            ...styles.SubItalicText,
                            margin: 10,
                            fontSize: 30,
                        }}>Fullständigt namn</Text>
                        <TextInput value={this.state.name} style={{
                            ...styling.text,
                            ...styles.SubItalicText,
                            margin: 5,
                            color: "grey"
                        }} onChangeText={(t) => this.setState({name: t})} placeholder={"FÖR-/Efternamn"}/>

                        <View>
                            <TouchableWithoutFeedback onPressIn={() => {
                                if (this.state.name.length >= 1)
                                    this.setState({screen: "2", err: ""})
                                else
                                    this.setState({err: "Viktigt att ange ett namn"})
                            }}>
                                <Text style={{
                                    ...styling.text,
                                    fontStyle: "italic",
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    color: "green",
                                    margin: 5

                                }}>Fortsätt</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                }
                {this.state.screen === "2" &&
                    <View>
                        <Text style={{
                            ...styling.text,

                            ...styles.SubItalicText,
                            margin: 10,
                            fontSize: 30,
                        }}> Din mailadress</Text>
                        <TextInput value={this.state.mail} style={{
                            ...styling.text,
                            ...styles.SubItalicText,
                            margin: 5,
                            color: "grey"
                        }} onChangeText={(t) => this.setState({mail: t})} placeholder={"mail@mail.se"}/>

                        <View style={{display: "flex", flexDirection: "row-reverse"}}>
                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    if (this.state.mail === "" || !this.state.mail.includes("@") || !this.state.mail.includes(".") || this.state.mail.length < 5)
                                        this.setState({err: "Viktigt att ange en mail"})
                                    else
                                        this.setState({screen: "3", err: ""})

                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        color: "green",
                                        margin: 5

                                    }}>Fortsätt</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "1", err: ""})
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                        color: "red",
                                        margin: 5

                                    }}>Backa</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                }
                {this.state.screen === "3" &&
                    <View>
                        <Text style={{
                            ...styling.text,
                            ...styles.SubItalicText,
                            margin: 10,
                            fontSize: 30,
                        }}>DIN KÖN</Text>
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <TouchableWithoutFeedback onPress={() => this.genderSelector("man")}>
                                <View style={{
                                    ...styles.GenderSelector,
                                    backgroundColor: this.state.gender === "man" ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0)"
                                }}>
                                    <Text style={styles.GenderSelectorText}>MAN</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.genderSelector("kvinna")}>
                                <View style={{
                                    ...styles.GenderSelector,
                                    backgroundColor: this.state.gender === "kvinna" ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0)"
                                }}>
                                    <Text style={styles.GenderSelectorText}>KVINNA</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.genderSelector("annat")}>
                                <View style={{
                                    ...styles.GenderSelector,
                                    backgroundColor: this.state.gender === "annat" ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0)"
                                }}>
                                    <Text style={styles.GenderSelectorText}>ANNAT</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{display: "flex", flexDirection: "row-reverse"}}>
                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "4", err: ""})
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        color: "green",
                                        margin: 5

                                    }}>Fortsätt</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "2", err: ""})
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                        color: "red",
                                        margin: 5

                                    }}>Backa</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                }
                {this.state.screen === "4" &&
                    <View style={{height: "50%"}}>
                        <Text style={{
                            ...styling.text,

                            ...styles.SubItalicText,
                            margin: 10,
                            fontSize: 30,
                        }}> Välj profilbild</Text>
                        <TouchableWithoutFeedback onPress={() => this.pickImage()}
                                                  style={{flex: 1,}}>
                            {this.state.photoUrl === "" ?
                                <View style={{flex: 1, alignItems: "center", margin: 40, overflow: "none"}}>
                                    <AntDesign name="user" size={200} style={{
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
                                        width: 200,
                                        height: 200,
                                        borderRadius: 10,
                                        padding: 20,
                                        resizeMode: "stretch",
                                    }}/>
                                    <Text style={{
                                        ...styling.text,
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}>Välj profilbild</Text>
                                </View>
                            }
                        </TouchableWithoutFeedback>
                        <View style={{display: "flex", flexDirection: "row-reverse"}}>
                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    if (this.state.photoUrl === "") {
                                        this.setState({err: "Du måste välja en profilbild."})
                                    } else {
                                        this.setState({screen: "5", err: ""})

                                    }
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        color: "green",
                                        margin: 5

                                    }}>Bekräfta konto</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "3", err: ""})
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                        color: "red",
                                        margin: 5

                                    }}>Backa</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                }

                {this.state.screen === "5" &&
                    <View>
                        <Text style={{
                            ...styling.text,
                            ...styles.SubItalicText,
                            margin: 10,
                            fontSize: 30,
                        }}> BEKRÄFTA</Text>

                        {Object.keys(this.state).map((t) => {
                            if (t === "screen" || t === "err" || t === "creating" || t === "creatingMessage" || t === "uid" || t === "owner")
                                return

                            let variable = "";
                            if (t === "name")
                                variable = "Namn"
                            else if (t === "mail")
                                variable = "Mail"
                            else if (t === "number")
                                variable = "Nummer"
                            else if (t === "description")
                                variable = "Beskrivning"
                            else if (t === "photoUrl")
                                variable = "Profilbild"
                            else if (t === "grade")
                                variable = "Prenumeration"
                            else if (t === "gender")
                                variable = "Kön"
                            if (t === "photoUrl")
                                return <View key={t} style={{margin: 5}}>
                                    <Text style={{
                                        color: getColorScheme().text_color,
                                        fontWeight: "bold",
                                        fontSize: 20,
                                    }}>{variable}</Text>
                                    <Image source={{uri: this.state.photoUrl}} style={{
                                        backgroundColor: getColorScheme().first_color,
                                        width: 200,
                                        height: 200,
                                        borderRadius: 10,
                                        padding: 20,
                                        resizeMode: "stretch",
                                    }}/>
                                </View>

                            return <View key={t} style={{margin: 5}}>
                                <Text style={{
                                    color: getColorScheme().text_color,
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    textAlign: "center"
                                }}>{variable.toUpperCase()}</Text>
                                <Text style={{
                                    color: getColorScheme().text_color,

                                    fontSize: 20,
                                    textAlign: "center"
                                }}>{this.state[t]}</Text>

                            </View>

                        })}

                        <View style={{display: "flex", flexDirection: "row-reverse"}}>
                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.createUser()
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        color: "green",
                                        margin: 5

                                    }}>Skapa konto</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "4"})
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                        color: "red",
                                        margin: 5

                                    }}>Backa</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                }


            </View>
        </SafeAreaView>);
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
        this.setState({creatingMessage: "Laddar upp profilbild..."})
        await this.uploadImageAsync().catch(e => {
            console.log(e)
        });
        this.setState({creatingMessage: "Skapar din profil..."})
        //await this.settingsConfirm();
        await firebase.auth().currentUser.updateEmail(this.state.mail);
        await firebase.auth().currentUser.updateProfile({
            displayName: this.state.name,
            photoURL: this.state.photoUrl
        });
        await firebase.auth().currentUser.updateEmail(this.state.mail);

        await firebase.database()
            .ref("users")
            .child(firebase.auth().currentUser.uid)
            .child("gender")
            .set(this.state.gender)
        await firebase.database()
            .ref("users")
            .child(firebase.auth().currentUser.uid)
            .child("notifications")
            .set(this.state.notifications)
        await firebase.database()
            .ref("users")
            .child(firebase.auth().currentUser.uid)
            .child("profile")
            .set({
                displayName: this.state.name,
                photoURL: this.state.photoUrl
            })
        await firebase.database()
            .ref("users")
            .child(firebase.auth().currentUser.uid)
            .child("stats")
            .set({
                stamps:0,
                done:0
            })

        new User({
            stats: {
                stamps: 0,
                done: 0
            },
            stamps: {},
            workPlaces: [],
            notifications: this.state.notifications,
            gender: this.state.gender,
        })
        this.setState({creatingMessage: "Perfekt! Nu ska vi logga in!"})
        setTimeout(() => {
            this.props["navigation"].navigate("home")
        }, 500)
    }
}
const styles = StyleSheet.create({
    GenderSelector: {
        margin: 2,
        padding: 10,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
    },
    GenderSelectorText: {
        fontWeight: "bold",
        fontSize: 20,
        color: getColorScheme().text_color,
        textAlign: "center"
    },
    SubItalicText: {
        fontStyle: "italic",
        textAlign: "center",
        fontWeight: "bold",
    }
})