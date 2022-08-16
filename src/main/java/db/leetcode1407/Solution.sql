-- 1407. 排名靠前的旅行者
-- https://leetcode.cn/problems/top-travellers/
-- yangyi 2022年08月16日18:00:42
select u.name,
case
when sum(r.distance) is null then 0
else sum(r.distance)
end as travelled_distance
from Users as u
left join Rides as r on u.id = r.user_id
group by r.user_id
order by travelled_distance DESC, u.name