-- 1050. 合作过至少三次的演员和导演
-- https://leetcode.cn/problems/actors-and-directors-who-cooperated-at-least-three-times/
-- yangyi 2022年08月16日17:06:19
select actor_id, director_id
from ActorDirector
group by actor_id, director_id
having count(actor_id) >= 3 and count(director_id) >= 3