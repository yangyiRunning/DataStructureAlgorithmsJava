-- 1527. 患某种疾病的患者
-- https://leetcode.cn/problems/patients-with-a-condition/
-- yangyi 2022年08月16日12:02:21
select *
from Patients
where conditions like 'DIAB1%' or conditions like '% DIAB1%'