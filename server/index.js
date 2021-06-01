const express = require('express');
const app = express();
const messages = [];

app.use(express.json());

let newId = 0;

class EventEmitter {
    #listeners = [];

    subscribe(cb) {
        this.#listeners.push(cb);
    }

    unsubscribe(cb) {
        this.#listeners = this.#listeners.filter(l => l !== cb)
    }

    publish(message) {
        this.#listeners.forEach(listener => {
            listener(message);
        })
    }
}

const messagesEmitter = new EventEmitter();

messagesEmitter.subscribe((message) => {
    messages.push(message);
})

app.post('/chat', function (req, res) {
    const data = req.body;
    messagesEmitter.publish({
        ...data,
        id: newId++
    });
    res.flushHeaders();
    res.end();
});

app.get('/messages', function (req, res) {
    res.json(messages);
    res.end();
});

app.listen(4002, () => { console.log("Listening..")});