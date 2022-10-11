const projectName = 'pomodoro-clock';
localStorage.setItem('example_project', 'Pomodoro Clock');

var type = 'session';
var time = {
	session: new Date(0, 0, 0, 0, 25),
	break: new Date(0, 0, 0, 0, 5)
};
var timer = false;
var beep;

function startTimer() {
	document.querySelector('#start_stop').textContent = 'Stop';

	timer = setInterval(function() {
		if (time[type].getSeconds() === 0 && time[type].getMinutes() === 0 && time[type].getHours() === 0) {
			beep.play();
			time[type] = new Date(0, 0, 0, 0, parseInt(document.querySelector('#' + type + '-length').textContent));
			switchType();
		} else {
			time[type].setSeconds(time[type].getSeconds() - 1);
		}

		document.querySelector('#time-left').textContent = (time[type].getHours() === 1 ? 60 : pad(time[type].getMinutes())) + ':' + pad(time[type].getSeconds());
	}, 1000);
}

function stopTimer() {
	document.querySelector('#start_stop').textContent = 'Start';

	clearInterval(timer);
	timer = false;
}

function switchType() {
	type = (type == 'session' ? 'break' : 'session');
	document.querySelector('#timer-label').textContent = type.charAt(0).toUpperCase() + type.substring(1);
}

function handleOperation(typeThis, operator) {
	let value = (operator == '+' ? (time[typeThis].getHours() === 1 ? 61 : time[typeThis].getMinutes() + 1) : (time[typeThis].getHours() === 1 ? -1 : time[typeThis].getMinutes() - 1));
	let acceptedValue = (operator == '+' ? value <= 60 : value > 0 || value === -1);

	if (acceptedValue) {
		time[typeThis].setMinutes(value);

		if (document.querySelector('#timer-label').textContent.toLowerCase() == typeThis) {
			document.querySelector('#time-left').textContent = (time[typeThis].getHours() === 1 ? 60 : pad(time[typeThis].getMinutes())) + ':' + pad(time[typeThis].getSeconds());
		}

		document.querySelector('#' + typeThis + '-length').textContent = (time[typeThis].getHours() === 1 ? 60 : time[typeThis].getMinutes());
		document.querySelector('#' + typeThis + '-unit').textContent = 'minute' + (((time[typeThis].getHours() === 1 ? 60 : time[typeThis].getMinutes()) > 1) ? 's' : '');
	}
}

function stopBeep() {
	if (!beep.paused) {
		beep.pause();
		beep.currentTime = 0;
	}
}

function pad(n) {
	return (n < 10 ? '0' + n : n);
}

document.addEventListener('DOMContentLoaded', (event) => {
	beep = document.querySelector('#beep');

	document.querySelector('#reset').addEventListener('click', (event2) => {
		stopBeep();

		if (timer) {
			stopTimer();
		}

		type = 'session';
		time = {
			session: new Date(0, 0, 0, 0, 25),
			break: new Date(0, 0, 0, 0, 5)
		};

		document.querySelector('#timer-label').textContent = 'Session';
		document.querySelector('#time-left').textContent = '25:00';
		document.querySelector('#session-length').textContent = '25';
		document.querySelector('#break-length').textContent = '5';
		document.querySelectorAll('#session-unit, #break-unit').forEach(e => e.textContent = 'minutes');
	});

	document.querySelector('#start_stop').addEventListener('click', (event2) => {
		if (timer) {
			stopBeep();
			stopTimer();
		} else {
			startTimer();
		}
	});

	document.querySelector('#session-increment').addEventListener('click', (event2) => {
		handleOperation('session', '+');
	});

	document.querySelector('#session-decrement').addEventListener('click', (event2) => {
		handleOperation('session', '-');
	});

	document.querySelector('#break-increment').addEventListener('click', (event2) => {
		handleOperation('break', '+');
	});

	document.querySelector('#break-decrement').addEventListener('click', (event2) => {
		handleOperation('break', '-');
	});
});