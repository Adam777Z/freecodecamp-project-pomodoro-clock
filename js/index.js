const projectName = 'pomodoro-clock';
localStorage.setItem('example_project', 'Pomodoro Clock');

var type = 'session';
var time = { session: new Date(0, 0, 0, 0, 25), break: new Date(0, 0, 0, 0, 5) };
var timer = false;
var beep = $('#beep')[0];

function startTimer() {
	$('#start_stop').html('Stop');

	timer = setInterval(function() {
		if (time[type].getSeconds() === 0 && time[type].getMinutes() === 0 && time[type].getHours() === 0) {
			beep.play();
			time[type] = new Date(0, 0, 0, 0, parseInt($('#'+type+'-length').html()));
			switchType();
		} else {
			time[type].setSeconds(time[type].getSeconds()-1);
		}

		$('#time-left').html((time[type].getHours() === 1 ? 60 : pad(time[type].getMinutes())) + ':' + pad(time[type].getSeconds()));
	}, 1000);
}

function stopTimer() {
	$('#start_stop').html('Start');
	
	clearInterval(timer);
	timer = false;
}

function switchType() {
	type = (type == 'session' ? 'break' : 'session');
	$('#timer-label').html(type.charAt(0).toUpperCase() + type.substr(1));
}

function handleOperation(typeThis, operator) {
	let value = (operator == '+' ? (time[typeThis].getHours() === 1 ? 61 : time[typeThis].getMinutes()+1) : (time[typeThis].getHours() === 1 ? -1 : time[typeThis].getMinutes()-1));
	let acceptedValue = (operator == '+' ? value <= 60 : value > 0 || value === -1);

	if (acceptedValue) {
		time[typeThis].setMinutes(value);

		if ($('#timer-label').html().toLowerCase() == typeThis) {
			$('#time-left').html((time[typeThis].getHours() === 1 ? 60 : pad(time[typeThis].getMinutes())) + ':' + pad(time[typeThis].getSeconds()));
		}

		$('#'+typeThis+'-length').html(time[typeThis].getHours() === 1 ? 60 : time[typeThis].getMinutes());
		
		if ((time[typeThis].getHours() === 1 ? 60 : time[typeThis].getMinutes()) === 1) {
			$('#'+typeThis+'-unit').html('minute');
		} else {
			$('#'+typeThis+'-unit').html('minutes');
		}
	}
}

function stopBeep() {
	if (!beep.paused) {
		beep.pause();
		beep.currentTime = 0;
	}
}

function pad(n) {
	return (n < 10 ? '0'+n : n);
}

$(document).ready(function() {
	$('#reset').click(function() {
		stopBeep();
		
		if (timer) {
			stopTimer();
		}
		
		type = 'session';
		time = { session: new Date(0, 0, 0, 0, 25), break: new Date(0, 0, 0, 0, 5) };
		
		$('#timer-label').html('Session');
		$('#time-left').html('25:00');
		$('#session-length').html(25);
		$('#break-length').html(5);
	});
	
	$('#start_stop').click(function() {
		if (timer) {
			stopBeep();
			stopTimer();
		} else {
			startTimer();
		}
	});
	
	$('#session-increment').click(function() {
		handleOperation('session', '+');
	});
	
	$('#session-decrement').click(function() {
		handleOperation('session', '-');
	});
	
	$('#break-increment').click(function() {
		handleOperation('break', '+');
	});
	
	$('#break-decrement').click(function() {
		handleOperation('break', '-');
	});
});