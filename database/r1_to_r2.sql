create table json_objects (
    json_key varchar(200) PRIMARY KEY,
    babyid INT(4) NOT NULL,
    json_content text NOT NULL,
    constraint const_uk_json_objects UNIQUE (json_key, babyid)
);
