function particlejs(opts) {
	//$('body').css('overflow', 'hidden');

	// a single particle
	function particle(opts){
		this.id = '#particlejs-'+opts.id;
		this.age = 0;
		this.speed = 15+Math.random()*5;
		this.angle = Math.random()*360;
		width = opts.width;
		height = opts.height;
		x = $(window).width()/2;
		y = $(window).height()/2;
		
		$('body').append('<div id="particlejs-'+opts.id+'" style="display:none">'+opts.html+'</div>');
		$(this.id).css('text-align', 'center');
		$(this.id).css('position', 'absolute');
		$(this.id).css('left', x-width/2);
		$(this.id).css('top', y-height/2);
		$(this.id).css('overflow', 'hidden');
		$(this.id).css('width', width);
		$(this.id).css('height', height);
		$(this.id).css('-webkit-transform', 'rotate('+this.angle+'deg)');
		$(this.id).css('-moz-transform', 'rotate('+this.angle+'deg) scale(0)');
		$(this.id).css('zoom', 0);
		$(this.id).css('display', 'block');
	};
	particle.prototype = {
		id_name: function() { return '#particlejs-'+this.id; },
		destroyed: false,
		destroy: function(){
			$(this.id).remove();
			this.destroyed = true;
		},
		update: function(){
			if(this.destroyed) return;
			
			$(this.id).css('zoom', (this.age/20));
			$(this.id).css('-moz-transform', 'rotate('+this.angle+'deg) scale('+(this.age/20)+')');
			this.age++;

			function to_radians(degrees) { return degrees * Math.PI / 180; }
			function to_degrees(radians) { return ((radians * 180 / Math.PI)+360)%360; }

			// calculate the movement
			var xinc = this.speed*Math.cos(to_radians(this.angle));
			var yinc = this.speed*Math.sin(to_radians(this.angle));
			var pos = $(this.id).offset();
			var newpos = {
				left: pos.left + xinc,
				top: pos.top + yinc
			};
			
			// move the particle
			$(this.id).offset(newpos);
			this.life++;

			// make sure it's still on the screen
			var on_the_screen = true;
			if(newpos.left < 0 || newpos.top < 0) on_the_screen = false;
			if(newpos.left >= $(window).width()) on_the_screen = false;
			if(newpos.top  >= $(window).height()) on_the_screen = false;
			if(on_the_screen) {
				return true;
			} else {
				return false;
			}
		}
	};

	// keep track of particles
	var particle_count = 0;
	var particles = [];

	// launch a particle
	this.launch = function() {
		var hex_digits = ['6','7','8','9','a','b','c','d','e','f'];
		var color = '#';
		for(var i=0; i<6; i++)
			color += hex_digits[Math.floor(Math.random()%hex_digits.length)];
		particles.push(new particle({
			id: particle_count,
			width: 100,
			height: 100,
			//html: '<img src="http://www.textually.org/tv/archives/images/set3/test-pattern-clock_4767.jpg" style="width:100px;height:100px;" />'
			html: '<h1 style="color:'+color+'">'+particle_count+'</h1>'
		}));
		particle_count++;
	}

	// launch a 5 times a second
	setInterval(function(){
		var count = Math.floor(Math.random()*10);
		for(var i=0; i<count; i++) this.launch();
	}, 100);

	// update loop
	this.update_loop = function() {
		var to_remove = [];
		// update all the particles
		for(var i in particles) {
			if(particles[i]) {
				particles[i].update();
				if(!particles[i].update()) {
					to_remove.push(i);
				}
			}
		}
		// remove any that are off the screen
		removed = 0;
		for(var i in to_remove) {
			particles[to_remove[i-removed]].destroy();
			particles.splice(to_remove[i-removed], 1);
			removed++;
		}
		setTimeout(this.update_loop, 10);
	}

	// run the update loop
	this.update_loop();
}
