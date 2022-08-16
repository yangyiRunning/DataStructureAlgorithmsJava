-- 584. 寻找用户推荐人
-- https://leetcode.cn/problems/find-customer-referee/
-- yangyi 2022年08月15日11:28:30
select name from customer
where referee_id <> 2
or referee_id is null