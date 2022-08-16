-- 177. 第N高的薪水
-- https://leetcode.cn/problems/nth-highest-salary/
-- yangyi 2022年08月12日11:21:59
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  set n = n - 1;
  RETURN (
      select (select distinct salary from Employee order by salary DESC limit 1 offset n)
  );
END