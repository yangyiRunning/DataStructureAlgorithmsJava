-- 608. 树节点
-- https://leetcode.cn/problems/tree-node/
-- yangyi 2022年08月16日15:04:09
select id,
case
when id = (select id from tree where p_id is null) then 'Root'
when id in (select p_id from tree) then 'Inner'
else 'Leaf'
end as Type
from tree
order by id