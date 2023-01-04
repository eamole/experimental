
/*
    attach handler to each anchor tag, disable default link following (preventDefault), and use
    JS to load the specified content
*/
let captureAnchorTags = () => {
    // inner function / local
    let menuAnchorClickHandler = (ev, el) => {
        // console.log('menu click ev', ev, el)

        ev.preventDefault() // stop browser loading page/link/anchor
        
        let a = ev.target
        // console.log('target', a.href)
        insertHtmlFromUrl(a.href, "#canvas")
    }
    let navbar = $("#navbar")   // get the navbar container
    let tags = $('a', navbar)   // TODO: this is EVERY anchor tag on the page - Done!! added navbar scope
    for(let tag of tags) {
        // console.log('a', tag)
        tag.addEventListener("click", menuAnchorClickHandler)
    }

}

captureAnchorTags() // TODO: this would be better as an IIFE

// let ev = new Event('script-loaded')
// document.dispatchEvent(ev)


