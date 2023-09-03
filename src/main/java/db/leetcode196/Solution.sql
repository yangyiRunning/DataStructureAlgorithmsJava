-- 196. 删除重复的电子邮箱
-- https://leetcode.cn/problems/delete-duplicate-emails/
-- yangyi 2022年08月12日18:16:40
--# Please write a DELETE statement and DO NOT write a SELECT statement.
delete p1 from Person as p1, Person as p2
where p1.email = p2.email
and p1.id > p2.id