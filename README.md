# ABRAT how to

## Magic happens in three steps
1. configuration object in head or right before script is called
2. call script right after opening body tag 
3. implement reporting outlet (here you can use your library thingies since you are probably gonna wait till the dom is ready)

### This needs to happen in that order (see example)

#### in head
    var SOMENS = {};
    var $ABRAT = {
        ns : SOMENS, //defaults to $ABRAT 
        //cookieName : '', //defaults to abtests
        experiments : 'cl3-sh4-ba4' // what experiemnts are running on page
    };

#### right after body tag opens
    <script src="./src/abrat.js"></script>

#### then you can implement your reporting hooks for page load for GA example
    _gaq.push(['_setCustomVar', 1, 'Experiments', SOMENS.ab.report(), 1]);

#### and for some hooks on click events in experiments
    PATCH.ab.attachHandlers(function(sel){
        $(function(){
            // for older than 1.7 use
            //$('body .' + sel).delegate('a','mousedown', function() {
            $('body .' + sel).on('mousedown', 'a', function(e) {
                // report that abrat element was clicked
                _gaq.push(['_trackEvent', sel, 'clicked']);
            });
        });
    });



## Objectives
* cache tolerant (full page cache)
* no library dependency (has to happen quick and early)
* pluggability to reporting outlets (Google Analytics, Omniture)
* easy to use (so easy I can use it)
* toggle doms (render two doms and abrat will display correct one)



