-- 1757. 可回收且低脂的产品
-- https://leetcode.cn/problems/recyclable-and-low-fat-products/
-- yangyi 2022年08月15日11:37:47
select product_id from Products
where low_fats = 'Y'
and recyclable = 'Y'