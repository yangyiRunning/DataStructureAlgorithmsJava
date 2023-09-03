-- 620. 有趣的电影
-- https://leetcode.cn/problems/not-boring-movies/
-- yangyi 2022年08月15日17:08:21
select *
from cinema
where description <> 'boring'
and mod(id, 2) <> 0
order by rating DESC