-- 627. 变更性别
-- https://leetcode.cn/problems/swap-salary/
-- yangyi 2022年08月15日16:29:47
update Salary
set sex =
case
when sex = 'm' then 'f'
else 'm'
end