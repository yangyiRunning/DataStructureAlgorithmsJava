-- 1587. 银行账户概要 II
-- https://leetcode.cn/problems/bank-account-summary-ii/
-- yangyi 2022年08月23日17:06:51
select u.name, sum(t.amount) as balance
from Users as u
left join Transactions as t on t.account = u.account
group by t.account
having sum(t.amount) > 10000