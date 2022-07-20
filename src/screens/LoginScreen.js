import React, {Component} from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import {getLogo, styling} from "../assets/components/schematics"
import {Video} from 'expo-av';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import KeycodeInput from '../assets/components/KeyCodeInput';

import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import {onAuthStateChanged} from "firebase/auth";
import User from "../assets/enteties/User";

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationID: "",
            isVerifying: false,
            code: "",
            errMsg: "",
            number: "+46733239685"


        }

        this.verifyNumber.bind(this);
        this.signInUser.bind(this);
        this.registerUser.bind(this);
        this.isValidPNr.bind(this);
        onAuthStateChanged(firebase.auth(), async (user) => {
                if (!user) {
                    return;
                }
                const isNew = user.displayName === "" || user.displayName === null;
                if (!isNew)
                    await this.signInUser();


            }
        )

    }


    isValidPNr(cNumber) {
        return (cNumber.length == 10 && cNumber.startsWith("07")) || (cNumber.length == 12 && cNumber.startsWith("+46"))
    }

    componentDidMount() {

    }

    async signInUser() {
        const ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid);

        await ref.once("value", (d) => {
            new User(d.val());
        })

        this.props.navigation.navigate("home")

    }


    registerUser() {
        this.props.navigation.navigate("register")
    }

    async verifyNumber() {
        var number = this.state.number;
        if (!this.isValidPNr(number)) {
            this.setState({errMsg: "Ogiltligt telefonnummer"})
            return
        }
        Keyboard.dismiss()

        if (number.startsWith("0"))
            number = "+46" + number.substring(1);

        this.setState({number: number})
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
            number,
            this.recaptchaVerifier
        ).catch((e) => {
            var message = e.message;
            if (message.includes("too-many-requests"))
                message = "För många försök, \n försök igen senare"
            else if (message.includes("invalid-phone-number")) {
                message = "Ogiltligt telefonnummer"
            } else
                message = "Du måste avsluta alla steg."
            console.log(e);
            this.setState({errMsg: message})
        })
        this.setState({verificationId: verificationId, isVerifying: true})
    }


    render() {

        const isAndroid = Platform.OS !== "ios"
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{...styling.wrapper, backgroundColor: "rgba(0,0,0,1)", flex: 1}}>
                    <FirebaseRecaptchaVerifierModal ref={(r) => this.recaptchaVerifier = r}
                                                    attemptInvisibleVerification={true}
                                                    firebaseConfig={global.firebaseConfig}/>
                    <SafeAreaView/>
                    <Video shouldPlay={true} isLooping={true} isMuted={true} should resizeMode={"stretch"}
                           source={require("../assets/videos/login_bg.mp4")}
                           style={{position: "absolute", width: "100%", height: "100%", opacity: 0.8}}/>
                    <View style={{...styling.container, backgroundColor: "rgba(0,0,0,0)", flexDirection: "row"}}>
                        <View style={{flex: 1,}}>
                            {getLogo({
                                margin: 10,
                                height: 80,
                                width: 80,
                            })}
                        </View>
                        <View style={{flex: 3}}>
                            <Text style={{
                                ...styling.title,
                                color: "white",
                                fontFamily: "Pacifico_400Regular",
                                marginTop: 11,
                                marginLeft: 8
                            }}>LOYALTIES</Text>
                        </View>
                    </View>

                    < View style={{flex: 2}}>
                        <Text style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: 20,
                            textAlign: "center"
                        }}>{this.state.errMsg}</Text>
                        <Text style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 40,
                            textAlign: "center",
                            marginBottom: 30
                        }}>{this.state.isVerifying ? "Verifikations Kod" : "Logga in"}</Text>
                        {!this.state.isVerifying ?
                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                                  style={{flex: 2, alignItems: "center", flexDirection: 'column'}}>
                                <Text style={{color: "white", fontWeight: "bold", fontSize: 20, textAlign: "center"}}>Fortsätt
                                    med telefonnummer</Text>

                                <View style={{flexDirection: 'row'}}>
                                    <FontAwesome name="mobile-phone" size={60} color="white" style={{marginRight: 10}}/>
                                    <TextInput onChangeText={(t) => {
                                        if (this.isValidPNr(t)) {
                                            this.setState({errMsg: "", number: t}, () => {
                                                this.verifyNumber()
                                            })
                                        } else {
                                            this.setState({errMsg: "Ogiltligt telefonnummer..."})
                                        }
                                    }} keyboardType='phone-pad' maxLength={12} placeholder='0700000000'
                                               placeholderTextColor={"rgb(240,240,240)"}
                                               style={{fontSize: 28, color: "white", maxWidth: 250, height: 60}}/>
                                </View>
                                <Text style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    textAlign: "center"
                                }}>ELLER {"\n"}</Text>
                                <View style={{
                                    backgroundColor: "white",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 10,
                                    borderRadius: 100,
                                    flexDirection: "row"
                                }}>

                                    {isAndroid == true ?
                                        <Image source={require("../assets/images/logo_g.png")}
                                               style={{height: 30, width: 30}}/>
                                        :
                                        <AntDesign style={{
                                            textAlign: "center",
                                            fontSize: 30,
                                            color: "black",
                                            fontWeight: "bold"
                                        }} name="apple1" size={30} color="black"/>
                                    }
                                    <Text style={{
                                        color: "black",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}> Fortsätt med {isAndroid ? "Google" : "Apple"}</Text>

                                </View>
                            </KeyboardAvoidingView>
                            :
                            <KeyboardAvoidingView style={{flex: 1, alignItems: "center"}}>
                                <KeycodeInput
                                    numeric
                                    length={6}
                                    value={this.state.code}
                                    onChange={value => this.setState({code: value})}
                                    onComplete={async (c) => {
                                        const credential = firebase.auth.PhoneAuthProvider.credential(this.state.verificationId, c);

                                        await firebase.auth().signInWithCredential(credential)
                                            .then(auth => {
                                                this.setState({errMsg: ""})
                                                const isNew = auth.user.displayName === "" || auth.user.displayName === null;

                                                if (isNew)
                                                    this.registerUser()
                                                else
                                                    this.signInUser()
                                            })
                                            .catch(e => {
                                                this.setState({errMsg: "Angivet kod stämmer inte!"})
                                            });
                                    }}
                                    barStyle={{
                                        height: 3,
                                        width: 24,
                                    }}
                                    textStyle={{
                                        fontSize: 28,
                                        marginLeft: -2,
                                        width: 20,
                                        color: "white",
                                    }}
                                    inputStyle={{
                                        width: 1,
                                        height: 1,
                                        position: 'absolute'
                                    }}
                                />
                                <TouchableWithoutFeedback onPress={async () => {
                                    await signInWithPhoneNumber(firebase.auth, number, recaptchaVerifier.current).then((code) => {
                                        this.setState({verificationCode: code});
                                    })
                                }}>
                                    <Text style={{fontSize: 20, color: "white", marginTop: 20}}>Fick du inte en
                                        kod? <Text style={{
                                            textDecorationLine: "underline",
                                            fontWeight: "bold",
                                            color: "green"
                                        }}>klicka här</Text></Text>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback style={{backgroundColor: "black"}} onPress={() => {
                                    this.setState({errMsg: ""});
                                    this.setState({isVerifying: false});
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        backgroundColor: "rgba(0,0,0,0.4)",
                                        padding: 5,
                                        borderRadius: 10,
                                        marginTop: 5,
                                        color: "red"
                                    }}>AVBRYT</Text>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView>
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
