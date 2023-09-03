-- 175. 组合两个表
-- https://leetcode.cn/problems/combine-two-tables/
-- @author yangyi 2022年08月12日10:58:23
select Person.FirstName, Person.LastName, Address.City, Address.State
from Person left join Address on
Person.PersonId = Address.PersonId