import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import {genUUID, getColorScheme, getLogo, styling} from "../../assets/components/schematics"

import PPComponent from '../../assets/components/ppcomponent';
import {Ionicons} from '@expo/vector-icons';


import {BarCodeScanner} from 'expo-barcode-scanner';
import {BlurView} from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import Update from "../../assets/model/Update";

export default class OrgHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showQr: false,
            showAddNew: false,
            addNew: {
                title: "",
                photoUrl: "asd",
                desc: "",
                err: "",
                uuid: "asd"
            },
            showLoading: {
                show: false,
                message: "dasfasfasfasfasfs"
            }
        };
        this.organisation = global.organisations[global.user.selectedUser]
        this.user = global.user;

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


    async createNew() {
        if (this.state.addNew.desc === "" || !this.state.addNew.photoUrl.includes("/") || this.state.addNew.title === "") {
            this.setState({
                err: "Du måste mata in all information"
            })
            return
        }

        const isEditing = this.state.addNew.uuid !== "asd";
        this.setState({
            showAddNew: false,
            showLoading: {
                show: true,
                message: !isEditing ? "Skapar din nyhet!" : "Redigerar din nyhet!"
            }
        })
        await this.organisation.removeANew(this.state.addNew.uuid)

        const id = !isEditing ? genUUID() : this.state.addNew.uuid
        const photo = await this.organisation.uploadImageAsync("org_updates/" + id, this.state.addNew.photoUrl)
        await this.organisation.createANew(this.state.addNew.title, this.state.addNew.desc, photo, id)
            .catch(e => {
                console.log(e)
            })
            .then(() => {
                this.setState({
                    showLoading: {
                        show: false,
                        message: ""
                    },
                    addNew: {
                        title: "",
                        photoUrl: "asd",
                        desc: "",
                        err: "",
                        uuid: "asd"
                    },
                });
                alert("Du har skapat en nyhet!")
            })

    }

    async removeNew(uuid) {

        await Alert.alert("Bekräfta bortagning", "Du håller på att tabort " + this.organisation.getUpdate(uuid).title, [
            {
                text: "Avbryt",
                style: "cancel",
            },
            {
                text: 'Bekräfta',
                onPress: async () => {
                    this.setState({
                        showLoading: {
                            show: true,
                            message: "Tar bort nyhet..."
                        }
                    })
                    await this.organisation.removeANew(uuid).then(() => {
                        this.setState({
                            showLoading: {
                                show: false,
                                message: "Nyheten bortagen!"
                            }
                        })
                    }).catch(e => console.log(e))
                }
            }

        ])

    }

    async editNew(uuid) {
        const update = this.organisation.getUpdate(uuid)

        this.setState({
            addNew: {
                title: update.title,
                photoUrl: update.photoUrl,
                desc: update.desc,
                err: "",
                uuid: update.uuid
            },
            showAddNew: true
        })
    }

    toggleQR() {
        this.setState({showQr: !this.state.showQr})
    }

    async scanQR(data) {
        return true
    }

    pickImage = async () => {
        Keyboard.dismiss()
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
            this.setState({err: "Du måste välja profilbild"})
        }
    };

    render() {


        if (this.state.showLoading.show)
            return <SafeAreaView>
                <View style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator size={"large"} color={"green"}/>
                    <Text style={{color: "black", fontSize: 20, fontWeight: "bold", margin: 5}}>{this.state.addNew.uuid === "asd" ?
                        "Skapar din nyhet"
                        :
                        "Redigerar din nyhet"
                    }</Text>
                </View>
            </SafeAreaView>


        if (this.organisation.owner === global.user.uuid)
            return (
                <SafeAreaView style={styling.wrapper}>
                    {this.state.showAddNew &&
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <BlurView style={[StyleSheet.absoluteFill, {zIndex: 5, justifyContent: "center"}]}>

                                <View style={{
                                    justifySelf: "center",
                                    alignSelf: "center",
                                    backgroundColor: getColorScheme().bg_color,
                                    height: 420,
                                    width: "80%",
                                    borderRadius: 10,
                                    padding: 10
                                }}>

                                    <Text style={[{
                                        textAlign: "center",
                                        color: "red",
                                        fontWeight: "bold"
                                    }]}>{this.state.err}</Text>
                                    <Text adjustsFontSizeToFit={true}
                                          numberOfLines={1} style={[styling.title, {
                                        textAlign: "center",
                                        margin: 5,
                                        marginBottom: 10
                                    }]}>{this.state.addNew.uuid === "asd" ?
                                        "Skapa en nyhet"
                                        :
                                        "Redigera en nyhet"
                                    }</Text>

                                    <TextInput placeholder={"Nyhetens title"}
                                               placeholderTextColor="grey"
                                               value={this.state.addNew.title}
                                               onChangeText={(t) => this.setState({
                                                   addNew: {
                                                       ...this.state.addNew,
                                                       title: t
                                                   }
                                               })}
                                               style={{fontSize: 20, margin: 10, color: "white"}}/>
                                    <TextInput placeholder={"nyhetens beskriving"}
                                               value={this.state.addNew.desc}
                                               placeholderTextColor="grey"
                                               onChangeText={(t) => this.setState({
                                                   addNew: {
                                                       ...this.state.addNew,
                                                       desc: t
                                                   }
                                               })} style={{
                                        fontSize: 20,
                                        margin: 10,
                                        color: "white",
                                        width: "80%",
                                        maxHeight: 80,

                                    }}
                                               multiline={true}
                                    />

                                    <View style={{flexDirection: "row", margin: 10}}>
                                        <TouchableWithoutFeedback onPress={async () => this.setState({
                                            addNew: {
                                                ...this.state.addNew,
                                                photoUrl: await this.pickImage()
                                            }
                                        })}>
                                            <Text style={{fontSize: 20, color: "white", marginRight: 10}}>Lägg till
                                                bild</Text>
                                        </TouchableWithoutFeedback>
                                        <Image source={{uri: this.state.addNew.photoUrl}}
                                               style={{height: 50, width: 50}}/>
                                    </View>

                                    <View style={{
                                        flexDirection: "row",
                                        alignSelf: "flex-end",
                                        justifySelf: "flex-end",
                                        margin: 10,
                                        height: "100%"
                                    }}>
                                        <TouchableWithoutFeedback onPress={() => this.setState({
                                            showAddNew: false,
                                            addNew: {
                                                title: "",
                                                photoUrl: "asd",
                                                desc: "",
                                                err: "",
                                                uuid: "asd"
                                            },
                                        })}>
                                            <Text style={{fontSize: 20, margin: 10, color: "red"}}>Avbryt</Text>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={async () => await this.createNew()}>
                                            <Text style={{
                                                fontSize: 20,
                                                margin: 10,
                                                color: "green"
                                            }}> {this.state.addNew.uuid === "asd" ? "Skapa" : "Redigera"}</Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </BlurView>
                        </TouchableWithoutFeedback>
                    }
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
                                                if (await this.scanQR(v.data)) {
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
                                    <PPComponent navigation={this.props["navigation"]}
                                                 select={this.select}
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
                                    <Text
                                        style={{
                                            ...styling.text,
                                            textAlign: "center"
                                        }}>Statestik</Text>
                                    <Ionicons name="stats-chart"
                                              style={{...styling.text, textAlign: "center"}}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={{...styling.text}}>Medarbetare</Text>
                                    <Ionicons name="people"
                                              style={{...styling.text, textAlign: "center"}}/>
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
                                    }}>NYHETER <Ionicons name="newspaper" size={20}/></Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <ScrollView
                            style={{height: "100%"}}
                            contentContainerStyle={{
                                display: "flex",
                                flexWrap: 1,
                                flexDirection: "row"
                            }}>
                            {Object.values(this.organisation.updates).map(v => {
                                return <Update key={v.uuid}
                                               uuid={v.uuid}
                                               title={v.title}
                                               desc={v.desc}
                                               photoUrl={v.photoUrl}
                                               showEdit={true}
                                               trash={(uuid) => this.removeNew(uuid)}
                                               edit={(uuid) => this.editNew(uuid)}

                                />
                            })
                            }
                        </ScrollView>
                        <View style={{
                            padding: 10,
                            borderColor: "white",
                            borderWidth: 1.5,
                            borderRadius: "50%",
                            width: 70,
                            height: 70,
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "flex-end"
                        }}>
                            <TouchableWithoutFeedback onPress={() => {
                                this.setState({
                                    showAddNew: true
                                })
                            }}>
                                <Text style={{
                                    color: "white",
                                    textAlign: "center"
                                }}>SKAPA NYHET</Text>
                            </TouchableWithoutFeedback>
                        </View>
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

