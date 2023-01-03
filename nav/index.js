// alert('hello')  // this is a Modal - it blocks the thread
// debugger
// console.log('navbar', navbar)   // ??? where is this navbar coming from???????
// let navbar = $("#navbar")
// console.log('navbar', navbar)

let disableAnchorTags = () => {
    // inner function / local
    let menuAnchorClickHandler = (ev, el) => {
        // console.log('menu click ev', ev, el)

        ev.preventDefault() // stop browser loading page/link/anchor
        
        let a = ev.target
        console.log('target', a.href)

        get(a.href, data => {
            console.log('a href', data)
            let canvas = $("#canvas")
            canvas.innerHTML = data
        })
    }

    let tags = $('a')
    for(let tag of tags) {
        console.log('a', tag)
        tag.addEventListener("click", menuAnchorClickHandler)
    }

}

disableAnchorTags()

let ev = new Event('script-loaded')
document.dispatchEvent(ev)


