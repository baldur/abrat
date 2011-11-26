# ABRAT how to [example](http://baldur.github.com/abrat/)

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
        experiments : [
            {'key' : 'cl', // two alpha letter identifer
             'name' : 'primary vs ino',
             'weight' : 60 }, // persentage of a 50% if skipped only in increments of 10s will be rounded
            {'key' : 'ba',
             'name' : 'large vs small',
             'weight' : 40 },
            {'key' : 'sh',
             'name' : 'wonderful vs lovely'}
        ]
    };

###i right after body tag opens
    <script src="./src/abrat.js"></script>

#### then you can implement your reporting hooks for page load for GA example
    var experiments = SOMENS.ab.report(function(abhash){
        return $.map(abhash, function(v,k){
            // you can if you like fire a load event instead or in addition to 
            // having all experiments reported at once via custom var
            _gaq.push(['_trackEvent', k+" ("+v+")", 'loaded']);
            return k+" ("+v+")"
        }).join(" | ");
    });
    _gaq.push(['_setCustomVar', 1, 'Experiments', experiments, 1]);

#### and for some hooks on click events in experiments
    PATCH.ab.attachHandlers(function(sel,name){
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



