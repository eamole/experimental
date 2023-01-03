// make sure our code doesn't run before the content has loaded
window.addEventListener('DOMContentLoaded', ()=>{

    // this code wqill run when Dom Content is loaded
    // insertMenu()    
    loadPage("/nav")

})

let $ = (selector) => {
    let els = document.querySelectorAll(selector)
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
            insertScript(url)

        })

    })


}
let insertScript = (url) => {

    let tag = document.createElement("script")  // dynamically create DOM elements
    tag.setAttribute('src', url)  // causes a load event when attached to DOM
    tag.setAttribute('type', 'text/javascript')
    document.body.appendChild(tag)

    tag.addEventListener('load', () => {
        console.log('script loaded')
    })

    document.addEventListener('script-loaded', (ev, el) => {
        console.log('script-loaded', ev, el)

    })
}


let insertMenu = () => {
    get('/nav/index.html', html => {
        
        let navbar = $('#nav-container')

        navbar.innerHTML = html // insert it into the DOM - browser parses HTML
        
        disableAnchorTags()

    })
}













