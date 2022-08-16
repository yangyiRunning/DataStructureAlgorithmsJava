-- 180. 连续出现的数字
-- https://leetcode.cn/problems/consecutive-numbers/
-- yangyi 2022年08月12日11:57:57
select distinct a.num as ConsecutiveNums from Logs a, Logs as b, Logs as c where a.id = b.id - 1 and b.id = c.id - 1 and a.num = b.num and b.num = c.num