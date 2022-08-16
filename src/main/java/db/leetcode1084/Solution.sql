-- 1084. 销售分析III
-- https://leetcode.cn/problems/sales-analysis-iii/
-- yangyi 2022年08月16日15:27:00
select p.product_id, p.product_name
from Product as p
left join Sales as s on p.product_id = s.product_id
group by s.product_id
having min(sale_date) >= '2019-01-01' and max(sale_date) <= '2019-03-31'