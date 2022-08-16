-- 607. 销售员
-- https://leetcode.cn/problems/sales-person/
-- yangyi 2022年08月16日14:46:18
select SalesPerson.name
from SalesPerson
where sales_id not in (select sales_id
from Orders as o
left join Company as c on o.com_id = c.com_id where c.name = 'RED')