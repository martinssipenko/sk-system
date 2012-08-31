// * Stopwatch class {{{
Stopwatch = function(listener, resolution) {
	this.startTime = 0;
	this.serverTimeDiff = 0;
	this.stopTime = 0;
	this.totalElapsed = 0;
	this.started = false;
	this.listener = (listener != undefined ? listener : null);
	this.tickResolution = (resolution != undefined ? resolution : 100);
	this.tickInterval = null;
	
	// * pretty static vars
	this.onehour = 1000 * 60 * 60;
	this.onemin  = 1000 * 60;
	this.onesec  = 1000;
}
Stopwatch.prototype.start = function(sTime) {
	var delegate = function(that, method) { return function() { return method.call(that) } };
	if(!this.started) {
		this.startTime = sTime;
		this.stopTime = 0;
		this.started = true;
		this.tickInterval = setInterval(delegate(this, this.onTick), this.tickResolution);
	}
}
Stopwatch.prototype.getElapsed = function() {
	// * if watch is stopped, use that date, else use now
	var elapsed = 0;
    var cDate = new Date();
    elapsed = (cDate - this.startTime) - this.serverTimeDiff;
    if(cDate < this.startTime) {
        elapsed -= 1000;
    }
    
	var hours = parseInt(elapsed / this.onehour);
	elapsed %= this.onehour;
	var mins = parseInt(elapsed / this.onemin);
	elapsed %= this.onemin;
	var secs = parseInt(elapsed / this.onesec);
	var ms = elapsed % this.onesec;
	
	return {
		hours: hours,
		minutes: mins,
		seconds: secs,
		milliseconds: ms
	};
}
Stopwatch.prototype.setElapsed = function(hours, mins, secs) {
	this.reset();
	this.totalElapsed = 0;
	this.totalElapsed += hours * this.onehour;
	this.totalElapsed += mins  * this.onemin;
	this.totalElapsed += secs  * this.onesec;
	this.totalElapsed = Math.max(this.totalElapsed, 0); // * No negative numbers
}
Stopwatch.prototype.toString = function() {
	var zpad = function(no, digits) {
        no = Math.abs(no);
		no = no.toString();
		while(no.length < digits)
			no = '0' + no;
		return no;
	}
	var e = this.getElapsed();
	return zpad(e.hours,2) + ":" + zpad(e.minutes,2) + ":" + zpad(e.seconds,2) + "," + Math.abs(Math.round(e.milliseconds/100));
}
Stopwatch.prototype.setListener = function(listener) {
	this.listener = listener;
}
Stopwatch.prototype.setServerTimeDiff = function(serverTime) {
	this.serverTimeDiff = new Date() - serverTime;
}
// * triggered every <resolution> ms
Stopwatch.prototype.onTick = function() {
	if(this.listener != null) {
		this.listener(this);
	}
}
// }}}