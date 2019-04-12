## 常见数据结构与算法小结（Java语言描述）

Hello大家好我叫yangyi，是一枚Androider。这是一个数据结构和算法笔记本，**书写** 并 **整理**一些常见的数据结构和其对应的相关操作。这其中**每一个类文件都是一个可以单独运行查看结果的main方法类**，相关的关键描述和想说的话都在代码的注释中。（欢迎一同补充和完善，2019年01月04日00:07:40置为public）

1. 数组
    - [搜索二维矩阵](/src/main/java/ds/FindInDoubleArray.java)
    - [数组中重复的数据](/src/main/java/ds/RepeatInArray.java)
    - [合并两个有序数组](/src/main/java/ds/MergeArray.java)
    - [删除排序数组中的重复项](/src/main/java/ds/RemoveDuplicates.java)
    - [旋转数组](/src/main/java/ds/RotateArray.java)
    - [有序数组的平方](/src/main/java/ds/SortedSquares.java)
    - [寻找数组的中心索引](/src/main/java/ds/PivotIndex.java)
    - [移动零](/src/main/java/ds/MoveZeroes.java)
    - [打乱数组](/src/main/java/ds/ShuffleArray.java)
    - [两个数组的交集II](/src/main/java/ds/Intersect.java)
    - [递增的三元子序列](/src/main/java/ds/IncreasingTriplet.java)
    - [除自身以外数组的乘积](/src/main/java/ds/ProductExceptSelf.java)
    - [存在重复元素II](/src/main/java/ds/ContainsNearbyDuplicate.java)

2. 链表
    - [从尾到头打印链表](/src/main/java/ds/ReversePrintLink.java)
    - [移除链表元素](/src/main/java/ds/RemoveElements.java)
    - [删除链表中的节点](/src/main/java/ds/DeleteNode.java)
    - [删除排序链表中的重复元素](/src/main/java/ds/DeleteDuplicates.java)
    - [判断链表是否有环](/src/main/java/ds/CycleLink.java)

3. 字符串
    - [替换字符串中的空格](/src/main/java/ds/ReplaceBlankInString.java)
    - [Fizz Buzz](/src/main/java/ds/FizzBuzz.java)
    - [验证回文字符](/src/main/java/ds/ValidPalindromeString.java)
    - [最后一个单词的长度](/src/main/java/ds/LengthOfLastWord.java)
    - [最常见的单词](/src/main/java/ds/MostCommonWord.java)
    - [字符串中的第一个唯一字符](/src/main/java/ds/FirstUniqChar.java)
    - [根据字符出现频率排序](/src/main/java/ds/FrequencySort.java)
    - [验证回文串](/src/main/java/ds/PalindromeI.java)
    - [分割回文串](/src/main/java/ds/Partition.java)
    - [单词拆分](/src/main/java/ds/WordBreak.java)

4. 线性数据结构及其对应的常见算法

    1. 线性表(分别基于数组和链表实现一遍)
        - [线性表的增加（基于顺序存储的物理结构实现）](/src/main/java/ds/ListInsert.java)
        - [线性表的删除（基于顺序存储的物理结构实现）](/src/main/java/ds/ListDelete.java)
        - [线性表的插入（基于链式存储的物理结构实现）](/src/main/java/ds/LinkInsert.java)
        - [线性表的删除（基于链式存储的物理结构实现）](/src/main/java/ds/LinkDelete.java)
        - [线性表的创建（基于链式存储的物理结构）头插法和尾插法](/src/main/java/ds/LinkCreate.java)
        - [查找线性表中的某一个元素（基于链式存储的物理结构实现）](/src/main/java/ds/LinkGet.java)
        
    2. 栈
        - [顺序栈（基于数组实现的栈）](/src/main/java/ds/ArrayStack.java)
        - [链式栈（基于链表实现的栈）](/src/main/java/ds/LinkStack.java)
        - [有效的括号](/src/main/java/ds/ValidParentheses.java)
        - [用两个栈实现一个队列](/src/main/java/ds/MyQueue.java)
        
    3. 队列
        - [顺序队列（基于数组实现的队列）](/src/main/java/ds/ArrayQueue.java)
        - [链式队列（基于链表实现的队列）](/src/main/java/ds/LinkQueue.java)
        - [循环队列（基于数组成环）](/src/main/java/ds/CircleQueue.java)
        - [滑动窗口最大值](/src/main/java/ds/MaxSlidingWindow.java)
        - [用两个队列实现一个栈](/src/main/java/ds/MyStack.java)
        
5. 递归（**自己调用自己，一层一层调用下去叫递，一层一层收集返回叫归**）
    - [n的阶乘](/src/main/java/ds/Factorial.java)
    - [斐波拉切数列](/src/main/java/ds/FibonacciArray.java)
    - [位于第几排问题（递归、非递归分别实现）](/src/main/java/ds/LocationRow.java)
    - [n个台阶走法问题（每次可以走1个台阶或者2个台阶）](/src/main/java/ds/OneTwoStep.java)
    
6. 分治
    - [x的n次方](/src/main/java/ds/Pow.java)

7. 排序
    - [冒泡排序](/src/main/java/ds/BubbleSort.java)
    - [插入排序](/src/main/java/ds/InsertSort.java)
    - [选择排序](/src/main/java/ds/SelectionSort.java)
    - [快速排序](/src/main/java/ds/QuickSort.java)
    - [计数排序](/src/main/java/ds/CountSort.java)

8. 二分查找
    - [二分查找(递归和非递归实现)](/src/main/java/ds/BinarySearch.java)
    
9. 二分查找变种
    - [查找第一个值等于给定值的元素](/src/main/java/ds/BSFirstEquals.java)
    - [查找最后一个值等于给定值的元素](/src/main/java/ds/BSEndEquals.java)
    - [查找第一个大于等于给定值的元素](/src/main/java/ds/BSFirstMore.java)
    - [查找最后一个小于等于给定值的元素](/src/main/java/ds/BSEndLess.java)
    - [x的平方根](/src/main/java/ds/MySqrt.java)
    
10. 反转
    - [反转一个数组](/src/main/java/ds/ReverseArray.java)
    - [反转一个单链表](/src/main/java/ds/ReverseLink.java)
    - [反转一颗二叉树](/src/main/java/ds/InvertTree.java)
    - [反转字符串](/src/main/java/ds/ReverseString.java)
    - [反转字符串中的单词III](/src/main/java/ds/ReverseWordsIII.java)
    - [转置矩阵](/src/main/java/ds/Transpose.java)
    
11. 二叉树
    1. 二叉树
        - [二叉树的下一个节点](/src/main/java/ds/NextNodeInTree.java)
        - [相同的树](/src/main/java/ds/SameTree.java)
        - [对称二叉树](/src/main/java/ds/SymmetricTree.java)
        
    2. 二叉查找树
        - [二叉查找树的插入、遍历、查找、删除、反转](/src/main/java/ds/BinarySearchTree.java)
        - [二叉树的最近公共祖先](/src/main/java/ds/TreeLowestCommonAncestor.java)
        - [二叉查找树的最近公共祖先](/src/main/java/ds/BSTreeLowestCommonAncestor.java)
        - [验证二叉搜索树(递归和非递归实现)](/src/main/java/ds/ValidBST.java)
        - [二叉搜索树中第K小的元素](/src/main/java/ds/KthSmallestInBST.java)
        - [二叉树的右视图](/src/main/java/ds/RightSideView.java)
        - [二叉树的锯齿形层次遍历](/src/main/java/ds/ZigzagLevelOrder.java)
        
12. 堆
    - [大顶堆、堆排序](/src/main/java/ds/BigHeap.java)
    - [TopK](/src/main/java/ds/KthLargest.java)
    - [数组中的第K个最大元素](/src/main/java/ds/FindKthLargest.java)
    - [前K个高频元素](/src/main/java/ds/TopKFrequent.java)
    - [前K个高频单词](/src/main/java/ds/TopKWord.java)
    
13. 散列表
    - [有效的异位词](/src/main/java/ds/ValidAnagram.java)
    - [两数之和](/src/main/java/ds/TwoSum.java)
    - [两数之和II - 输入有序数组](/src/main/java/ds/TwoSumII.java)
    - [两数之和IV - 输入BST](/src/main/java/ds/FindTargetBST.java)
    - [存在重复元素](/src/main/java/ds/ContainsDuplicate.java)
    
14. 求数
    - [求众数](/src/main/java/ds/MajorityElement.java)
    - [加一](/src/main/java/ds/PlusOne.java)
    - [Nim游戏](/src/main/java/ds/CanWinNim.java)
    - [回文数](/src/main/java/ds/Palindrome.java)
    - [猜数字游戏](/src/main/java/ds/GetHint.java)
    
15. 贪心
    - [买卖股票的最佳时机](/src/main/java/ds/MaxProfit.java)
    - [分发饼干](/src/main/java/ds/MaxProfit.java)
16. 搜索
    - [广度优先搜索](/src/main/java/ds/LevelPrint.java)
    - [深度优先搜索](/src/main/java/ds/DepthPrint.java)
    - [二叉树的层次遍历](/src/main/java/ds/LevelOrder.java)
    - [二叉树的最大深度(广度优先的非递归实现和深度优先的递归实现)](/src/main/java/ds/MaxDepth.java)
    - [二叉树的最小深度](/src/main/java/ds/MinDepth.java)
    
17. 图
    - [图的表示](/src/main/java/ds/Graph.java)
    
18. 剪枝
    - [数独(sudoku)](/src/main/java/ds/Sudoku.java)
    
19. LRUCache(最近最少使用缓存)
    - [LRUCache的实现](/src/main/java/ds/LRUCache.java)
    
20. 动态规划(DP)
    - [爬楼梯](/src/main/java/ds/ClimbStairs.java)
    - [三角形最小路径和](/src/main/java/ds/MinimumTotal.java)
    - [乘积最大子序列](/src/main/java/ds/MaxProduct.java)

21. 位运算
    - [位1的个数](/src/main/java/ds/HammingWeight.java)
    - [比特位计数](/src/main/java/ds/CountBits.java)
    - [只出现一次的数字](/src/main/java/ds/SingleNumber.java)
    - [缺失数字](/src/main/java/ds/MissingNumber.java)