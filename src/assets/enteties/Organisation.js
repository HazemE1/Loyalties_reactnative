export default class Organisation {
    constructor(props) {
        this.name = props.name
        this.uuid = props.uid
        this.img = props.photoUrl
        this.description = props.description
        this.workers = props.workers !== undefined ? props.workers : []
        this.updates = props.updates !== undefined ? props.updates : []
        this.stats = props.stats !== undefined ? props.updates : {stamps: 0, done: 0}
        this.grade = props.grade
        this.owner = props.owner
        this.stampOwners = props.stampOwners !== undefined ? props.stampOwners : []
        this.contactInfo = {
            mail: props.mail,
            phone: props.number
        }
        this.settings = {
            stampGoal: 6,
            stampSettings: {
                message: {
                    0: "Du har fått en ny stämpel hos: " + this.name,
                    3: "Du är halvvägs till ditt stämpel pris hos: " + this.name,
                    6: "Du har avklarat en hel stämpelkort hos: " + this.name + " !!"
                },
                title: this.name,
                reward: "10% på nästa meny"
            }
        }

    }
}