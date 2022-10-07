import React, {Component} from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {getColorScheme, styling} from "../../assets/components/schematics"
import {AntDesign} from '@expo/vector-icons';

export default class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: global.user,
            selectedRank: "silver",
        };

        this.selectRank.bind(this)
    }


    ranks = [
        {
            name: "Silver",
            price: "599:- / Månad",
            image: require("../../assets/images/silver-level.png"),
            description: "Ut dapibus est at arcu aliquet, vel vulputate ligula pretium. Suspendisse vel bibendum erat. Duis nec risus ac metus congue laoreet pretium ac felis. Donec sem tortor, interdum a nibh ac, consectetur porta tellus. Nulla sed nisl felis. Etiam nec odio posuere, elementum sapien non, blandit arcu. Sed a tortor sit amet est volutpat maximus. Morbi egestas nulla faucibus ante suscipit, vitae facilisis tortor aliquam. Donec magna lacus, euismod in est quis, blandit faucibus risus.",
            color: "rgb(192,192,192)",
            for: "FÖR NYA BOLAG!"
        },
        {
            name: "Gold",
            price: "799:- / Månad",
            image: require("../../assets/images/gold-level.png"),
            description: "Ut dapibus est at arcu aliquet, vel vulputate ligula pretium. Suspendisse vel bibendum erat. Duis nec risus ac metus congue laoreet pretium ac felis. Donec sem tortor, interdum a nibh ac, consectetur porta tellus. Nulla sed nisl felis. Etiam nec odio posuere, elementum sapien non, blandit arcu. Sed a tortor sit amet est volutpat maximus. Morbi egestas nulla faucibus ante suscipit, vitae facilisis tortor aliquam. Donec magna lacus, euismod in est quis, blandit faucibus risus.",
            color: "rgb(212,175,55)",
            for: "FÖR BOLAG MED MER KUNDER!"

        },
        {
            name: "Diamond",
            price: "999:- / Månad",
            image: require("../../assets/images/plat-level.png"),
            description: "Ut dapibus est at arcu aliquet, vel vulputate ligula pretium. Suspendisse vel bibendum erat. Duis nec risus ac metus congue laoreet pretium ac felis. Donec sem tortor, interdum a nibh ac, consectetur porta tellus. Nulla sed nisl felis. Etiam nec odio posuere, elementum sapien non, blandit arcu. Sed a tortor sit amet est volutpat maximus. Morbi egestas nulla faucibus ante suscipit, vitae facilisis tortor aliquam. Donec magna lacus, euismod in est quis, blandit faucibus risus.",
            color: "rgb(69,218,255)",
            for: "FÖR BOLAG MED SUPER NÖJDA KUNDER!"

        }
    ]


    async createOrg(){
         //TODO Se till att de bekräftar att de väljer silver om de väljer silver

        this.props["navigation"].navigate("OrgRegister", {grade: this.state.selectedRank})
    }
    getRank(rank) {
        switch (rank.toString().toLowerCase()) {
            case "silver":
                return this.ranks[0]
            case "gold":
                return this.ranks[1]
            case "diamond":
                return this.ranks[2]

        }
    }

    selectRank(rank) {
        this.setState({
            selectedRank: rank.toString().toLowerCase()
        })

        switch (rank.toString().toLowerCase()) {
            case "silver":
                this.list.scrollToIndex({index: 0})
                break;
            case "gold":
                this.list.scrollToIndex({index: 1})
                break;
            case "diamond":
                this.list.scrollToIndex({index: 2})
                break;
        }
    }

    cardView(rank) {
        return (
            <TouchableWithoutFeedback onPress={() => this.selectRank(rank.name)}>
                <View style={{marginHorizontal: 50, marginTop: 20,}}>
                    <Text numberOfLines={2} adjustsFontSizeToFit={true}
                          style={{textAlign: "center", fontWeight: "bold", color: rank.color}}><AntDesign
                        name="exclamationcircle"/> {rank.for} {"\n"}</Text>
                    <ImageBackground source={rank.image} style={[style.card_container, {
                        borderRadius: 25,
                        borderWidth: 5,
                        borderColor: this.state.selectedRank === rank.name.toLowerCase() ? rank.color : getColorScheme().bg_color
                    }]}>

                        <View>
                            <Text numberOfLines={15} adjustsFontSizeToFit={true} style={style.card_desecription}>
                                {rank.description}
                            </Text>
                        </View>


                        <View style={style.card_footer}>
                            <Text
                                style={[style.card_title, {color: rank.color}]}>{rank.name.toString().toUpperCase()}</Text>
                            <Text style={style.card_text}>{rank.price}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        )

    }

    render() {
        return (
            <SafeAreaView style={[styling.wrapper]}>
                <Text
                    style={{fontFamily: "Pacifico_400Regular", textAlign: "center", fontSize: 30, color: "white"}}>NY
                    ORGANISATION</Text>
                <Text style={{fontSize: 14, color: "white", textAlign: "center"}}>Välj vilken nivå du vill ha på
                    organisationen</Text>

                <View>
                    <FlatList
                        ref={r => this.list = r}
                        showsHorizontalScrollIndicator={false}
                        snapToAlignment="start"
                        decelerationRate={"fast"}
                        snapToInterval={Dimensions.get("window").width + 30} horizontal={true}
                        keyExtractor={item => item.name} data={this.ranks}
                        renderItem={item => this.cardView(item.item)}
                    />

                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <TouchableWithoutFeedback onPress={() => this.selectRank("silver")}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "rgb(192,192,192)"
                            }}>SILVER{this.state.selectedRank === "silver" && "\n ^"}  </Text>
                        </TouchableWithoutFeedback>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 20, color: "white"
                        }}> | </Text>
                        <TouchableWithoutFeedback onPress={() => this.selectRank("gold")}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "rgb(212,175,55)"
                            }}>GOLD {this.state.selectedRank === "gold" && "\n ^"}</Text>
                        </TouchableWithoutFeedback>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 20, color: "white"
                        }}> | </Text>
                        <TouchableWithoutFeedback onPress={() => this.selectRank("diamond")}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "rgb(69,218,255)"
                            }}>DIAMOND {this.state.selectedRank === "diamond" && "\n ^"}</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.createOrg()}>
                        <Text style={{color: this.getRank(this.state.selectedRank).color, fontWeight: "bold",fontSize: 25, textAlign: "right", margin: 25}}>Jag väljer {this.state.selectedRank}</Text>
                    </TouchableWithoutFeedback>
                </View>


            </SafeAreaView>
        );
    }


}
const style = StyleSheet.create({
    card_container: {
        height: 500,
        width: 300,

        padding: 10,
        resizeMode: "cover",
        borderRadius: 10,
        ...styling.shadow,
        overflow: "hidden"

    },
    card_title: {
        color: "rgb(178,255,98)",

        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold",
        fontFamily: "Pacifico_400Regular"
    },
    card_text: {
        color: "rgb(0,255,169)",

        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
    },
    card_desecription: {
        color: "rgb(0,255,169)",
        fontWeight: "bold",


    },
    card_footer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    carusel: {
        position: "absolute",
        bottom: "25%",
        zIndex: 10,
        width: 50,
        height: 10,
        backgroundColor: "rgb(255,255,255)",
        borderRadius: 50,
    }
})