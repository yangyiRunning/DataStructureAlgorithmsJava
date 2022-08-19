-- 1393. 股票的资本损益
-- https://leetcode.cn/problems/capital-gainloss/
-- yangyi 2022年08月19日15:36:10
select stock_name, sum(
case when operation = 'Buy' then -price
     when operation = 'Sell' then price
end) as capital_gain_loss
from Stocks
group by stock_name