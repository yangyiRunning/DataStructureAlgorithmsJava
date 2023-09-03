-- 1890. 2020年最后一次登录
-- https://leetcode.cn/problems/the-latest-login-in-2020/
-- yangyi 2022年08月19日15:04:26
select user_id, max(time_stamp) as last_stamp
from Logins
where left(time_stamp, 4) = '2020'
group by user_id