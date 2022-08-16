-- 181. 超过经理收入的员工
-- https://leetcode.cn/problems/employees-earning-more-than-their-managers/
-- yangyi 2022年08月12日12:15:42
select a.name as 'Employee' from Employee as a, Employee as b where a.managerId = b.id and a.salary > b.salary