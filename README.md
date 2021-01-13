# 常见数据结构与算法小结（Java语言描述）

这是一个数据结构和算法笔记本，**书写** 并 **整理**一些常见的数据结构和其对应的相关操作。这其中**每一个类文件都是一个可以单独运行查看结果的main方法类**，相关的关键描述和想说的话都在代码的注释中。（欢迎一同补充和完善，2019年01月04日00:07:40置为public）

1. 数组
    - [搜索二维矩阵](/src/main/java/ds/FindInDoubleArray.java)
    - [数组中重复的数据](/src/main/java/ds/RepeatInArray.java)
    - [合并两个有序数组](/src/main/java/ds/MergeArray.java)
    - [旋转数组](/src/main/java/ds/RotateArray.java)
    - [有序数组的平方](/src/main/java/ds/SortedSquares.java)
    - [寻找数组的中心索引](/src/main/java/ds/PivotIndex.java)
    - [打乱数组](/src/main/java/ds/ShuffleArray.java)
    - [两个数组的交集II](/src/main/java/ds/Intersect.java)
    - [递增的三元子序列](/src/main/java/ds/IncreasingTriplet.java)
    - [除自身以外数组的乘积](/src/main/java/ds/ProductExceptSelf.java)
    - [存在重复元素II](/src/main/java/ds/ContainsNearbyDuplicate.java)
    - [存在重复元素III](/src/main/java/ds/ContainsNearbyAlmostDuplicate.java)
    - [矩阵置零](/src/main/java/ds/SetZeroes.java)
    - [最大子序和](/src/main/java/ds/MaxSubArray.java)

2. 链表
    - [从尾到头打印链表](/src/main/java/ds/link/ReversePrintLink.java)
    - [移除链表元素](/src/main/java/ds/link/RemoveElements.java)
    - [删除链表中的节点](/src/main/java/ds/link/DeleteNode.java)
    - [回文链表](/src/main/java/ds/link/PalindromeLink.java)

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
        
5. 递归
    - [n的阶乘](/src/main/java/ds/Factorial.java)
    - [斐波拉切数列](/src/main/java/ds/FibonacciArray.java)
    - [位于第几排问题（递归、非递归分别实现）](/src/main/java/ds/LocationRow.java)
    - [n个台阶走法问题（每次可以走1个台阶或者2个台阶）](/src/main/java/ds/OneTwoStep.java)
    - [输出指定路径下的所有文件名（递归、非递归分别实现）](/src/main/java/ds/FileSearch.java)
    
6. 分治
    - [x的n次方](/src/main/java/ds/Pow.java)

7. 排序
    - [冒泡排序](/src/main/java/ds/BubbleSort.java)
    - [插入排序](/src/main/java/ds/InsertSort.java)
    - [选择排序](/src/main/java/ds/SelectionSort.java)
    - [快速排序](/src/main/java/ds/QuickSort.java)
    - [计数排序](/src/main/java/ds/CountSort.java)

11. 堆
    - [大顶堆、堆排序](/src/main/java/ds/BigHeap.java)
    - [TopK](/src/main/java/ds/KthLargest.java)
    - [数组中的第K个最大元素](/src/main/java/ds/FindKthLargest.java)
    - [前K个高频元素](/src/main/java/ds/TopKFrequent.java)
    - [前K个高频单词](/src/main/java/ds/TopKWord.java)
    
12. 散列表
    - [有效的异位词](/src/main/java/ds/ValidAnagram.java)
    - [两数之和IV - 输入BST](/src/main/java/ds/FindTargetBST.java)
    - [存在重复元素](/src/main/java/ds/ContainsDuplicate.java)
    - [字典序列化](/src/main/java/ds/MapArraySerialize.java)
    
13. 求数
    - [求众数](/src/main/java/ds/MajorityElement.java)
    - [加一](/src/main/java/ds/PlusOne.java)
    - [Nim游戏](/src/main/java/ds/CanWinNim.java)
    - [回文数](/src/main/java/ds/Palindrome.java)
    - [猜数字游戏](/src/main/java/ds/GetHint.java)

14. 搜索
    - [广度优先搜索](/src/main/java/ds/LevelPrint.java)
    - [深度优先搜索](/src/main/java/ds/DepthPrint.java)
    - [二叉树的层次遍历](/src/main/java/ds/LevelOrder.java)
    - [二叉树的最大深度(广度优先的非递归实现和深度优先的递归实现)](/src/main/java/ds/MaxDepth.java)
    - [二叉树的最小深度](/src/main/java/ds/MinDepth.java)
    
15. 图
    - [图的表示](/src/main/java/ds/Graph.java)
    
16. 动态规划(DP)
    - [爬楼梯](/src/main/java/ds/dp/ClimbStairs.java)
    - [三角形最小路径和](/src/main/java/ds/dp/MinimumTotal.java)
    - [乘积最大子序列](/src/main/java/ds/dp/MaxProduct.java)
    - [斐波拉契数列的4种解法](/src/main/java/ds/dp/Fipolach.java)
    
## LeetCode

1. 反转
    - [反转一个数组](/src/main/java/ds/reverse/ReverseArray.java)
    - [反转一个单链表](/src/main/java/ds/reverse/ReverseLink.java)
    - [反转一颗二叉树](/src/main/java/ds/reverse/InvertTree.java)
    - [反转字符串](/src/main/java/ds/reverse/ReverseString.java)
    - [反转字符串中的单词III](/src/main/java/ds/reverse/ReverseWordsIII.java)
    - [转置矩阵](/src/main/java/ds/reverse/Transpose.java)
    - [反转单链表的一部分区间](/src/main/java/ds/reverse/ReverseLinkN.java)
    
2. 二叉树
    - [二叉树的下一个节点](/src/main/java/ds/tree/NextNodeInTree.java)
    - [相同的树](/src/main/java/ds/tree/SameTree.java)
    - [对称二叉树](/src/main/java/ds/tree/SymmetricTree.java)
    - [二叉树的节点个数](/src/main/java/ds/tree/TreeNodeCount.java)
    - [完全二叉树的节点个数](/src/main/java/ds/tree/CompleteBinaryTreeNodeCount.java)
    - [填充每个节点的下一个右侧节点指针](/src/main/java/ds/tree/ConnectRightTree.java)
    - [将二叉树展开为链表](/src/main/java/ds/tree/FlattenLink.java)
    - [最大二叉树](/src/main/java/ds/tree/MaxTree.java)
    - [从前序与中序遍历序列构造二叉树](/src/main/java/ds/tree/PreInOrderBuildTree.java)
    - [从中序与后序遍历序列构造二叉树](/src/main/java/ds/tree/InPostOrderBuildTree.java)
    - [寻找重复的子树](/src/main/java/ds/tree/FindDuplicateSubtrees.java)
    - [二叉树的序列化和反序列化(前序遍历的序列化方式实现)](/src/main/java/ds/tree/SerializePreOrderTree.java)
    - [二叉树的序列化和反序列化(后序遍历的序列化方式实现)](/src/main/java/ds/tree/SerializePostOrderTree.java)
    - [验证一颗二叉树是否为平衡二叉树](/src/main/java/ds/tree/IsBalancedTree.java)
    - [二叉树的深度](/src/main/java/disBalanceds/tree/DepthTree.java)
    
3. 二叉查找树
    - [二叉搜索树中第K小的元素](/src/main/java/ds/bst/KthSmallestInBST.java)
    - [把二叉搜索树转换为累加树](/src/main/java/ds/bst/BstToGst.java)
    - [验证二叉搜索树(递归和非递归实现)](/src/main/java/ds/bst/ValidBST.java)
    - [二叉搜索树中的搜索](/src/main/java/ds/bst/BstSearch.java)
    - [二叉搜索树中的插入操作](/src/main/java/ds/bst/BstInsert.java)
    - [删除二叉搜索树中的节点](/src/main/java/ds/bst/BstDelete.java)
    - [二叉查找树的插入、遍历、查找、删除、反转](/src/main/java/ds/bst/BinarySearchTree.java)
    - [二叉树的最近公共祖先](/src/main/java/ds/bst/TreeLowestCommonAncestor.java)
    - [二叉查找树的最近公共祖先](/src/main/java/ds/bst/BSTreeLowestCommonAncestor.java)
    - [二叉树的右视图](/src/main/java/ds/bst/RightSideView.java)
    - [二叉树的锯齿形层次遍历](/src/main/java/ds/bst/ZigzagLevelOrder.java)

4. 二分查找
    - [二分查找(递归和非递归实现)](/src/main/java/ds/binary/BinarySearch.java)
    - [查找第一个值等于给定值的元素](/src/main/java/ds/binary/BSFirstEquals.java)
    - [查找最后一个值等于给定值的元素](/src/main/java/ds/binary/BSEndEquals.java)
    - [查找第一个大于等于给定值的元素](/src/main/java/ds/binary/BSFirstMore.java)
    - [查找最后一个小于等于给定值的元素](/src/main/java/ds/binary/BSEndLess.java)
    - [x的平方根](/src/main/java/ds/binary/MySqrt.java)
    
5. 双指针
    - [141.环形链表](/src/main/java/ds/pointer/CycleLink.java)
    - [142.环形链表 II (已知链表当中有环，返回这个环的起始位置)](/src/main/java/ds/pointer/DetectCycleLink.java)
    - [876.链表的中间节点](/src/main/java/ds/pointer/MiddleNodeLink.java)
    - [剑指offer 22链表中倒数第k个节点](/src/main/java/ds/pointer/GetKthFromEnd.java)
    - [167.两数之和II - 输入有序数组](/src/main/java/ds/pointer/TwoSumII.java)
    - [905.按奇偶排序数组](/src/main/java/ds/SortArrayByParity.java)
    - [26.删除排序数组中的重复项](/src/main/java/ds/pointer/RemoveDuplicates.java)
    - [83.删除排序链表中的重复元素](/src/main/java/ds/pointer/DeleteDuplicates.java)
    - [27.移除元素](/src/main/java/ds/pointer/RemoveElement.java)
    - [283.移动零](/src/main/java/ds/pointer/MoveZeroes.java)
    - [287.寻找重复数](/src/main/java/ds/pointer/FindDuplicate.java)
    - [15.三数之和](/src/main/java/ds/pointer/ThreeSum.java)
    
6. 滑动窗口
    - [一个数组所有连续K个元素构成的子集的平均数](/src/main/java/ds/sliding/ArrayAverages.java)
    - [最小覆盖子串](/src/main/java/ds/sliding/MinWindow.java)
    - [字符串的排列](/src/main/java/ds/sliding/CheckInclusion.java)
    - [找到字符串中所有字母异位词](/src/main/java/ds/sliding/FindAnagrams.java)
    - [无重复字符的最长子串](/src/main/java/ds/sliding/LengthOfLongestSubstring.java)
    
7. 数据结构设计
    - [LRUCache的实现](/src/main/java/ds/design/LRUCache.java)
    - [常数时间插入、删除和获取随机元素](/src/main/java/ds/design/RandomizedSet.java)
    
8. 位运算
    - [位1的个数](/src/main/java/ds/bit/HammingWeight.java)
    - [2的幂](/src/main/java/ds/bit/IsPowerOfTwo.java)
    - [比特位计数](/src/main/java/ds/bit/CountBits.java)
    - [只出现一次的数字](/src/main/java/ds/bit/SingleNumber.java)
    - [缺失数字](/src/main/java/ds/bit/MissingNumber.java)
    
9. 回溯(DFS) + 剪枝
    - [46.全排列](/src/main/java/ds/backtrack/Permute.java)
    - [47.全排列II](/src/main/java/ds/backtrack/PermuteUnique.java)
    - [51.N皇后](/src/main/java/ds/backtrack/SolveNQueens.java)
    - [78.子集](/src/main/java/ds/backtrack/Subsets.java)
    - [90.子集II](/src/main/java/ds/backtrack/SubsetsWithDup.java)
    - [77.组合](/src/main/java/ds/backtrack/Combine.java)
    - [216.组合总和III](/src/main/java/ds/backtrack/CombinationSum3.java)
    - [17.电话号码的字母组合](/src/main/java/ds/backtrack/LetterCombinations.java)
    - [39.组合总和](/src/main/java/ds/backtrack/CombinationSum.java)
    - [40.组合总和II](/src/main/java/ds/backtrack/CombinationSum2.java)
    - [131.分割回文串](/src/main/java/ds/backtrack/Partition.java)
    - [93. 复原IP地址](/src/main/java/ds/backtrack/RestoreIpAddresses.java)
    - [491.递增子序列](/src/main/java/ds/backtrack/FindSubsequences.java)
    - [37.解数独](/src/main/java/ds/backtrack/SolveSudoku.java)
    
10. 广度优先搜索(BFS)
    
11. 贪心
    - [买卖股票的最佳时机](/src/main/java/ds/MaxProfit.java)
    - [分发饼干](/src/main/java/ds/MaxProfit.java)
    
12. 哈希表
    - [242.有效的字母异位词](/src/main/java/ds/hashmap/IsAnagram.java)
    - [349.两个数组的交集](/src/main/java/ds/hashmap/Intersection.java)
    - [202.快乐数](/src/main/java/ds/hashmap/IsHappy.java)
    - [1.两数之和](/src/main/java/ds/hashmap/TwoSum.java)
    - [454.四数相加II](/src/main/java/ds/hashmap/FourSumCount.java)
    - [383.赎金信](/src/main/java/ds/hashmap/FourSumCount.java)
    
13. 字符串
    - [替换字符串中的空格](/src/main/java/ds/string/ReplaceBlankInString.java)
    - [Fizz Buzz](/src/main/java/ds/string/FizzBuzz.java)
    - [验证回文字符](/src/main/java/ds/string/ValidPalindromeString.java)
    - [最后一个单词的长度](/src/main/java/ds/string/LengthOfLastWord.java)
    - [最常见的单词](/src/main/java/ds/string/MostCommonWord.java)
    - [字符串中的第一个唯一字符](/src/main/java/ds/string/FirstUniqChar.java)
    - [根据字符出现频率排序](/src/main/java/ds/string/FrequencySort.java)
    - [验证回文串](/src/main/java/ds/string/PalindromeI.java)
    - [单词拆分](/src/main/java/ds/string/WordBreak.java)

## PAT

1. [1001. 害死人不偿命的(3n+1)猜想(15分)](/src/main/java/pat/pat1001/Main.java)
2. [1002. 写出这个数(20分)](/src/main/java/pat/pat1002/Main.java)
3. [1004. 成绩排名(20分)](/src/main/java/pat/pat1004/Main.java)
4. [1005. 继续(3n+1)猜想(25分)](/src/main/java/pat/pat1005/Main.java)
5. [1006. 换个格式输出整数(15分)](/src/main/java/pat/pat1006/Main.java)
6. [1007. 素数对猜想(20分)](/src/main/java/pat/pat1007/Main.java)
7. [1008. 数组元素循环右移问题(20分)](/src/main/java/pat/pat1008/Main.java)
8. [1009. 说反话(20分)](/src/main/java/pat/pat1009/Main.java)
9. [1010. 一元多项式求导(25分)](/src/main/java/pat/pat1010/Main.java)
10. [1011. A+B 和 C(15分)](/src/main/java/pat/pat1011/Main.java)
11. [1012. 数字分类(20分)](/src/main/java/pat/pat1012/Main.java)
12. [1014. 福尔摩斯的约会(20分)](/src/main/java/pat/pat1014/Main.java)
13. [1015. 德才论(25分)](/src/main/java/pat/pat1015/Main.java)(Java版本运行超时)
14. [1016. 部分A+B(15分)](/src/main/java/pat/pat1016/Main.java)
15. [1017. A除以B(20分)](/src/main/java/pat/pat1017/Main.java)
    