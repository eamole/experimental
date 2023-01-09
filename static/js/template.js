class Template {
    // I might have a problem as the $ is scoped
    constructor(objectName, object, id, domContainerSelector) {
        this.id = id // this is what distinguishes each individual rendered object -e unique element ids
        this.objectName = objectName
        this.object = object
        this.domContainerSelector = domContainerSelector
        this.templateSelector = "#" + this.objectName + "-" + "template"  // ie product-template
        this.domElementSelector = this.templateSelector + "-" + this.id
        this.template = document.querySelector(this.templateSelector).outerHTML   // grab the HTMl from the actual node
        // console.log('this.template', this.template)
        // we need to do a search and replace on the HTML 

        // this.container = this.template.cloneNode(true) // create a clone from template
        // this.container.id += "-" + this.id  // make the element id unique
        // assign new ids - need the fields

    }

    setProperties (properties) {
        this.properties = properties
    }

          // product a mapping between properties and template elements 
    mapProperties () {
        this.mapToTemplate = {} // this is the template mapping
        this.mapToContainer = {}    // this maps to the actual 
        for(let prop of this.properties) {
            // specify the property name as the key, the template element id as the value
            this.mapToTemplate[prop] = this.objectName + "-" + prop
            this.mapToContainer[prop] = this.mapToTemplate[prop] + "-" + this.id  // ie add to 
        }
    }

    getValues () {   // maybe pass in an array of formatting functions for each property
        this.values = {}
        for(const prop of this.properties) {   // for each mapped property
            this.values[prop] = this.object[prop]
        }
    }
    /**
     * go through the properties, construct a search/replace pattern, and substitute in the values
    */
    generateSearchPatterns () {
        this.searchPatterns = {}
        for(const prop of this.properties) {
            let pattern = "${" + this.objectName + "." + prop + "}"  // eg ${product.name}
            this.searchPatterns[prop] = pattern 
        }
    }
    // do the search replace using the search patterns
    renderContent () {
        this.content = this.template   // keep the container as a pattern
        for(const prop in this.searchPatterns) {
            let pattern = this.searchPatterns[prop]
            let value = this.values[prop]
            this.content = this.content.replace(pattern, value)
        }
        
    }
    createElement () {
        this.element = document.createElement("div")
        this.element.innerHTML = this.content
    }
    changeElementIds () { // make them unique
        // change the id of the selector
        let template = this.element.querySelector(this.templateSelector)
        template.id += "-" + this.id
        // change the ids of all the value elements
        for(const prop of this.properties) {
            let baseId = this.objectName + "-" + prop // + "-" + this.id
            let selector = "#" + baseId
            let el = this.element.querySelector(selector)
            el.id = baseId + "-" + this.id // add the product id to the element.id
        }
    }

    makeContentVisible () {
        // debugger
        // let content = $$(this.templateSelector)    // grab the hidden content - use global $$
        // content.parentNode.remove(content)
        let parent = $$(this.domContainerSelector)   // use $$ global
        parent.appendChild(this.element)

    }

    initialRender () {  // should be in the constructor
        this.mapProperties()
        this.getValues()
        this.generateSearchPatterns()
        this.renderContent()
        this.createElement()
        this.changeElementIds()
        this.makeContentVisible()            

    }
    // on data change
    update () {
        this.getValues()
        this.renderContent()
        this.createElement()
        this.changeElementIds()
        // now, replace the DOM element with this one
        // if(this.clickHandler) this.addClickHandler(this.clickHandler)
        /*
            turns out, you can't get a list of existing handlers on the 
            old node
        */
        let el = $$(this.domElementSelector)
        el.replaceWith(this.element)
        if (this.addClickHandlers) this.addClickHandlers()
    }

    removeElement () {
        // delete the associated element from the dom
        this.element.remove()        
    }

    insertElement (parent) {
        parent.appendChild(this.element)
    }

    addClickHandler (handler) {
        // console.log('add click handler')
        this.clickHandler = handler
        this.element.addEventListener('click', handler)
    }

    /* 
        this would be nice in the future - to just change the node within the template 
        that contains the changed property - ie
        find the exact node in the DOM version of the template
        take the innerHTML, do a search/replace using the bound object value for the property
        and then replace the DOM entry for this template with the changed node  

    */
    onDataChange (prop) {  // the changed properties
        // knowing the prop, can we find the original templateas a DOM element        
        console.log('this.element', this.element)
    }


}

exports = {
    Template
}
