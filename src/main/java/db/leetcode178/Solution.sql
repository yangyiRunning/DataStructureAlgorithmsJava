-- 178. 分数排名
-- https://leetcode.cn/problems/rank-scores/
-- yangyi 2022年08月12日11:38:32
select A.score, (select count(distinct B.score) from Scores as B where B.score >= A.score) as 'rank' from Scores as A order by A.score DESC