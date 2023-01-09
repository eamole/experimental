let counter = 1
let timer = setInterval(() => {
    console.log('This is a pulse from web worker', counter)
    postMessage({
        text:"This is a message", 
        counter
    })    // sends a message back to the page that loaded it!!
},
2000)