-- 1581. 进店却未进行过交易的顾客
-- https://leetcode.cn/problems/customer-who-visited-but-did-not-make-any-transactions/
-- yangyi 2022年08月16日19:15:39
select v.customer_id, count(customer_id) as count_no_trans
from Visits as v
left join Transactions as t on v.visit_id = t.visit_id
where t.amount is null
group by customer_id