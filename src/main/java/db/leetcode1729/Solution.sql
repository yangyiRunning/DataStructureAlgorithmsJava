-- 1729. 求关注者的数量
-- https://leetcode.cn/problems/find-followers-count/
-- yangyi 2022年08月17日00:37:21
select user_id, count(follower_id) as followers_count
from Followers
group by user_id
order by user_id