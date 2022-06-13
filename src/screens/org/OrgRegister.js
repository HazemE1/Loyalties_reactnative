import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';


import * as ImagePicker from 'expo-image-picker';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import {getColorScheme, styling} from "../../assets/components/schematics";
import {AntDesign} from "@expo/vector-icons";
import Organisation from "../../assets/enteties/Organisation";


export default class OrgRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "test",
            mail: "test@test.se",
            number: "123456789101",
            description: "test",
            grade: this.props.route.params.grade,
            photoUrl: "file:///var/mobile/Containers/Data/Application/2EF005B0-3598-47CC-92A6-FAFBE590559A/Library/Caches/ExponentExperienceData/%2540hazemel%252Floyalty/ImagePicker/E4F680A8-6B1A-404F-B51C-F1A5B7F96474.jpg",
            owner: firebase.auth().currentUser.uid,
            uid: String(Math.random() * 50 + Date.now() + Math.random() * 50 + Math.random() * 50).replace(",", "").replace("-", "").replace(".", ""),
            creating: false,
            creatingMessage: "Skapar ditt konto kan ta någon minut...",
            err: "",
            screen: "done",


        };
    }

    componentDidMount() {

    }


    settingsConfirm = async () => {
        await Alert.alert('Notiser', 'Vi behöver ha ditt tilllåtelse för att skkicka notiser. ' +
            '\n vi använder notiser för att hålla dig uppdaterad om din organisation. \n Tack :) !', [
            {
                text: 'Nej tack!',
                onPress: () => this.setState({notifications: false}),
                style: 'cancel',
            },
            {text: 'Ge tillåtelse', onPress: () => this.setState({notifications: true})},
        ]);


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
            .child("org_profilbilder")
            .child(this.state.uid);
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


        return (<SafeAreaView style={{...styling.wrapper}}>

            <View style={styling.container}>
                <Text style={{...styling.subtitle, fontWeight: "bold"}}>Organisations konto</Text>
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

                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 10,
                            fontSize: 30,
                        }}> Organisations namn</Text>
                        <TextInput value={this.state.name} style={{
                            ...styling.text,
                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 5,
                            color: "grey"
                        }} onChangeText={(t) => this.setState({name: t})} placeholder={"ANGE HÄR"}/>

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

                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 10,
                            fontSize: 30,
                        }}> Organisations mail</Text>
                        <TextInput value={this.state.mail} style={{
                            ...styling.text,
                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 5,
                            color: "grey"
                        }} onChangeText={(t) => this.setState({mail: t})} placeholder={"ANGE HÄR"}/>

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

                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 10,
                            fontSize: 20,
                        }}> Organisations telefonnummer</Text>
                        <TextInput value={this.state.telefonnummer} style={{
                            ...styling.text,
                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 5,
                            color: "grey",
                        }} maxLength={12} onChangeText={(t) => this.setState({telefonnummer: t})}
                                   placeholder={"ANGE HÄR"}/>

                        <View style={{display: "flex", flexDirection: "row-reverse"}}>
                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    if (this.state.telefonnummer.length < 10)
                                        this.setState({err: "Viktigt att ange ett giltlig telefonnummer"})
                                    else
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
                    <View>
                        <Text style={{
                            ...styling.text,

                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: 10,
                            fontSize: 30,
                        }}> Beskrivning</Text>
                        <TextInput
                            value={this.state.description}
                            multiline={true}
                            numberOfLines={5}
                            placeholderTextColor={getColorScheme().text_color}
                            maxLength={260}
                            style={{
                                ...styling.text,
                                fontStyle: "italic",
                                fontWeight: "bold",
                                margin: 5,
                                height: 100,
                                maxHeight: 100,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: 10,
                                padding: 5,
                                fontSize: 15
                            }} onChangeText={(t) => this.setState({description: t})} placeholder={"ANGE HÄR"}/>
                        <View style={{display: "flex", flexDirection: "row-reverse"}}>
                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    if (this.state.description.length < 5)
                                        this.setState({err: "Viktigt att ange en beskrivning."})
                                    else
                                        this.setState({screen: "5", err: ""})
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
                    <View style={{height: "50%"}}>
                        <Text style={{
                            ...styling.text,

                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
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
                                    this.setState({screen: "done", err: ""})
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        color: "green",
                                        margin: 5

                                    }}>Skapa organisation</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "4", err: ""})
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

                {this.state.screen === "done" &&
                    <View>
                        <Text style={{
                            ...styling.text,

                            fontStyle: "italic",
                            textAlign: "center",
                            fontWeight: "bold",
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
                            if (t === "photoUrl")
                                return <View key={variable} style={{margin: 5}}>
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

                            return <View key={variable} style={{margin: 5}}>
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
                                    this.createOrg()
                                }}>
                                    <Text style={{
                                        ...styling.text,
                                        fontStyle: "italic",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                        color: "green",
                                        margin: 5

                                    }}>Skapa organisation</Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View>
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.setState({screen: "5"})
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

    async createOrg() {
        if (this.state.name === "" && this.state.name.length < 2) {
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
        await this.uploadImageAsync();
        this.setState({creatingMessage: "Skapar din profil..."})
        await this.settingsConfirm();
        await firebase.database()
            .ref("organisations")
            .child(this.state.uid)
            .set({
                ...this.state,
                creating: null,
                creatingMessage: null,
                err: null,
                screen: null
            })

        this.setState({creatingMessage: "Perfekt! Nu ska vi logga in!"})
        setTimeout(() => {

            global.organisations[this.state.uid] = new Organisation({
                ...this.state,
                stats: {done: 0, stamps: 0},
                updates: {},
                workers: [],
                stampOwners: {},
            })
            let arr = []
            if (global.user.workPlaces !== undefined)
                arr = global.user.workPlaces
            arr.push(this.state.uid)
            global.user.workPlaces = arr;
            global.user.saveUser()
            global.user.selectedUser = this.state.uid
            this.props.navigation.navigate("OrgHome")
        }, 500)
    }
}
