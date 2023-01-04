// this is a library. probably shouldn't have ANY auto execute code!!
// unless there is some form of initialisation
// make sure our code doesn't run before the content has loaded
window.addEventListener('DOMContentLoaded', ()=>{

    // this code wqill run when Dom Content is loaded
    // insertMenu()    
    // loadPage("/nav")    // todo: move this to app.js
    // use in app.js - remove from here

})

let $ = (selector, scope = document) => {

    if(typeof scope == "string") scope = $(scope)   // if I forget to extract the element first, use the string to get the element

    let els = scope.querySelectorAll(selector)
    // if its an ID selector
    if(els.length == 0) console.error("selector has no elements", selector, scope)
    if(selector[0] == "#") els = els[0] // only return the first element - should only be one!!

    // maybe if length == 1
    // length ==0 -> error
    return els  // either a NodeList, or just one!!
}

let get = (url, callback) => {

    console.log('This is get()', url)
    fetch(url)  // built in JS function - returns a Promise
    .then( response => { 
        if (!response.ok) throw new Error(`HTTP Error: ${url} ${response.statusText}`)
        return response.text() 
    })
    .then( data => callback(data) ) // change this to handle a returned promise if no callback provided
    .catch(err => console.error(err))
    // nothing returns from here
    console.log('This function will have finished before fetch finishes!!')
}

let loadNav = (url = "/nav", target = "#nav-container") => {
    console.log('Loading Nav Bar')
    // if(typeof target == "string") target = $(target)
    insertHtmlFromUrl(url, target)
}
/*
    custom page loader
    uses a json file to define the bits to load
*/
let loadPage = (folder) => {
        
    let url = folder + "/index.json"

    get(url, data => {
        let json = JSON.parse(data) // find the locations of the various files - from the folder json
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
    TODO: deprecated
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
    tag.setAttribute('type', 'text/javascript')
    tag.setAttribute('src', url)  // causes a load event when attached to DOM
    document.body.appendChild(tag)

}

let insertScriptFromText = (script) => {

    let tag = document.createElement("script")  // dynamically create DOM elements
    tag.setAttribute('type', 'text/javascript')
    tag.textContent = script
    document.body.appendChild(tag)

}

let insertHtmlFromUrl = (url, selector) => {
    
    get(url, (html) => {
        // console.log('a href', data)
        let container = $(selector)
        container.innerHTML = html  // this is the HTML fragment
        // TODO: change the address bar
        // now extract the script tags
        extractScriptTags(selector)   // because they do not run when inserted like this

        emit('DomReady', container) // equiv of DomContentLoaded for a injected HTML node
        // now pass container (the local DOM) to the newly created script
    })

}
/*
    this removes script tags from a newly inserted HTML fragment, because they will not run
    must create script tag elements dynamically, and attach them to DOM
*/
let extractScriptTags = (container) => {

    let scripts = $('script', container)
    // console.log('scripts', scripts)  
    let jsCode = scripts[0].text    // assume single script TODO: multi scripts
    scripts[0].remove() // avoid duplicate function definitions - remove original script from DOM
    insertScriptFromText(jsCode)
    

}



let emit = (event, scope) => {
    console.log('should dispatch event', event)
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

// binds exclusively to an element that has a "value" attribute
let valueBinder = (el, data, prop) => {
    if (typeof(el) == "string") el = $(el)
    Object.defineProperty(data, prop, {
        get () {
            return el.value // see how we explicitly specify "value" of the element - make generic
        },
        set (newValue) {
            if (typeof newValue == "string") newValue = Number(newValue) // force to number
            return el.value = newValue
        }
    })
}

let loadSidebar = (el = "#sidebar") => {
    console.log('should load sidebar')
    get("/js/sidebar.json", text => {
        let pages = JSON.parse(text)
        // now iterate over the sidebar json and render the side bar html
        let html = "<ul>"

        pages.forEach(page => {
            let link = "<li>"
                link += `<a href="${page.url}">${page.name}</a>`
            link += "</li>"
            html += link
        })
        html += "</ul>"

        // inject the html
        let $sidebar = $("#sidebar")
        $sidebar.innerHTML = html 

    })
} 

let P = (result) => {   // shorthand for allow quick chaining using Promises
    return new Promise((resolve) => {
        try {
            resolve(result)
        } catch (error) {
            reject(error + ":" + result)
        }
    })
}











