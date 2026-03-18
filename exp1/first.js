const EventEmitter = require("events")

const eventEmitter = new EventEmitter()

const eventCounts = {
  "login": 0,
  "logout": 0,
  "purchase": 0,
  "updateProfile": 0
}

eventEmitter.on("login", (username) => {
  eventCounts["login"]++
  console.log(`${username} logged in`)
})  

eventEmitter.on("logout", (username) => {
  eventCounts["logout"]++
  console.log(`${username} logged out`)
})  

eventEmitter.on("purchase", (username, item) => {
  eventCounts["purchase"]++
  console.log(`${username} purchased ${item}`)
})  

eventEmitter.on("updateProfile", (username) => {
  eventCounts["updateProfile"]++
  console.log(`${username} updated Profile`)
})  

eventEmitter.on("summary", () => {
    console.log("\nevent summary: ")
    for (let event in eventCounts) {
        console.log(`${event}: ${eventCounts[event]} times`)
    }
})



eventEmitter.emit("login", "Alice")
eventEmitter.emit("login", "Bob")

eventEmitter.emit("purchase", "Alice", "Laptop")
eventEmitter.emit("updateProfile", "Bob")

eventEmitter.emit("logout", "Alice")
eventEmitter.emit("logout", "Bob")

eventEmitter.emit("summary")
