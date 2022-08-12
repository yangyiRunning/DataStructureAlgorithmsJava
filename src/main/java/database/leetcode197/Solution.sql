-- 197. 上升的温度
-- https://leetcode.cn/problems/rising-temperature/
-- yangyi 2022年08月12日18:30:44
select w1.id from Weather as w1, Weather as w2
where datediff(w1.recordDate, w2.recordDate) = 1
and w1.temperature > w2.temperature