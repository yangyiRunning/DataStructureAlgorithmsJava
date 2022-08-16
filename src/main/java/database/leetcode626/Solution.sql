-- 626. 换座位
-- https://leetcode.cn/problems/exchange-seats/
-- yangyi 2022年08月16日15:36:25
# Write your MySQL query statement below
select
case
when mod(id, 2) <> 0 and counts <> id then id + 1
when mod(id, 2) <> 0 and counts = id then id
when mod(id, 2) = 0 then id - 1
end as id, student
from Seat,
(select count(id) as counts from Seat) as Seat_counts
order by id