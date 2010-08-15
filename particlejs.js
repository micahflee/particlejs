function particlejs(opts) {
	// create the container
	//$('html, body').append('<div id="particlejs" style="position:fixed;top:0;left:0;width:'+$(window).width()+';height:'+$(window).height()+';"></div>');
	
	$('body').css('overflow', 'hidden');
	$('body').animate({scrollTop:'0px'}, 200); 
	
	var screen_width = $(window).width();
	var screen_height = $(window).height();

	// a single particle
	function particle(opts){
		var id = '#particlejs-'+opts.id;
		var age = 0;
		var speed = 10+Math.random()*10;
		var angle = Math.random()*360;
		var x = screen_width/2;
		var y = screen_height/2;
		
		$('body').append('<div id="particlejs-'+opts.id+'" style="display:none">'+opts.html+'</div>');
		$(id).css('text-align', 'center');
		$(id).css('position', 'absolute');
		$(id).css('left', x-opts.width/2);
		$(id).css('top', y-opts.height/2);
		$(id).css('overflow', 'hidden');
		$(id).css('width', opts.width);
		$(id).css('height', opts.height);
		$(id).css('-webkit-transform', 'rotate('+angle+'deg)');
		$(id).css('-moz-transform', 'rotate('+angle+'deg) scale(0)');
		$(id).css('zoom', 0);
		$(id).css('display', 'block');
		
		var destroyed = false;
		var destroy = function(){
			$(id).remove();
			destroyed = true;
		};

		var update = function(){
			if(destroyed) return;
			
			// zoom in with age
			$(id).css('zoom', (0.1+age/20));
			$(id).css('-moz-transform', 'rotate('+angle+'deg) scale('+(0.1+age/20)+')');
			// speed up with age
			speed *= 1.1;

			function to_radians(degrees) { return degrees * Math.PI / 180; }
			function to_degrees(radians) { return ((radians * 180 / Math.PI)+360)%360; }

			// calculate the movement
			var xinc = speed*Math.cos(to_radians(angle));
			var yinc = speed*Math.sin(to_radians(angle));
			var pos = $(id).offset();
			var newpos = {
				left: pos.left + xinc,
				top: pos.top + yinc
			};
			
			// move the particle
			$(id).offset(newpos);
			age++;

			// make sure it's still on the screen
			var on_the_screen = true;
			if(newpos.left < -100 || newpos.top < -100) on_the_screen = false;
			if(newpos.left >= screen_width + 100) on_the_screen = false;
			if(newpos.top  >= screen_height + 100) on_the_screen = false;
			if(on_the_screen) {
				setTimeout(update, 100);
				return true;
			} else {
				destroy();
				return false;
			}
		};
		
		// start updating
		update();
	};

	// launch a particle
	var particle_count = 0;
	var launch = function() {
		// pick a color
		var hex_digits = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
		var color = '#';
		for(var i=0; i<6; i++) {
			var random_element = Math.ceil(Math.random()*hex_digits.length);
			color += hex_digits[random_element];
		}

		// create a new particle
		new particle({
			id: particle_count,
			width: 100,
			height: 100,
			html: '<h1 style="color:'+color+'">'+particle_count+'</h1>'
		});
		particle_count++;
	}

	// launch a 5 times a second
	var launch_interval = setInterval(launch, 50);

	// if there's a duration, stop everything then
	if(opts.duration) {
		setTimeout(function(){
			clearInterval(launch_interval);
		}, opts.duration);
	}	
}
