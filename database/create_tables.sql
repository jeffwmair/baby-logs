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
	entry_value varchar(2) NOT NULL
);
