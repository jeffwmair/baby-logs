create table baby_sleep (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	babyid INT(6),
	start TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	end TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	constraint const_uk UNIQUE (start)
);

create table baby_keyval(
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	babyid INT(6),
	time TIMESTAMP NOT NULL,
	entry_type varchar(10) NOT NULL,
	entry_value varchar(8) NOT NULL,
	constraint const_uk_babykeyval UNIQUE (time, entry_type, entry_value)
);

create table baby_log(
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	time TIMESTAMP NOT NULL,
	log_type varchar(10) NOT NULL,
	message varchar(1000) NOT NULL
);
