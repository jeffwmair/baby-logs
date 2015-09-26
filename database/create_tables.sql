create table baby_sleep (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	start TIMESTAMP NOT NULL,
	end TIMESTAMP NULL
);

create table baby_value_entry(
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	time TIMESTAMP NOT NULL,
	entry_type varchar(10) NOT NULL,
	entry_value varchar(2) NOT NULL
);
