create table usersession (
	token varchar(250) NOT NULL,
	babyid INT(6) NOT NULL,
	expiration TIMESTAMP NOT NULL,
	constraint usersession_uc UNIQUE (token),
	constraint usersession_baby FOREIGN KEY (babyid) REFERENCES baby (id)
);

create table baby (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	fullname varchar(250),
	gender varchar(1),
	birthdate DATE
);

create table guardian (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	babyid INT(6),
	fullname varchar(250),
	email varchar(100),
	constraint guardian_uk UNIQUE (babyid, fullname),
	constraint guardian_email_uk UNIQUE (email),
	constraint guardian_baby_id FOREIGN KEY (babyid) REFERENCES baby (id)
);

create table baby_sleep (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	babyid INT(6),
	start TIMESTAMP NOT NULL,
	end TIMESTAMP NOT NULL,
	constraint const_uk UNIQUE (start),
	constraint baby_sleep_baby_id FOREIGN KEY (babyid) REFERENCES baby (id)
);

create table baby_keyval(
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	babyid INT(6),
	time TIMESTAMP NOT NULL,
	entry_type varchar(10) NOT NULL,
	entry_value varchar(8) NOT NULL,
	constraint const_uk_babykeyval UNIQUE (time, entry_type, entry_value),
	constraint baby_keyval_baby_id FOREIGN KEY (babyid) REFERENCES baby (id)
);

create table baby_log(
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	time TIMESTAMP NOT NULL,
	log_type varchar(10) NOT NULL,
	message varchar(1000) NOT NULL
);
