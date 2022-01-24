import axios from "axios";

export default class {
    static domain = `${window.location.protocol}//${window.location.hostname}`;
    static url = `${this.domain}/api`;
    static websocketUrl = `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.hostname}`;
    static uniqueId;

    static setUniqueId(uniqueId) {
        this.uniqueId = uniqueId;
    }

    static loadUniqueId() {
        if (this.uniqueId === undefined)
            this.uniqueId = localStorage.getItem("uniqueId");
    }

    static async makeRequest(path = "/", additional_data = {}) {
        this.loadUniqueId();
        console.log(`${this.url}${path}`)
        return (await axios.post(`${this.url}${path}`, {
            uniqueId: this.uniqueId,
            ...additional_data
        })).data;
    }
}