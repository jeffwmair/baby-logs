create table baby_sleep (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	start TIMESTAMP NOT NULL,
	end TIMESTAMP NULL,
	constraint const_uk UNIQUE (start, end)
);

create table baby_keyval(
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	time TIMESTAMP NOT NULL,
	entry_type varchar(10) NOT NULL,
	entry_value varchar(8) NOT NULL,
	constraint const_uk_babykeyval UNIQUE (time, entry_type, entry_value)
);
