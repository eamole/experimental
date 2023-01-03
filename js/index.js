// make sure our code doesn't run before the content has loaded
window.addEventListener('DOMContentLoaded', ()=>{

    // this code wqill run when Dom Content is loaded
    // insertMenu()    
    loadPage("/nav")

})

let $ = (selector, el = document) => {
    let els = el.querySelectorAll(selector)
    // if its an ID selector
    if(selector[0] == "#") els = els[0] // only return the first element - should only be one!!
    return els  // either a NodeList, or just one!!
}

let get = (url, callback) => {

    console.log('This is get()', url)
    fetch(url)  // built in JS function - returns a Promise
    .then( response => { 
        if (!response.ok) throw new Error(`HTTP Error: ${url} ${response.statusText}`)
        return response.text() 
    })
    .then( data => callback(data) )
    .catch(err => console.log(err))
    // nothing returns from here
}
/*
    custom page loader
    uses a json file to define the bits to load
*/
let loadPage = (folder) => {
        
    let url = folder + "/index.json"

    get(url, data => {
        let json = JSON.parse(data)
        let htmlFile = folder + "/" + json.html
        get(htmlFile, html => {
            let el = $("#nav-container")
            el.innerHTML = html

            url = folder + "/" + json.js
            insertScriptFromUrl(url)
            emit('DomReady', el)
        })

    })
}

/*
    should this be here?
    it probably should be in nav.js/html, if it hasn't been superceded already
*/
let insertMenu = () => {
    get('/nav/index.html', html => {
        
        let navbar = $('#nav-container')

        navbar.innerHTML = html // insert it into the DOM - browser parses HTML
        
        disableAnchorTags()

    })
}


let insertScriptFromUrl = (url) => {

    let tag = document.createElement("script")  // dynamically create DOM elements
    tag.setAttribute('src', url)  // causes a load event when attached to DOM
    tag.setAttribute('type', 'text/javascript')
    document.body.appendChild(tag)

}

let insertScriptFromText = (script) => {

    let tag = document.createElement("script")  // dynamically create DOM elements
    tag.setAttribute('type', 'text/javascript')
    tag.textContent = script
    document.body.appendChild(tag)

}

let insertHtmlFromUrl = (url, selector) => {
    
    get(url, data => {
        // console.log('a href', data)
        let container = $(selector)
        container.innerHTML = data

        // now extract the script tags
        extractScriptTags(canvas)

        emit('DomReady', container)

    })

}
/*
    this removes script tags from a newly inserted HTML fragment, because they will not run
    must create script tag elements dynamically, and attach them to DOM
*/
let extractScriptTags = (container) => {

    let scripts = $('script', container)
    // console.log('scripts', scripts)  
    let jsCode = scripts[0].text    // assume single script
    scripts[0].remove() // avoid duplicate function defintions
    insertScriptFromText(jsCode)
    // now pass container (the local DOM) to the newly created script

}



let emit = (event, scope) => {
    console.log('shoukd dispatch event', event)
    let ev = new CustomEvent(event, {detail: {scope}})
    window.dispatchEvent(ev)
}

let on = (event, callback) => {
    console.log('adding custom event handler ', event)
    
    window.addEventListener(event, (ev) => {
        console.log('custom event handler called', ev)
        let dom = ev.detail.scope
        let global = $
        let local = (selector) => global(selector, dom) // bind it to local dom 

        callback(dom, local, global)
    })
}













