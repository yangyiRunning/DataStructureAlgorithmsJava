-- 596. 超过5名学生的课
-- https://leetcode.cn/problems/classes-more-than-5-students/
-- yangyi 2022年08月15日17:30:01
select class
from Courses
group by class
having count(class) >= 5