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
    if(els.length == 0) { console.error("selector has no elements", selector, scope); debugger }
    if(selector[0] == "#") els = els[0] // only return the first element - should only be one!!
    
    if(!els.length) {   // ie not a list
        // only augment single elements for now
        els.on = function(evName, callback) {
            els.addEventListener(evName, function (ev) {    // use func syntax for this
                callback.call(ev.target, ev)
            })
        }
    }

    // maybe if length == 1
    // length ==0 -> error
    return els  // either a NodeList, or just one!!
}

let get = (url, callback) => {

    // console.log('This is get()', url)
    let promise = fetch(url)  // built in JS function - returns a Promise
    promise.then( response => { 
        // console.log('this is fetch finishing')
        if (!response.ok) throw new Error(`HTTP Error: ${url} ${response.statusText}`)
        return response.text() 
    })
    .then( data => callback(data) ) // change this to handle a returned promise if no callback provided
    .catch(err => console.error(err))
    // nothing returns from here
    // console.log('This function will have finished before fetch finishes!!')
    return promise
}

let loadNav = (url = "/nav", target = "#nav-container") => {
    // console.log('Loading Nav Bar')
    // if(typeof target == "string") target = $(target)
    insertHtmlFromUrl(url, target, () => {
        captureAnchorTags(target, (ev) => {
            // console.log('a click captured')
            anchorClickHandler(ev, '#canvas')
        })
    }, window)
    
}

let loadSidebar = (target = "#sidebar") => {
    // console.log('should load sidebar')
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

        let htmlTarget = "#canvas"  //where to put the loaded content
        // inject the html
        let $sidebar = $(target)
        $sidebar.innerHTML = html 
        captureAnchorTags(target, (ev) => {
            // console.log('a click captured')
            anchorClickHandler(ev, htmlTarget)
        })

        // now, if there is a hash in the address bar, load that page (again!!)
        if (window.location.hash) {
            console.log('hash', window.location.hash)
            let path = "/" + window.location.hash.substring(1) // remove the # and add the leading /
            insertHtmlFromUrl(path, htmlTarget, null, window)
            
        }
 
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

let captureAnchorTags = (selector, clickHandler) => {
    // inner function / local
    let scope = $(selector)   // get the navbar container
    let tags = $('a', scope)   // TODO: this is EVERY anchor tag on the page - Done!! added navbar scope
    // console.log('capturing anchor tags', tags)
    for(let tag of tags) {
        // console.log('a', tag)
        tag.addEventListener("click", clickHandler)
    }

}

let anchorClickHandler = (ev, htmlTarget) => {
    // console.log('menu click ev', ev, el)

    ev.preventDefault() // stop browser loading page/link/anchor
    
    let a = ev.target
    let url = new URL(a.href)
    let path = url.pathname
    let hash = "#" + path.substring(1)    // remove the "/" at start/location[0]
    window.location.hash = hash
    // console.log('target', a.href)
    insertHtmlFromUrl(a.href, htmlTarget, null, window)
}

// deprecated - need to provide a wrapper function - else code is in global scope
let xxx_insertScriptFromUrl = (url, callback, loader) => { // optional callback
    console.log('inserting script from URL', url)
    let tag = document.createElement("script")  // dynamically create DOM elements
    tag.setAttribute('type', 'text/javascript')
    tag.setAttribute('src', url)  // causes a load event when attached to DOM
    document.body.appendChild(tag)
    return new Promise((resolve)=> {
        // need to wait for loaded to fire
        // callback first, then resolve to chain!!
        tag.onload = () => {
            if(callback) callback(loader) // args contains the loader 
        }
        resolve(loader)

    })
}
/*

    wrap the code we will insert into the DOM in a function so that it will not pollute
    the global name space, and will immediately run after insertion

*/
let scriptWrapper = (script, callbackName) => {

    // let {dom, local, global, url} = args

    let wrapper = `
        // use function keyword syntax to allow call() to pass in this
        // use async to allow for await load()
        window.customModules.${callbackName} = async function (dom, $, $$, url, loader) {
            if(!loader) console.error("wrapper(loader) not defined")
            if(!loader) throw new Error("wrapper(loader) not defined")
            let exports = {}
            // console.log("This is the Module Wrapper Function", "${callbackName}", url, this)
            ${script}
            return exports
        }
    `
    return wrapper

}


let insertScriptFromUrl = (url, callback, loader) => { // optional callback
    // console.log('inserting script from URL', url, callback, loader)

    // I have no selector - maybe the loader should have a default dom scope?
    let selector = "#canvas"    // TODO: hack

    let dom = $(selector)   // dom = scope of inserted HTML
    let global = $
    let local = (selector) => global(selector, dom) // bind it to local dom 
    let args = {dom, local, global, url}

    return new Promise(resolve => {
        // console.log('get the url', url)
        let promise = get(url, (script) => {
            // console.log('create the script')
            let func = insertScriptFromText(script, args, callback, loader)
            // console.log('resolve script loaded')
            resolve(func)
        })
        // console.log('insert script promise', promise)
        return promise
    
    })
    
}

/*
    attempt to create a synchronous script loader 
*/
let insertScriptFromUrlSync = async (url, callback, loader) => { // optional callback
    // console.log('inserting script from URL', url, callback, loader)

    // I have no selector - maybe the loader should have a default dom scope?
    let selector = "#canvas"    // TODO: hack

    let dom = $(selector)   // dom = scope of inserted HTML
    let global = $
    let local = (selector) => global(selector, dom) // bind it to local dom 
    let args = {dom, local, global, url}
    // console.log('fetching await', url)
    let response = await fetch(url) 
    // console.log('fetch response', response)
    let script = await response.text()
    let func = insertScriptFromText(script, args, callback, loader)
    return func    
    
}

window.customModules = {_i: 0}  // use this to assign an id to each module wrapper function
// this way we wont overwrite the callback if we load more than 1 script at a time!!

let insertScriptFromText = (script, args, callback, loader) => { // optional callback

    let tag = document.createElement("script")  // dynamically create DOM elements
    tag.setAttribute('type', 'text/javascript')
    let callbackName = "callback_" + customModules._i++
    tag.textContent = scriptWrapper(script, callbackName) // wrap the code in a function
    document.body.appendChild(tag)

    let {dom, local, global, url} = args
    let func = customModules[callbackName]  // this will cause a problem if loaded > 1
    
    
    // attach two functions
    // console.log('create a send function: sender, to loader', func, loader)
    
    /*****
     * need to add the listener/callback before I send the message
     * a simple func might have worked - now I need to remeber the callback(s)
     * for when the send message is actually sent!!
     */
    func.loader = loader    // prob if loaded > 1 TODO: a module tree
    func.args = args
    func.lastMessageId = 1

    func.send = (target, msg) => {
        
        // console.log('send message from sender, to target, data, onsend', func, target, data, loader.onsend)
        let sender = func
        // target.nextMessage = {func, data, sender, lastmessageId: ++func.lastMessageId}
        if(target._callback) target._callback(msg, sender, func.lastMessageId++)  
    } 
    
    // user function - use inner scope so access to func!! but before user code runs
    func.ondata = (callback) => {   // for later
        func._callback = callback
    }
    
    // func.ondata = (data, sender, id) => {
    //     console.log('data, sender, id', data, sender, id)
    //     let response
    //     if(func.ondata) response = func.ondata(data, sender, id)
    //     console.log('response', response)

    // }
    // func.receive = (data) => data

    let exports = func.call(func, dom, local, global, url, loader) // now call the auto callback - with func as this!!
    func.exports = exports
    if(callback) callback.call(func, dom, local, global, url, loader) 

    return func 

}

let getUrlExtension = ( url ) => {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

let createTag = (tagName, attribs, parent =  document.body) => {
    let tag = document.createElement(tagName)  // dynamically create DOM elements
    for(let attrib in attribs) {
        tag.setAttribute(attrib, attribs[attrib])   // set any attributes on the tag

    }
    parent.appendChild(tag)
    return tag
}


let lastTemplateId = 1

// really need to make this a sync function
// loader is the code that calls this function, to give the loaded script a parent - optional
let loadAsync = (url, callback, loader = window) => { // optional callback on load
    // first determine the extension
    let ext = getUrlExtension(url)
    // create a tag to hide the HTML as a reusable template
    let tag = createTag('div', {'class' : 'hidden', 'id' : 'template' + lastTemplateId++})
    return new Promise(resolve => {
    // has to be be promise based :-(
        if(ext == "html") {
            insertHtmlFromUrl(url, tag, callback, loader) //
            .then((func) => {
                // console.log('func', func)
                let exports = func.exports
                resolve(exports)
            })
        }
        if(ext == "js") {
            let func = insertScriptFromUrl(url, callback, loader) //
            exports = func.exports
        }
    
    })

}

// really need to make this a sync function - async not working...still returning a promise
// loader is the code that calls this function, to give the loaded script a parent - optional
let load = async (url, callback, loader = window) => { // optional callback on load
    console.log('load url', url)
    // first determine the extension
    let ext = getUrlExtension(url)
    // create a tag to hide the HTML as a reusable template
    let tag = createTag('div', {'class' : 'hidden', 'id' : 'template' + lastTemplateId++})
    let exports
    if(ext == "html") {
        // make synchronous - but sill returning a bloody Promise!!
        // problem seems to be the call of get -> fetch inside
        // console.log('calling load html with await', url)
        let func = await insertHtmlFromUrl(url, tag, callback, loader) //
        // console.log('load html func', func)
        exports = func.exports
    }
    if(ext == "js") {
        // console.log('**** calling load js with await', url)
        let func = await insertScriptFromUrlSync(url, callback, loader) //
        // console.log('**** load js func', func)
        exports = func.exports
    }
    // console.log('load exports', exports)
    return exports
}
/*
    reqritten slightly to allow an await to make it synchronous
    using promises is a pest for loading "modules"
    using promises requires .then(imports => {}) which creates 
    an inner scope which buggers up the exports
*/
let insertHtmlFromUrl = (url, target, callback, loader) => { // loader is the parent
    if(!url) console.error('insertHtmlfromUrl(): <url> param not specified')
    if(!target) console.error('insertHtmlfromUrl(): <target> param not specified')
    return new Promise(resolve => {
        let promise = get(url, (html) => {

            let container = (typeof target == "string") ? $(target) : target
            container.innerHTML = html  // this is the HTML fragment
            let dom = container   // dom = scope of inserted HTML
            let global = $
            let local = (target) => global(target, dom) // bind it to local dom     
            let wrapperFunction = extractScriptTags(target, {dom, local, global, url, loader})   // because they do not run when inserted like this
            if(callback) callback.call(wrapperFunction, dom, local, global, url, loader) 
            resolve(wrapperFunction)
 
        })
        return promise
    })
}

let insertHtmlFromUrlAsync = (url, target, callback, loader) => { // loader is the parent
    if(!url) console.error('insertHtmlfromUrl(): <url> param not specified')
    if(!target) console.error('insertHtmlfromUrl(): <target> param not specified')
    // window.moduleWrapperFunction = null// cear down previous "listener"
    // use a Promise so we can pass the function.scope to the calling function/scope
    return new Promise(resolve => {
        get(url, (html) => {
            // console.log('a href', data)
            // target can be a css selector, or a DOM node which will contain the html
            let container = (typeof target == "string") ? $(target) : target
            container.innerHTML = html  // this is the HTML fragment
            // TODO: change the address bar
            // now extract the script tags
    
            let dom = container   // dom = scope of inserted HTML
            let global = $
            let local = (target) => global(target, dom) // bind it to local dom 
    
            let wrapperFunction = extractScriptTags(target, {dom, local, global, url, loader})   // because they do not run when inserted like this
            // console.log('insertHtml:wrapper', wrapperFunction)
            // emit('DomReady', container) // equiv of DomContentLoaded for a injected HTML node
            // now pass container (the local DOM) to the newly created script
            // if(window.moduleWrapperFunction) moduleWrapperFunction(dom, local, global, url)
            // the callback with have the wrapperFunction as this as the context
            // but I also need to talk back to the function that called the insertHtml in the first place ie loader 
            if(callback) callback.call(wrapperFunction, dom, local, global, url, loader) 
            resolve(wrapperFunction)
        })
    
    })    
    

}
/*
    this removes script tags from a newly inserted HTML fragment, because they will not run
    must create script tag elements dynamically, and attach them to DOM
*/
let loadedUrls = {} // avoid reloading existing code
let extractScriptTags = (container, args) => {
    
    let {dom, local, global, url, loader} = args
    
    let scripts = $('script', container)
    // console.log('scripts', scripts)
    if(!scripts[0]) return  // if there are no scripts, just return

    let jsCode = scripts[0].text    // assume single script TODO: multi scripts
    // console.log('jsCode', jsCode)
    scripts[0].remove() // avoid duplicate function definitions when inserting again - remove original script from DOM
    let wrapperFunction
    if(!loadedUrls[url]) {  // avoid duplcate loading of code/modules. Code should run once
        wrapperFunction = insertScriptFromText(jsCode, args, null , loader)
        // console.log('extract:wrapperFunction', wrapperFunction)
        loadedUrls[url] = true
    }
    // console.log('wrapperFunction from extractScript', wrapperFunction)
    return wrapperFunction

}



let emit = (event, scope, cargo, callback) => { // optional scope, cargo, and callback
    // console.log('should dispatch event', event)

    let responder = (data) => {
        if(callback) callback(data)
    }
    let ev = new CustomEvent(event, {detail: {scope, cargo, responder}})
    window.dispatchEvent(ev)

    return responder
}

let on = (event, callback) => {
    // console.log('adding custom event handler ', event)
    
    window.addEventListener(event, (ev) => {
        // console.log('custom event handler called', ev)
        let dom = ev.detail.scope
        let global = $
        let local = (selector) => global(selector, dom) // bind it to local dom 

        callback(dom, local, global, ev.detail)
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

// shorthand for allow quick chaining using Promises - simply return P() from a function to chain
let P = (result) => {   
    return new Promise((resolve) => {
        try {
            resolve(result)
        } catch (error) {
            reject(error + ":" + result)
        }
    })
}











