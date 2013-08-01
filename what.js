;(function() {

	/*
	
		#scw-buttons {
			margin: 0 0 18px 0;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: moz-none;
			-ms-user-select: none;
			user-select: none;
		}
		
		#sc-widget {
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: moz-none;
			-ms-user-select: none;
			user-select: none;
		}
		
		.scw-button {
			cursor:pointer;
			display:inline-block;
			white-space:nowrap;
			background:rgba(0,0,0,0.85);
			border:4px solid rgba(255,255,255,0.85);
			color:rgba(255,255,255,0.85);
			font-size:32px;
			transition:.25s all;
			margin:0 8px;
			border-radius:72px;
			padding:8px;
			vertical-align:middle;
			width:36px;
			height:36px;
			position:relative;
			top:6px;
		}
		
			.scw-button.large { font-size:48px; padding:14px; width:42px; height:42px; }
			.scw-button.large > span { transition:none!important; }
			.scw-button.large > span.icon-play { position:relative;top:-2px;left:4px; }
			.scw-button.large > span.icon-pause { position:relative;top:-1px;left:1px;font-size:44px; }
			
			.scw-button:not(.large) > span { position:relative;top:2px; }
			
			.scw-button:hover {
				color:rgba(255,255,255,1);
				border:4px solid rgba(255,255,255,1);
				background:rgba(0,0,0,0.95)
			}
		
	*/
	
	if (window.asdfzxvmasdfjkl !== true) {
	
		var style	= '<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"><style>#scw-buttons{-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:moz-none;-ms-user-select:none;user-select:none;margin:0 0 18px}#sc-widget{-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:moz-none;-ms-user-select:none;user-select:none}.scw-button{cursor:pointer;display:inline-block;white-space:nowrap;background:rgba(0,0,0,0.85);border:4px solid rgba(255,255,255,0.85);color:rgba(255,255,255,0.85);font-size:32px;transition:.25s all;border-radius:72px;vertical-align:middle;width:36px;height:36px;position:relative;top:6px;margin:0 8px;padding:8px}.scw-button.large{font-size:48px;width:42px;height:42px;padding:14px}.scw-button.large > span{transition:none!important}.scw-button.large > span.icon-play{position:relative;top:-2px;left:4px}.scw-button.large > span.icon-pause{position:relative;top:-1px;left:1px;font-size:44px}.scw-button:not(.large) > span{position:relative;top:2px}.scw-button:hover{color:rgba(255,255,255,1);border:4px solid rgba(255,255,255,1);background:rgba(0,0,0,0.95)}</style>',
			artist	= $('.header h2').text(),
			album	= $('.header h2 span').text(),
			query;
			
		if (document.location.href.indexOf('artist.php') > 0) query = artist; else if (document.location.href.indexOf('torrents.php') > 0) query = album;
		
		
		/* Get Track Search Result JSON */
		
		$.getJSON('http://api.soundcloud.com/tracks.json?q='+encodeURIComponent(query)+'&client_id=7568f7d549cbd2cfd5e33fc5d827afe7', function(tracks) {
		    
		    if (tracks !== null && tracks.length > 0) {
		        
		        
		        /* Load SC API */
		        
		        $.getScript('https://w.soundcloud.com/player/api.js').done(function() {
		        	
		        	
		        	// Append Iframe Player
		        	
		        	var player 	= $('<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url='+encodeURIComponent(tracks[0].uri)+'" width="240" height="104" scrolling="no" frameborder="no" style="position:relative;left:5px;margin-bottom:12px;user-select:none;"></iframe>'),
		        		buttons	= $('<div id="scw-buttons" align="center"></div>'),
		        		play	= $('<div id="scw-play" class="scw-button large"><span class="icon-play"></span></div>'),
		        		next	= $('<div id="scw-next" class="scw-button"><span class="icon-step-forward"></span></div>'),
		        		prev	= $('<div id="scw-prev" class="scw-button"><span class="icon-step-backward"></span></div>');
		        		
		        		player.insertBefore('.sidebar > .box:first-of-type'), buttons.append(prev).append(play).append(next), $(style).appendTo('head');
		        		
		        		buttons.insertBefore('#sc-widget');
		        		
		        	
		        	// Loading Declarations
		        	
		        	var widget	= SC.Widget('sc-widget'),
		        		current	= 0;
		        	
		        	
		        	
		        	/* Widget Ready */	
		        	
		        	widget.bind(SC.Widget.Events.READY, function() {
		
		        		
		        		// Autoplay
		        		
		        		widget.bind(SC.Widget.Events.FINISH, function() {
		        			++current, widget.load(tracks[current].uri);
		        			if (typeof tracks[current] === undefined) --current;
		        		});
		        		
		        		
		        		// Bindings
		        		
		        		$('#scw-play').on('click', function() {
		        			if ($(this).hasClass('pause')) {
		        				widget.pause();
		        				$(this).removeClass('pause').find('span').removeClass('icon-pause').addClass('icon-play');
		        			} else {
		        				widget.play();
		        				$(this).addClass('pause').find('span').removeClass('icon-play').addClass('icon-pause');
		        			}
		        		});
		        		
		        		$('#scw-next').on('click', function() { 
		        			++current, widget.load(tracks[current].uri, { callback: function() { widget.play(), $('#scw-play').addClass('pause').find('span').removeClass('icon-play').addClass('icon-pause'); } });
		        			if (typeof tracks[current] === undefined) --current;
		        		});
		        		
		        		$('#scw-prev').on('click', function() { 
		        			--current, widget.load(tracks[current].uri, { callback: function() { widget.play(), $('#scw-play').addClass('pause').find('span').removeClass('icon-play').addClass('icon-pause'); } });
		        			if (typeof tracks[current] === undefined) ++current;
		        		});
		        		
		        		//widget.play();
		        		
		        		
		        	});
		        	
		        });
		        
		    }
		    
		});
	
		window.asdfzxvmasdfjkl = true;
		
	}

})(window);