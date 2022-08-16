-- 1667. 修复表中的名字
-- https://leetcode.cn/problems/fix-names-in-a-table/
-- yangyi 2022年08月16日11:09:30
select  user_id,
concat(upper(left(name, 1)), lower(substr(name, 2))) as name
from Users
order by user_id