/********************************************
 * ParticleJS - a div-based particle system
 * http://github.com/micahflee/particlejs
 ********************************************/

// a single particle
function particle(opts){
	this.age = 0;
	this.speed = 2+Math.random()*3;
	this.speed_factor = opts.speed_factor;
	this.rotate_angle = 0;
	this.width = opts.width;
	this.height = opts.height;
	this.innerhtml = opts.innerhtml;

	this.html_begin = '<div style="position:absolute; overflow:hidden; width:'+this.width+'; height:'+this.height+'; ';
	this.html_end = 'display:block;">'+this.innerhtml+'</div>';

	switch(opts.type) {
		case 'circle':
			this.angle = Math.random()*360;
			this.rotate_angle = this.angle;
			this.x = opts.start_x || $(window).width()/2;
			this.y = opts.start_y || $(window).height()/2;
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
};
particle.prototype = {
	html: function() {
		var zoom = this.age/30;
		var left = this.x-this.width/2+'px';
		var top = this.y-this.height/2+'px';
		return this.html_begin+'left:'+left+'; top:'+top+'; -webkit-transform:rotate('+this.rotate_angle+'deg); -moz-transform:rotate('+this.rotate_angle+'deg) scale('+zoom+'); zoom:'+zoom+';'+this.html_end;
	},
	to_radians: function(degrees) { return degrees * Math.PI / 180; },
	to_degrees: function(radians) { return ((radians * 180 / Math.PI)+360)%360; },
	update: function(){
		// speed up with age
		this.speed *= 1.1;

		// move the particle
		var xinc = this.speed_factor*this.speed*Math.cos(this.to_radians(this.angle));
		var yinc = this.speed_factor*this.speed*Math.sin(this.to_radians(this.angle));
		this.x += xinc;
		this.y += yinc;
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
	$('body').append('<div id="particlejs" style="position:fixed; top:0; left:0; width:'+$(window).width()+'; height:'+$(window).height()+';"></div>');
	
	var element_width = opts.width || 100;
	var element_height = opts.height || 100;
	var speed_factor = opts.speed || 1;
	var launch_speed = opts.launch_speed || 100;
	var update_speed = opts.update_speed || 1;
	var type = 'circle';
	if(opts.type == 'horizontal' || opts.type == 'vertical') type = opts.type;

	// launch new particles
	var particles = [];
	var launch_interval = setInterval(function(){
		// figure out the html to put inside this particle
		var innerhtml = '';
		if(!opts.elements) {
			// if elements weren't passed in, use the current id of a random color
			var hex_digits = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
			var color = '#';
			for(var i=0; i<6; i++) {
				var random_element = Math.floor(Math.random()*hex_digits.length);
				color += hex_digits[random_element];
			}
			innerhtml = '<h1 style="color:'+color+'">'+color+'</h1>';
		} else {
			// pick a random element
			innerhtml = opts.elements[Math.floor(Math.random()*opts.elements.length)];
		}
		
		// create a new particle
		particles.push(new particle({
			type: type,
			width: element_width,
			height: element_height,
			speed_factor: speed_factor,
			innerhtml: innerhtml
		}));
	}, launch_speed);

	// update particles
	var update_interval = setInterval(function(){
		var particles_to_delete = [];

		// update and display all the particles
		var html = '';
		for(var i in particles) {
			if(!particles[i].update()) {
				particles_to_delete.push(i);
			}
			html += particles[i].html();
		}
		$('#particlejs').html(html);

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
