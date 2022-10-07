import fb from "firebase/compat/app"
import "firebase/compat/database"
import firebase from "firebase/compat";

export default class Organisation {
    constructor(props) {
        this.name = props.name
        this.uuid = props.uid
        this.img = props.photoUrl
        this.description = props.description
        this.workers = props.workers !== undefined ? props.workers : []
        this.updates = props.updates !== undefined ? Object.values(props.updates) : []
        this.stats = props.stats !== undefined ? props.stats : {stamps: 0, done: 0}
        this.grade = props.grade
        this.owner = props.owner
        this.stampOwners = props.stampOwners !== undefined ? props.stampOwners : []
        this.contactInfo = {
            mail: props.mail,
            phone: props.number
        }
        this.settings = {
            stampSettings: props.stamp_settings
        }
        this.userRewards = props.userRewards !== undefined ? props.userRewards : {}
        this.ref = fb.database().ref("organisations").child(this.uuid)


    }

    async createANew(title, desc, url, uuid) {
        this.updates.push({uuid: uuid.toString(), title: title.toString(), desc: desc, photoUrl: url})
        await this.ref.child("updates").child(uuid.toString()).set({
            title: title,
            desc: desc,
            photoUrl: url,
            uuid: uuid
        })
    }

    async removeANew(uuid) {
        await this.ref.child("updates").child(uuid).remove()
        for (let i = 0; i < this.updates.length; i++) {
            if (this.updates[i].uuid === uuid) {
                this.updates.splice(i, 1)
                console.log(this.updates)
            }
        }
    }

    getUpdate(uuid) {
        for (let i = 0; i < this.updates.length; i++) {
            if (this.updates[i].uuid === uuid) {
                return this.updates[i]
            }
        }
        return null
    }

    async uploadImageAsync(path, url) {
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
            xhr.open('GET', url, true); // fetch the blob from uri in async mode
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
}