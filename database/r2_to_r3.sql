create table baby (
    id INT(6) AUTO_INCREMENT PRIMARY KEY,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    birthdate date NOT NULL,
    constraint const_uk_babyname UNIQUE (firstName, lastName)
);

alter table baby_sleep add CONSTRAINT fk_babysleep_baby FOREIGN KEY
    (babyid)  REFERENCES baby (id)
    ON DELETE cascade;
alter table baby_keyval add CONSTRAINT fk_babykv_baby FOREIGN KEY
    (babyid)  REFERENCES baby (id)
    ON DELETE cascade;
alter table json_objects add CONSTRAINT fk_json_obj_baby FOREIGN KEY
    (babyid)  REFERENCES baby (id)
    ON DELETE cascade;

drop table json_objects;