// This is the client class that will exist within the "child"
// iframe.

let HOSTURL = "http://localhost:4040/"

class InsideOutPromise {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }

    resolve(value) {
        this._resolve(value)
    }

    reject(value) {
        this._reject(value)
    }
}

class Client {
    constructor() {
        this.listeners = {}
        this.data_requests = {}
        this.on('__data_response', (payload) => {
            let url = payload.url
            if (this.data_requests[url]) {
                this.data_requests[url].resolve(payload.data)
            }
        })
    }

    on(event, callback) {
        if (this.listeners[event] == undefined) {
            this.listeners[event] = []
        }
        this.listeners[event].push(callback)
    }

    fire(event, payload) {
        if (this.listeners[event] == undefined) {
            this.listeners[event] = []
        }
        this.listeners[event].forEach((item) => {
            item.apply(null, [payload])
        })
    }

    handle_message(event) {
        console.log("CHILD  -> From Parent: " + JSON.stringify(event.data))
        this.fire(event.data.type, event.data.payload);
    }

    send(type, obj) {
        let d = {'type':type, 'payload':obj}
        parent.postMessage(d, HOSTURL)
    }

    request(url) {
        // __ indicates something used internally by Atoll, you can override but
        // this way there are less naming collisions with event types.

        if (this.data_requests[url] != undefined) {
            return this.data_requests[url].promise
        } else {
            let pro = new InsideOutPromise()
            this.send('__data_request', {'url':url})
            this.data_requests[url] = pro
            return pro.promise
        }
    }
}

let atoll_client_obj = new Client()

window.addEventListener("message", (event) => {
    atoll_client_obj.handle_message(event)
}, false)
