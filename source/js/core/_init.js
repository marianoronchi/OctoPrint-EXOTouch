EXOTouch.prototype.core.init = function() {

	// Migrate old cookies into localstorage
	this.DOM.storage.migration.call(this);

	// Bootup EXOTouch if Touch, Small resolution or storage say's so
	if (this.core.boot.call(this)) {

		// Send Touchscreen loading status
		if (window.top.postMessage) {
			window.top.postMessage("loading", "*");
			
			$(window).on("error.EXOTouch", function(event) {
				window.top.postMessage([event.originalEvent.message, event.originalEvent.filename], "*");
			});
		}

		// Attach id for EXOTouch styling
		$("html").attr("id", this.settings.id);

		// Force mobile browser to set the window size to their format
		$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
		$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
		$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");

		this.isActive(true);

		// Enforce active cookie
		this.DOM.storage.set("active", true);

		// Create keyboard cookie if not existing
		if (this.DOM.storage.get("keyboardActive") === undefined) {
			if (!this.settings.hasTouch) {
				this.DOM.storage.set("keyboardActive", true);
			} else {
				this.DOM.storage.set("keyboardActive", false);
			}
		}

		// Create hide navbar on click if not existing
		if (this.DOM.storage.get("hideNavbarActive") === undefined) {
			this.DOM.storage.set("hideNavbarActive", false);
		}

		// Treat KWEB3 as a special Touchscreen mode or enabled by cookie
		if ((this.settings.isEpiphanyOrKweb || this.settings.isChromiumArm && this.DOM.storage.get("touchscreenActive") === undefined) || this.DOM.storage.get("touchscreenActive")) {
			this.components.touchscreen.init.call(this);
		}

		// Create fullscreen cookie if not existing and trigger pNotification
		if (this.DOM.storage.get("fullscreen") === undefined) {
			this.DOM.storage.set("fullscreen", false);
			this.components.fullscreen.ask.call(this);
		} else {
			//Cookie say user wants fullscreen, ask it!
			if(this.DOM.storage.get("fullscreen")) {
				this.components.fullscreen.ask.call(this);
			}
		}

		// Get state of cookies and store them in KO
		this.components.keyboard.isActive(this.DOM.storage.get("keyboardActive"));
		this.animate.isHidebarActive(this.DOM.storage.get("hideNavbarActive"));
		this.settings.isFullscreen(this.DOM.storage.get("fullscreen"));

	}

}
