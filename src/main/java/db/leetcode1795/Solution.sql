-- 1795. 每个产品在不同商店的价格
-- https://leetcode.cn/problems/rearrange-products-table/
-- yangyi 2022年08月17日17:04:54
select product_id, 'store1' as store, store1 as price
from Products where store1 is not null
union
select product_id, 'store2' as store, store2 as price
from Products where store2 is not null
union
select product_id, 'store3' as store, store3 as price
from Products where store3 is not null