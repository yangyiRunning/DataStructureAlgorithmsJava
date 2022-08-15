-- 1873. 计算特殊奖金
-- https://leetcode.cn/problems/calculate-special-bonus/
-- yangyi 2022年08月15日16:08:03
select
employee_id,
case
when mod(employee_id, 2) <> 0 and left(name, 1) <> 'M' then salary
else 0
end as bonus
from Employees
order by employee_id