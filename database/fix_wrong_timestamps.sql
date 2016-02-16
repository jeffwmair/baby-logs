alter table baby_sleep drop index const_uk;
update baby_sleep set start = addtime(start, '1:00'), end = addtime(end, '1:00'), babyid = babyid, id = id;
alter table baby_sleep add constraint const_uk unique (start);
update baby_keyval set time = addtime(time, '1:00');