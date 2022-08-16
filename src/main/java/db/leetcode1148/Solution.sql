-- 1148. 文章浏览 I
-- https://leetcode.cn/problems/article-views-i/
-- yangyi 2022年08月16日17:20:22
select distinct author_id as id
from Views
where author_id = viewer_id
order by author_id