let counter = 1
let callback = (data) => {
    console.log('data', data)
}
let timer = setInterval(() => {
    console.log('This is a pulse from web worker', counter)
    postMessage({
        text:"This is a message", 
        counter, 
        // callback you can' pass functions. You are "marshalling" data between 2 threads so it can only be data that can be stringified
    })    // sends a message back to the page that loaded it!!
},
2000)