function getScripts( scripts, onScript, onComplete )
{
    this.async = true;
    this.cache = false;
    this.data = null;
    this.complete = function () { $.scriptHandler.loaded(); };
    this.scripts = scripts;
    this.onScript = onScript;
    this.onComplete = onComplete;
    this.total = scripts.length;
    this.progress = 0;
};

getScripts.prototype.fetch = function() {
    $.scriptHandler = this;
    var src = this.scripts[ this.progress ];
    console.log('%cFetching %s','color:#ffbc2e;', src);

    $.ajax({
        crossDomain:true,
        async:this.async,
        cache:this.cache,
        type:'GET',
        url: src,
        data:this.data,
        statusCode: {
            200: this.complete
        },
        dataType:'script'
    });
};

getScripts.prototype.loaded = function () {
    this.progress++;
    if( this.progress >= this.total ) {
        if(this.onComplete) this.onComplete();
    } else {
        this.fetch();
    };
    if(this.onScript) this.onScript();
};


var scripts = new getScripts(
    ['public-assets/js/popper.min.js',
	 'public-assets/js/bootstrap.min.js',
	 'public-assets/js/bootstrap.bundle.min.js',
	 'public-assets/js/prettify.min.js',
	 'public-assets/js/fancybox.min.js',
	 'public-assets/js/flipclock.min.js',
	 'public-assets/js/swiper.min.js',
	 'public-assets/js/isotope.min.js',
	 'public-assets/js/particles.min.js',
	 'public-assets/js/jquery.stellar.min.js',
	 'public-assets/js/instagram.min.js',
	 'public-assets/js/odometer.min.js',
	 'public-assets/js/perspective.min.js',
	 'public-assets/js/jquery.validate.min.js',
	 'public-assets/js/jquery.form.min.js',
	 'public-assets/js/wow.min.js',
	 'public-assets/js/TweenMax.min.js',
	 'public-assets/js/easypiechart.min.js',
	 'public-assets/js/jquery.easing.min.js',
	 'public-assets/js/inits.js',
	 'public-assets/js/scripts.js'],
    function() {
       
		// PRELOADER
		(function($) {
			$(window).load(function(){
				$("body").addClass("page-loaded");	
			});
		})(jQuery)
    
	},
	
    function () {
		// ---
    }
);
scripts.fetch();




