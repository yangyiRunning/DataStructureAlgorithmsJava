## 常见数据结构与算法小结（Java语言描述）

Hello大家好我叫yangyi，是一枚Androider。这是一个数据结构和算法笔记本，**书写** 并 **整理**一些常见的数据结构和其对应的相关操作。这其中**每一个类文件都是一个可以单独运行查看结果的main方法类**，相关的关键描述和想说的话都在代码的注释中。（欢迎一同补充和完善，2019年01月04日00:07:40置为public）

1. 数组
    - [搜索二维矩阵](/src/ds/FindInDoubleArray.java)
    - [数组中重复的数据](/src/ds/RepeatInArray.java)
    - [合并两个有序数组](/src/ds/MergeArray.java)

2. 链表
    - [从尾到头打印链表](/src/ds/ReversePrintLink.java)
    - [移除链表元素](/src/ds/RemoveElements.java)
    - [删除链表中的节点](/src/ds/DeleteNode.java)
    - [删除排序链表中的重复元素](/src/ds/DeleteDuplicates.java)

3. 字符串
    - [替换字符串中的空格](/src/ds/ReplaceBlankInString.java)

4. 线性数据结构及其对应的常见算法

    1. 线性表(分别基于数组和链表实现一遍)
        - [线性表的增加（基于顺序存储的物理结构实现）](/src/ds/ListInsert.java)
        - [线性表的删除（基于顺序存储的物理结构实现）](/src/ds/ListDelete.java)
        - [线性表的插入（基于链式存储的物理结构实现）](/src/ds/LinkInsert.java)
        - [线性表的删除（基于链式存储的物理结构实现）](/src/ds/LinkDelete.java)
        - [线性表的创建（基于链式存储的物理结构）头插法和尾插法](/src/ds/LinkCreate.java)
        - [查找线性表中的某一个元素（基于链式存储的物理结构实现）](/src/ds/LinkGet.java)
        
    2. 栈
        - [顺序栈（基于数组实现的栈）](/src/ds/ArrayStack.java)
        - [链式栈（基于链表实现的栈）](/src/ds/LinkStack.java)
        - [有效的括号](/src/ds/ValidParentheses.java)
    3. 队列
        - [顺序队列（基于数组实现的队列）](/src/ds/ArrayQueue.java)
        - [链式队列（基于链表实现的队列）](/src/ds/LinkQueue.java)
        - [循环队列（基于数组成环）](/src/ds/CircleQueue.java)
        - [滑动窗口最大值](/src/ds/MaxSlidingWindow.java)
        
5. 递归（**自己调用自己，一层一层调用下去叫递，一层一层收集返回叫归**）
    - [n的阶乘](/src/ds/Factorial.java)
    - [斐波拉切数列](/src/ds/FibonacciArray.java)
    - [位于第几排问题（递归、非递归分别实现）](/src/ds/LocationRow.java)
    - [n个台阶走法问题（每次可以走1个台阶或者2个台阶）](/src/ds/OneTwoStep.java)
    
6. 分治
    - [x的n次方](/src/ds/Pow.java)

7. 排序
    - [冒泡排序](/src/ds/BubbleSort.java)
    - [插入排序](/src/ds/InsertSort.java)
    - [选择排序](/src/ds/SelectionSort.java)
    - [快速排序](/src/ds/QuickSort.java)

8. 二分查找
    - [二分查找(递归和非递归实现)](/src/ds/BinarySearch.java)
    
9. 二分查找变种
    - [查找第一个值等于给定值的元素](/src/ds/BSFirstEquals.java)
    - [查找最后一个值等于给定值的元素](/src/ds/BSEndEquals.java)
    - [查找第一个大于等于给定值的元素](/src/ds/BSFirstMore.java)
    - [查找最后一个小于等于给定值的元素](/src/ds/BSEndLess.java)
    - [x的平方根](/src/ds/MySqrt.java)
    
10. 反转
    - [反转一个数组](/src/ds/ReverseArray.java)
    - [反转一个单链表](/src/ds/ReverseLink.java)
    - [反转一颗二叉树](/src/ds/InvertTree.java)
    
11. 二叉树
    1. 二叉树
        - [二叉树的下一个节点](/src/ds/NextNodeInTree.java)
        - [相同的树](/src/ds/SameTree.java)
    2. 二叉查找树
        - [二叉查找树的插入、遍历、查找、删除、反转](/src/ds/BinarySearchTree.java)
        - [二叉树的最近公共祖先](/src/ds/TreeLowestCommonAncestor.java)
        - [二叉查找树的最近公共祖先](/src/ds/BSTreeLowestCommonAncestor.java)
        - [验证二叉搜索树(递归和非递归实现)](/src/ds/ValidBST.java)
        - [二叉搜索树中第K小的元素](/src/ds/KthSmallestInBST.java)
        
12. 有环链表
    - [判断链表是否有环](/src/ds/CycleLink.java)
    
13. 堆
    - [大顶堆、堆排序](/src/ds/BigHeap.java)
    - [TopK](/src/ds/KthLargest.java)
    
14. 散列表
    - [有效的异位词](/src/ds/ValidAnagram.java)
    - [两数之和](/src/ds/TwoSum.java)
    - [存在重复元素](/src/ds/ContainsDuplicate.java)
    
15. 求数
    - [求众数](/src/ds/MajorityElement.java)
    - [加一](/src/ds/PlusOne.java)
    
16. 贪心
    - [买卖股票的最佳时机](/src/ds/MaxProfit.java)
    
17. 搜索
    - [广度优先搜索](/src/ds/LevelPrint.java)
    - [深度优先搜索](/src/ds/DepthPrint.java)
    - [二叉树的层次遍历](/src/ds/LevelOrder.java)
    - [二叉树的最大深度(广度优先的非递归实现和深度优先的递归实现)](/src/ds/MaxDepth.java)
    - [二叉树的最小深度](/src/ds/MinDepth.java)
    
18. 图
    - [图的表示](/src/ds/Graph.java)
    
19. 剪枝
    - [数独(sudoku)](/src/ds/Sudoku.java)
    
20. LRUCache(最近最少使用缓存)
    - [LRUCache的实现](/src/ds/LRUCache.java)
    
21. 动态规划(DP)
    - [爬楼梯](/src/ds/ClimbStairs.java)
    - [三角形最小路径和](/src/ds/MinimumTotal.java)
    - [乘积最大子序列](/src/ds/MaxProduct.java)

22. 位运算
    - [位1的个数](/src/ds/HammingWeight.java)
    - [比特位计数](/src/ds/CountBits.java)
    - [只出现一次的数字](/src/ds/SingleNumber.java)
    - [缺失数字](/src/ds/MissingNumber.java)