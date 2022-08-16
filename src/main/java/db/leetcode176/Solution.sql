-- 176. 第二高的薪水
-- https://leetcode.cn/problems/second-highest-salary/
-- @author yangyi 2022年08月12日11:05:46s
select (select distinct salary from Employee order by salary DESC limit 1 offset 1) as SecondHighestSalary