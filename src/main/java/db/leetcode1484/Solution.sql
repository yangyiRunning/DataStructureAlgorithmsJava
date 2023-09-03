-- 1484. 按日期分组销售产品
-- https://leetcode.cn/problems/group-sold-products-by-the-date/
-- yanyi 2022年08月16日11:38:09
select sell_date, count(distinct product) as num_sold, group_concat(distinct product order by product) as products
from Activities
group by sell_date