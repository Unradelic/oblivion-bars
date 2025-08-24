const tick_rate = 0.12;
const gauge_glow_threshold = 42;

var player = null;

var health_bar = null;
var health_gauge = null;
var health_gauge_shadow = null;
var health_gauge_info = null;

var magicka_bar = null;
var magicka_gauge = null;
var magicka_gauge_shadow = null;
var magicka_gauge_info = null;

var fatigue_bar = null;
var fatigue_gauge = null;
var fatigue_gauge_shadow = null;
var fatigue_gauge_info = null;

function initialize() {
	player = {
		health: 213,
		health_capacity: 213,
		health_regen_rate: 1.3,
		health_disrupt_delay: 1.8,
		health_update_timeout: null,
		
		magicka: 137,
		magicka_capacity: 137,
		magicka_regen_rate: 1.8,
		magicka_disrupt_delay: 1.8,
		magicka_update_timeout: null,
		
		fatigue: 113,
		fatigue_capacity: 113,
		fatigue_regen_rate: 2.9,
		fatigue_disrupt_delay: 1.8,
		fatigue_update_timeout: null,
		
		active_statuses: []
	};
	
	health_bar = document.querySelector('health-bar');
	health_gauge = health_bar.querySelector(".gauge-points");
	health_gauge_shadow = health_bar.querySelector(".gauge-shadow-points");
	health_gauge_info = {
		current: document.querySelector('#health gauge-current'),
		capacity: document.querySelector('#health gauge-capacity')
	};
	
	magicka_bar = document.querySelector('magicka-bar');
	magicka_gauge = magicka_bar.querySelector(".gauge-points");
	magicka_gauge_shadow = magicka_bar.querySelector(".gauge-shadow-points");
	magicka_gauge_info = {
		current: document.querySelector('#magicka gauge-current'),
		capacity: document.querySelector('#magicka gauge-capacity')
	};
	
	fatigue_bar = document.querySelector('fatigue-bar');
	fatigue_gauge = fatigue_bar.querySelector(".gauge-points");
	fatigue_gauge_shadow = fatigue_bar.querySelector(".gauge-shadow-points");
	fatigue_gauge_info = {
		current: document.querySelector('#fatigue gauge-current'),
		capacity: document.querySelector('#fatigue gauge-capacity')
	};
	
	draw_health_gauge();
	draw_magicka_gauge();
	draw_fatigue_gauge();
}
function toggle_gauge_mode() {
	let body_element = document.querySelector('body');
	if (body_element.classList.contains("enable-alternative-gauge")) {
		body_element.classList.remove("enable-alternative-gauge");
	}
	else {
		body_element.classList.add("enable-alternative-gauge");
	}
}
function toggle_gauge_stack() {
	
	let body_element = document.querySelector('body');
	if (body_element.classList.contains("enable-stack-gauges")) {
		body_element.classList.remove("enable-stack-gauges");
	}
	else {
		body_element.classList.add("enable-stack-gauges");
	}
}

// Health functions
function draw_health_gauge(with_transition = false) {
	if (with_transition) {
		health_gauge.classList.add("gauge-transition");
		health_gauge_shadow.classList.add("gauge-transition");
	} else {
		health_gauge.classList.remove("gauge-transition");
		health_gauge_shadow.classList.remove("gauge-transition");
	}
	let health_percentage = player.health / player.health_capacity * 100;
	if (health_percentage < gauge_glow_threshold) {
		health_bar.classList.add("gauge-low");
	}
	else {
		health_bar.classList.remove("gauge-low");
	}
	health_gauge.style = `width: ${health_percentage}%`;
	health_gauge_shadow.style = `width: ${health_percentage}%`;
	health_gauge_info.current.innerText = Math.floor(player.health)
	health_gauge_info.capacity.innerText = Math.floor(player.health_capacity)
}
function tick_health_regen() {
	player.health += player.health_regen_rate * tick_rate;
	if (player.health >= player.health_capacity) {
		player.health = player.health_capacity;
		draw_health_gauge();
		return;
	}
	console.log(player.health);
	draw_health_gauge();
	player.health_update_timeout = setTimeout(tick_health_regen, tick_rate * 1000);
}
function damage_health(amount) {
	if (player.health_update_timeout) {
		clearTimeout(player.health_update_timeout);
	}
	player.health -= amount;
	if (player.health < 0) {
		player.health = 0;
	}
	console.log(player.health);
	draw_health_gauge(true);
	player.health_update_timeout = setTimeout(
		tick_health_regen, player.health_disrupt_delay * 1000
	);
}
function fortify_health(amount, duration, cost=0) {
	if (cost > 0 && player.magicka < cost) {
		return;
	}
	else if (cost > 0) {
		damage_magicka(cost);
	}
	player.health += amount;
	player.health_capacity += amount;
	draw_health_gauge();
	setTimeout(() => {
		player.health -= amount;
		player.health_capacity -= amount;
		if (player.health < 0) {
			player.health = 0;
		}
		draw_health_gauge();
	}, duration*1000)
}

// Magicka functions
function draw_magicka_gauge(with_transition = false) {
	if (with_transition) {
		magicka_gauge.classList.add("gauge-transition");
		magicka_gauge_shadow.classList.add("gauge-transition");
	} else {
		magicka_gauge.classList.remove("gauge-transition");
		magicka_gauge_shadow.classList.remove("gauge-transition");
	}
	let magicka_percentage = player.magicka / player.magicka_capacity * 100;
	if (magicka_percentage < gauge_glow_threshold) {
		magicka_bar.classList.add("gauge-low");
	}
	else {
		magicka_bar.classList.remove("gauge-low");
	}
	magicka_gauge.style = `width: ${magicka_percentage}%`;
	magicka_gauge_shadow.style = `width: ${magicka_percentage}%`;
	magicka_gauge_info.current.innerText = Math.floor(player.magicka)
	magicka_gauge_info.capacity.innerText = Math.floor(player.magicka_capacity)
}
function tick_magicka_regen() {
	player.magicka += player.magicka_regen_rate * tick_rate;
	if (player.magicka >= player.magicka_capacity) {
		player.magicka = player.magicka_capacity;
		draw_magicka_gauge();
		return;
	}
	console.log(player.magicka);
	draw_magicka_gauge();
	player.magicka_update_timeout = setTimeout(tick_magicka_regen, tick_rate * 1000);
}
function damage_magicka(amount) {
	if (player.magicka_update_timeout) {
		clearTimeout(player.magicka_update_timeout);
	}
	player.magicka -= amount;
	if (player.magicka < 0) {
		player.magicka = 0;
	}
	console.log(player.magicka);
	draw_magicka_gauge(true);
	player.magicka_update_timeout = setTimeout(
		tick_magicka_regen, player.magicka_disrupt_delay * 1000
	);
}
function fortify_magicka(amount, duration) {
	player.magicka += amount;
	player.magicka_capacity += amount;
	draw_magicka_gauge();
	setTimeout(() => {
		player.magicka -= amount;
		player.magicka_capacity -= amount;
		if (player.magicka < 0) {
			player.magicka = 0;
		}
		draw_magicka_gauge();
	}, duration*1000)
}

// Fatigue functions
function draw_fatigue_gauge(with_transition = false) {
	if (with_transition) {
		fatigue_gauge.classList.add("gauge-transition");
		fatigue_gauge_shadow.classList.add("gauge-transition");
	} else {
		fatigue_gauge.classList.remove("gauge-transition");
		fatigue_gauge_shadow.classList.remove("gauge-transition");
	}
	let fatigue_percentage = player.fatigue / player.fatigue_capacity * 100;
	if (fatigue_percentage < gauge_glow_threshold) {
		fatigue_bar.classList.add("gauge-low");
	}
	else {
		fatigue_bar.classList.remove("gauge-low");
	}
	fatigue_gauge.style = `width: ${fatigue_percentage}%`;
	fatigue_gauge_shadow.style = `width: ${fatigue_percentage}%`;
	fatigue_gauge_info.current.innerText = Math.floor(player.fatigue)
	fatigue_gauge_info.capacity.innerText = Math.floor(player.fatigue_capacity)
}
function tick_fatigue_regen() {
	player.fatigue += player.fatigue_regen_rate * tick_rate;
	if (player.fatigue >= player.fatigue_capacity) {
		player.fatigue = player.fatigue_capacity;
		draw_fatigue_gauge();
		return;
	}
	console.log(player.fatigue);
	draw_fatigue_gauge();
	player.fatigue_update_timeout = setTimeout(tick_fatigue_regen, tick_rate * 1000);
}
function damage_fatigue(amount) {
	if (player.fatigue_update_timeout) {
		clearTimeout(player.fatigue_update_timeout);
	}
	player.fatigue -= amount;
	if (player.fatigue < 0) {
		player.fatigue = 0;
	}
	console.log(player.fatigue);
	draw_fatigue_gauge(true);
	player.fatigue_update_timeout = setTimeout(
		tick_fatigue_regen, player.fatigue_disrupt_delay * 1000
	);
}
function fortify_fatigue(amount, duration) {
	player.fatigue += amount;
	player.fatigue_capacity += amount;
	draw_fatigue_gauge();
	setTimeout(() => {
		player.fatigue -= amount;
		player.fatigue_capacity -= amount;
		if (player.fatigue < 0) {
			player.fatigue = 0;
		}
		draw_fatigue_gauge();
	}, duration*1000)
}
