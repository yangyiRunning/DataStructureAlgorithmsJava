-- 182. 查找重复的电子邮箱
-- https://leetcode.cn/problems/duplicate-emails/
-- yangyi 2022年08月12日14:18:41
select Email from Person group by Email having count(Email) > 1