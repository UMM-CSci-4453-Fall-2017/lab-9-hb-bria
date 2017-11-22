drop procedure if exists myprocedure;

delimiter //

create procedure myprocedure(IN user text)
begin
  insert into Tony.archive_items select (select id from trans_id), user, invID, amount, label, price from Tony.current_trans;
  update Tony.trans_id set id = id + 1;
end
//

delimiter ;
