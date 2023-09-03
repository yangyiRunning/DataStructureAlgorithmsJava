-- 595. 大的国家
-- https://leetcode.cn/problems/big-countries/
-- yangyi 2022年08月15日11:33:36
select name, population, area from World
where area >= 3000000
or population >= 25000000