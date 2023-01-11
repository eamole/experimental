/*
    this is a module

    clock

    interface 
        start()
        stop()
        setInterval(ms) - how often should it fire!!
        setCallback(callback)
*/

let startingTimeMs = Date.now()   // ms since 1970
let timer
let timePeriod = 1000 // default callback interval is 1 sec
let callback

let setCallback = (cb) => {
    callback = cb
}
let setTimePeriod = (timeMs) => {
    timePeriod = timeMs
}

let start = (cb, timeMs) => {   // cb and timeMs are optional arguments
    if(cb) setCallback(cb)
    if(timeMs) setTimePeriod(timeMs)

    let timer = setInterval(() => {
        let diff = Date.now() - startingTimeMs 
        callback(diff)  // diff = # ms since start
    }
    , timePeriod) // timer starts

}

let stop = () => {
    if(!timer) {
        console.error("Cannot stop() a clock before start()")
        return
    }
    clearInterval(timer)    // the callback clock is now stopped
}

export {
    start,
    stop,
    setTimePeriod,
    setCallback
}






