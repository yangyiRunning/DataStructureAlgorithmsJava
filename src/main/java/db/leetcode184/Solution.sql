-- 184. 部门工资最高的员工
-- https://leetcode.cn/problems/department-highest-salary/
-- yangyi 2022年08月19日18:30:24
select d.name as 'Department', e.name as 'Employee', e.salary as Salary
from Employee as e
left join Department as d on e.departmentId = d.id
where (e.departmentId, e.salary) in (
select departmentId, max(salary)
from Employee
group by departmentId
)