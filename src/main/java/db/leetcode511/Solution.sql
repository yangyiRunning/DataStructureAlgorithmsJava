-- 511. 游戏玩法分析 I
-- https://leetcode.cn/problems/game-play-analysis-i/
-- yangyi 2022年08月12日18:39:29
select player_id, min(event_date) as first_login from Activity
group by player_id