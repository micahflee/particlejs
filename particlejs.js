/********************************************
 * ParticleJS - a div-based particle system
 * http://github.com/micahflee/particlejs
 ********************************************/

// a single particle
function particle(opts){
	this.dom_partial = $('<div>');
	this.age = 0;
	this.speed = 2+Math.random()*3;
	this.speed_factor = opts.speed_factor;
	this.rotate_angle = 0;
	this.width = opts.width;
	this.height = opts.height;

	switch(opts.type) {
		case 'circle':
			this.angle = Math.random()*360;
			this.rotate_angle = this.angle;
			this.x = $(window).width()/2;
			this.y = $(window).height()/2;
			break;
		case 'horizontal':
			rotate_angle = 0;
			if((Math.floor(Math.random()*2)) == 0) {
				// moving left
				this.angle = 180;
				this.x = $(window).width()-this.width/2;
				this.y = Math.floor(Math.random()*$(window).height());
			} else {
				// moving right
				this.angle = 0;
				this.x = this.width/2;
				this.y = Math.floor(Math.random()*$(window).height());
			}
			break;
		case 'vertical':
			rotate_angle = 0;
			if((Math.floor(Math.random()*2)) == 0) {
				// moving up
				this.angle = 270;
				this.x = Math.floor(Math.random()*$(window).width());
				this.y = $(window).height();
			} else {
				// moving down
				this.angle = 90;
				this.x = Math.floor(Math.random()*$(window).width());
				this.y = 0;
			}
			break;
	}
	
	this.dom_partial.html(opts.html);
	this.dom_partial.css('position', 'absolute')
		.css('overflow', 'hidden')
		.css('width', this.width)
		.css('height', this.height)
		.css('-webkit-transform', 'rotate('+this.rotate_angle+'deg)')
		.css('-moz-transform', 'rotate('+this.rotate_angle+'deg) scale(0)')
		.css('zoom', 0)
		.css('display', 'block');
};
particle.prototype = {
	update: function(){
		// zoom in with age
		this.dom_partial.css('zoom', (this.age/50));
		this.dom_partial.css('-moz-transform', 'rotate('+this.rotate_angle+'deg) scale('+(this.age/50)+')');
		// speed up with age
		this.speed *= 1.1;

		function to_radians(degrees) { return degrees * Math.PI / 180; }
		function to_degrees(radians) { return ((radians * 180 / Math.PI)+360)%360; }

		// move the particle
		var xinc = this.speed_factor*this.speed*Math.cos(to_radians(this.angle));
		var yinc = this.speed_factor*this.speed*Math.sin(to_radians(this.angle));
		this.x += xinc;
		this.y += yinc;
		this.dom_partial.css('left', this.x - this.width/2);
		this.dom_partial.css('top', this.y - this.height/2);
		this.age++;

		// make sure it's still on the screen
		var on_the_screen = true;
		if(this.x < -this.width || this.y < -this.height) on_the_screen = false;
		if(this.x >= $(window).width() + this.width) on_the_screen = false;
		if(this.y >= $(window).height() + this.height) on_the_screen = false;
		return on_the_screen;
	}
};

// the whole particle system
function particlejs(opts) {
	$('body').css('overflow', 'hidden');
	$('body').animate({scrollTop:'0px'}, 200);
	$('body').append('<div id="particlejs" style="position:fixed; top:0; left:0; width:'+$(window).width()+'; height:'+$(window).height()+';"></div>');
	
	var element_width = opts.width || 100;
	var element_height = opts.height || 100;
	var speed_factor = opts.speed || 1;
	var launch_speed = opts.launch_speed || 100;
	var update_speed = opts.update_speed || 0;
	var type = 'circle';
	if(opts.type == 'horizontal' || opts.type == 'vertical') type = opts.type;

	// launch new particles
	var particles = [];
	var launch_interval = setInterval(function(){
		// figure out the html to put inside this particle
		var html = '';
		if(!opts.elements) {
			// if elements weren't passed in, use the current id of a random color
			var hex_digits = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
			var color = '#';
			for(var i=0; i<6; i++) {
				var random_element = Math.ceil(Math.random()*hex_digits.length);
				color += hex_digits[random_element];
			}
			html = '<h1 style="color:'+color+'">'+color+'</h1>';
		} else {
			// pick a random element
			html = opts.elements[Math.floor(Math.random()*opts.elements.length)];
		}
		
		// create a new particle
		particles.push(new particle({
			type: type,
			width: element_width,
			height: element_height,
			speed_factor: speed_factor,
			html: html
		}));
	}, launch_speed);

	// update particles
	var update_interval = setInterval(function(){
		var particles_to_delete = [];

		// update and display all the particles
		var partial = $('<div id="particles">');
		for(var i in particles) {
			if(!particles[i].update()) {
				particles_to_delete.push(i);
			}
			partial.append(particles[i].dom_partial);
		}
		$('#particlejs').html(partial.html());

		// delete ones that need deleting
		for(var i in particles_to_delete) {
			particles.splice(particles_to_delete[i] - i, 1);
		}
	}, update_speed);

	// if there's a duration, stop everything then
	if(opts.duration) {
		setTimeout(function(){
			clearInterval(launch_interval);
			//clearInterval(update_interval);
		}, opts.duration);
	}	
}
