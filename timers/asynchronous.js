/*

    asynchronous programming happens as a direct consequence of one machine talking to another
    or multi processors/cores, or multi threaded o/s - unix .....

    if machine A requests something from machine B
    rather than wait until machine B has sent the entire result set
    machine A is free to do whatever, until the response from machine B is ready

    all web code WAS synchronous before 2005
    ie the browser DID wait until machine B respoinded completely, before it moved on to the next instruction

    then came AJAX - Asynchronous Javascript And XML - XmlHttpRequest (XHR)

    the new programming universe (Web) had a number of important, essential and unavoidable qualities
    1) it was graphical - ie the browser - fonts, colours, images
    2) it was client/server (browser <-> webserver) (client side library (drivers) (eg Oracle) to talk to server side (eg Oracle))
        eg open a comms chanell to a remote resource, and supply a driver for the specific remote resource
        eg MS-Access.dll gives comms to MS Access databases

        or

        Web Browser comms with a Web Server (ie Client/Server) and the driver/languages was
        HTTP

        its all still synchronous ie sequential

        request -> response
        request -> response

        around 2005 IFrame/XHR 

    3) asynchronous / parallelism
        a) browser - 2 threads -> internal async/parallelism/concurrent process
            parse(html)/render/DOM
            javascript

            platform was async - ie ask the DOM to do something, and it will happen in the future
            dom.insertHtml(XYZ) -> ok, but not idea when it will do it

            because in JS functions are 1st degree citizens, we can pass them around
            Brendan(??) Eich - JS, Netscape
        b) client/server platform - so it always was about two process running on independent machines 
            browser
            server


        The 1st mechanism for handling parallel / async process, was the callback
        ie a function to call, when a process completes successfully

        look at the XHR object!!

    4) events/interrupts - UI, Operating System, Network, request/response events (success/fail/in progress)
        IBM/CMS

        provide an event handler (it's like a callback)

        event is completely unpredictable, triggered by an external resource - keyboard, renmote server, phone
        callback - unknown when it will be called - when a task is finished/error/progress update

        










*/