class Parent {
    constructor() {
        this.current_frame = null
        this.current_url = null
        window.addEventListener("message", (event) => { this.handle_message(event); }, false)
    }

    load_frame(url) {
        var target = document.getElementById('content_frame');
        var frame = document.createElement('iframe');
        
        frame.src = url;
        this.current_url = url;
        
        target.innerHTML = '';
        target.appendChild(frame);
        this.current_frame = frame;
        
        setTimeout(() => {
            this.send('load', {});
        }, 100);
    }
    
    send(event, obj) {
        if (this.current_frame == null) {
            return null;
        }
        
        var d = {'type':event, 'payload':obj}
        
        this.current_frame.contentWindow.postMessage(d, "http://localhost:4040/");
    }

    handle_message(event) {
        console.log("PARENT -> From Child: " + JSON.stringify(event.data))
        let payload = event.data.payload
        if (event.data.type == '__data_request') {
            $.get(payload.url).then((data) => {
                this.send('__data_response', {'url':payload.url, 'data':data})
            })
            return
        }
        console.log("Unhandled event type: " + event.data.type)
    }
}
