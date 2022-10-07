import firebase from "firebase/compat/app"
import "firebase/compat/database"
import "firebase/compat/auth"

export default class User {

    constructor(props) {

        this.stats = props.stats

        this.stamps = props.stamps !== undefined ? props.stamps : {}

        this.workPlaces = props.workPlaces !== undefined ? props.workPlaces : []

        this.rewards = props.rewards !== undefined ? props.rewards : {}

        this.notifications = true

        this.gender = props.gender

        this.selectedUser = "";

        this.uuid = firebase.auth().currentUser.uid

        this.setUpListeners()
        global.user = this;

    }

    setUpListeners() {
        const ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid).child("stats");
        ref.on("child_changed", (d) => console.log(d.key))

    }

    async saveUser() {
        const ref = firebase.database().ref("users").child(firebase.auth().currentUser.uid);
        await ref.set({
            profile: {
                name: firebase.auth().currentUser.displayName,
                photoUrl: firebase.auth().currentUser.photoURL
            },
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
            .child(this.uuid.toString());
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();

        return await snapshot.ref.getDownloadURL();
    }


}