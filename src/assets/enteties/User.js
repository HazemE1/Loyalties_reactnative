import firebase from "firebase/compat/app"
import "firebase/compat/database"
import "firebase/compat/auth"

export default class User {

    constructor() {

        this.stats = {done: 0, stamps: 0}

        this.stamps = {}

        this.workPlaces = []

        this.notifications = true;

        this.selectedUser = "";

        this.uuid = firebase.auth().currentUser.uid
        global.user = this;


    }


    async loadUser(isNew) {
        const ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid);

        if (!isNew) {
            await ref.once("value", (d) => {
                this.notifications = d.val().settings.notifications;
                this.stats = d.val().stats
                this.selectedUser = ""
                this.workPlaces = d.val().workPlaces !== undefined ? d.val().workPlaces : {};
                this.stamps = d.val().stamps !== undefined ? d.val().stamps : {}
                this.gender = d.val().settings.gender
            })
        } else
            await ref.child("stats").set(this.stats)

        this.setUpListeners()
    }

    setUpListeners() {
        const ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid).child("stats");
        ref.on("child_changed", (d) => console.log(d.key))
    }

    async saveUser() {
        const ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid);
        await ref.set({
            stats: this.stats,

            workPlaces: this.workPlaces,
            settings: {
                notifications: this.notifications
            },
        })
    }

    async uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = firebase
            .storage()
            .ref()
            .child(uuid.v4());
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }


}