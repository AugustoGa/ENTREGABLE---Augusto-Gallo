const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const { normalize, schema } = require("normalizr");
const util = require("util");

class Message {
    constructor() {
        this.url = "mongodb://127.0.0.1:27017";
        this.mongodb = mongoose.connect;
    }

    async save(msg) {
        try {
            await this.mongodb(this.url)
            const result = await msg.save();
            return result;
        } catch (err) {
            return err;
        }
    }

    async createData(msg) {
        try {
            await this.mongodb(this.url)
            const newMessage = await this.save(
                new messageModel({
                    author: {
                        email: msg.email,
                        nombre: msg.nombre,
                        apellido: msg.apellido,
                        edad: msg.edad,
                        alias: msg.alias,
                        avatar: msg.avatar,
                    },
                    text: msg.message,
                })
            );
            return newMessage;
        } catch (err) {
            return err;
        }
    }
    async getAll() {
        try {
            await this.mongodb(this.url);
            return await messageModel.find();
        } catch (err) {
            return err;
        }
    }

    async normalize(){
        let messages = {messages: await this.getAll()};
        const authorSchema = new schema.Entity(
            "authors", {}, { idAttribute: "email" }
        );
        const messageSchema = new schema.Entity("message",{author: authorSchema});
        const msgSchema = { messages: [messageSchema]};
        const normalizado = normalize(messages, msgSchema);
        console.log(normalizado);
        return normalizado;
    }
}

module.exports = Message;