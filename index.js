#!/usr/bin/env node

let amqp = require('amqplib/callback_api');
const { randomInt } = require('node:crypto');

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }
    let queue = 'ager'

    channel.assertQueue(queue, {
      durable: false
    })
    channel.prefetch(1)
    console.log(' [x] Awaiting Aging Requests')
    channel.consume(queue, function reply(msg) {
      let incoming = JSON.parse(msg.content)

      console.log("Aging this person")

      let response = {new_age: age_them(incoming.age)}

      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(response.toString()), {
          correlationId: msg.properties.correlationId
        })

      channel.ack(msg);
    })
  })
})


const age_them = (age) => {
    return age * getRandomInt(3)
}


const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}