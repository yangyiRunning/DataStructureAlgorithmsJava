-- 1741. 查找每个员工花费的总时间
-- https://leetcode.cn/problems/find-total-time-spent-by-each-employee/
-- yangyi 2022年08月22日14:37:39
select event_day as day, emp_id, sum(out_time - in_time) as total_time
from Employees
group by event_day, emp_id