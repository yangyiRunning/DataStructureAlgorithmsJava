-- 1965. 丢失信息的雇员
-- https://leetcode.cn/problems/employees-with-missing-information/
-- yangyi 2022年08月17日17:24:49
select e.employee_id as employee_id
from Employees as e
left join Salaries as s on e.employee_id = s.employee_id
where s.salary is null
union
select s.employee_id as employee_id
from Salaries as s
left join Employees as e on s.employee_id = e.employee_id
where e.name is null
order by employee_id