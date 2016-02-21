drop table usersession;
create table usersession (
	token INT(12) NOT NULL,
	babyid INT(6) NOT NULL,
	expiration TIMESTAMP NOT NULL,
	constraint usersession_uc UNIQUE (token),
	constraint usersession_baby FOREIGN KEY (babyid) REFERENCES baby (id)
);