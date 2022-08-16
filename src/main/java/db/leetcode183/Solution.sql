-- 183. 从不订购的客户
-- https://leetcode.cn/problems/customers-who-never-order/
-- yangyi 2022年08月12日14:39:46
select Customers.name as 'Customers' from Customers left join Orders on Customers.id = Orders.CustomerId where Orders.CustomerId is null