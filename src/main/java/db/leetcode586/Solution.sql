-- 586. 订单最多的客户
-- https://leetcode.cn/problems/customer-placing-the-largest-number-of-orders/
-- yangyi 2022年08月15日16:54:27
select customer_number
from Orders
group by customer_number
order by count(customer_number) DESC
limit 1