function starfield(opts) {
	// a single particle
	var particle = function(opts){
		this.id = '#starfield-particle-'+opts.id;
		this.age = 0;
		this.speed = 5+Math.random()*7;
		this.angle = Math.random()*360;
		width = opts.width;
		height = opts.height;
		x = $(window).width()/2;
		y = $(window).height()/2;
		
		$(body).append('<div id="'+this.id+'" style="display:none">'+opts.html+'</div>');
		$(this.id).css('text-align', 'center');
		$(this.id).css('position', 'absolute');
		$(this.id).css('left', x-width/2);
		$(this.id).css('top', y-height/2);
		$(this.id).css('overflow', 'hidden');
		$(this.id).css('width', width);
		$(this.id).css('height', height);
		$(this.id).css('-webkit-transform', 'rotate('+this.angle+'deg)');
		$(this.id).css('-moz-transform', 'rotate('+this.angle+'deg)');
		$(this.id).css('display', 'block');
	};
	particle.prototype = {
		destroy: function(){ $(this.id).remove(); },
		update: function(){
			function to_radians(degrees) { return degrees * Math.PI / 180; }
			function to_degrees(radians) { return ((radians * 180 / Math.PI)+360)%360; }

			// calculate the movement
			var xinc = this.speed*Math.cos(to_radians(this.angle));
			var yinc = this.speed*Math.sin(to_radians(this.angle));
			var x = $(this.id).css('left');
			var y = $(this.id).css('top');
			var newx = x + xinc;
			var newy = y + yinc;

			// make sure it's still on the screen
			var on_the_screen = true;
			if(newx < 0 || newy < 0) on_the_screen = false;
			if(newx + $(this.id).css('width') >= $(window).width()) on_the_screen = false;
			if(newy + $(this.id).css('height') >= $(window).height()) on_the_screen = false;
			if(on_the_screen) {
				// move the particle
				$(this.id).css('left', newx);
				$(this.id).css('top', newy);
				this.life++;
				return true;
			} else {
				// destroy the particle
				this.destroy();
				return false;
			}
		}
	};

	// keep track of particles
	var particle_count = 0;
	var particles = [];

	// launch a particle
	function launch() {
		particles.append(new particle({
			id: particle_count,
			width: 100,
			height: 100,
			html: '<img src="http://www.textually.org/tv/archives/images/set3/test-pattern-clock_4767.jpg" style="width:100px;height:100px;" />'
		}));
		particle_count++;
	}


}
