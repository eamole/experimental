// make sure our code doesn't run before the content has loaded
window.addEventListener('DOMContentLoaded', ()=>{

    // this code will run when Dom Content is loaded
    // insertMenu()    
    // loadPage("/nav") // TODO: this is awful
    loadNav()

    loadSidebar()

    // loadContent("/home")

})