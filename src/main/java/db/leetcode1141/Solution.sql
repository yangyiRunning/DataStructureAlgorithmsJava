-- 1141. 查询近30天活跃用户数
-- https://leetcode.cn/problems/user-activity-for-the-past-30-days-i/
-- yangyi 2022年08月19日16:02:56
select activity_date as day, count(distinct user_id) as active_users
from Activity
where datediff('2019-07-27', activity_date) > 0 and datediff('2019-07-27', activity_date) < 30
group by activity_date