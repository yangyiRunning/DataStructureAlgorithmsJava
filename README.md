# 常见数据结构与算法小结（Java语言描述）

这是一个数据结构和算法笔记本，**书写** 并 **整理**一些常见的数据结构和其对应的相关操作。这其中**每一个类文件都是一个可以单独运行查看结果的main方法类**
，相关的关键描述和想说的话都在代码的注释中。（欢迎一同补充和完善，2019年01月04日00:07:40置为public）

1. 数组
    - [搜索二维矩阵](/src/main/java/ds/FindInDoubleArray.java)
    - [数组中重复的数据](/src/main/java/ds/RepeatInArray.java)
    - [合并两个有序数组](/src/main/java/ds/MergeArray.java)
    - [旋转数组](/src/main/java/ds/RotateArray.java)
    - [有序数组的平方](/src/main/java/ds/SortedSquares.java)
    - [寻找数组的中心索引](/src/main/java/ds/PivotIndex.java)
    - [两个数组的交集II](/src/main/java/ds/Intersect.java)
    - [递增的三元子序列](/src/main/java/ds/IncreasingTriplet.java)
    - [除自身以外数组的乘积](/src/main/java/ds/ProductExceptSelf.java)
    - [存在重复元素II](/src/main/java/ds/ContainsNearbyDuplicate.java)
    - [存在重复元素III](/src/main/java/ds/ContainsNearbyAlmostDuplicate.java)
    - [矩阵置零](/src/main/java/ds/SetZeroes.java)
    - [1486.数组异或操作](/src/main/java/ds/array/leetcode1486/Solution.java)

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

    3. 队列
        - [顺序队列（基于数组实现的队列）](/src/main/java/ds/ArrayQueue.java)
        - [链式队列（基于链表实现的队列）](/src/main/java/ds/LinkQueue.java)
        - [循环队列（基于数组成环）](/src/main/java/ds/CircleQueue.java)

5. 递归
    - [n的阶乘](/src/main/java/ds/Factorial.java)
    - [斐波拉切数列](/src/main/java/ds/FibonacciArray.java)
    - [位于第几排问题（递归、非递归分别实现）](/src/main/java/ds/LocationRow.java)
    - [n个台阶走法问题（每次可以走1个台阶或者2个台阶）](/src/main/java/ds/OneTwoStep.java)
    - [输出指定路径下的所有文件名（递归、非递归分别实现）](/src/main/java/ds/FileSearch.java)

6. 分治
    - [x的n次方](/src/main/java/ds/Pow.java)

11. 堆
    - [TopK](/src/main/java/ds/KthLargest.java)
    - [数组中的第K个最大元素](/src/main/java/ds/FindKthLargest.java)
    - [前K个高频元素](/src/main/java/ds/TopKFrequent.java)
    - [前K个高频单词](/src/main/java/ds/TopKWord.java)

13. 求数
    - [求众数](/src/main/java/ds/MajorityElement.java)
    - [加一](/src/main/java/ds/PlusOne.java)
    - [Nim游戏](/src/main/java/ds/CanWinNim.java)
    - [回文数](/src/main/java/ds/Palindrome.java)
    - [猜数字游戏](/src/main/java/ds/GetHint.java)

14. 搜索
    - [广度优先搜索](/src/main/java/ds/LevelPrint.java)
    - [深度优先搜索](/src/main/java/ds/DepthPrint.java)

15. 图
    - [图的表示](/src/main/java/ds/Graph.java)

## LeetCode

1. 反转
    - [反转一个数组](/src/main/java/ds/reverse/ReverseArray.java)
    - [206.反转链表](/src/main/java/ds/reverse/leetcode206/Solution.java)
    - [226.翻转二叉树](/src/main/java/ds/reverse/leetcode226/Solution.java)
    - [344.反转字符串](/src/main/java/ds/reverse/leetcode344/Solution.java)
    - [541.反转字符串II](/src/main/java/ds/reverse/leetcode541/Solution.java)
    - [557.反转字符串中的单词III](/src/main/java/ds/reverse/leetcode557/Solution.java)
    - [867.转置矩阵](/src/main/java/ds/reverse/leetcode867/Solution.java)
    - [反转单链表的一部分区间](/src/main/java/ds/reverse/ReverseLinkN.java)

2. 二叉树
    - [144.二叉树的前序遍历](/src/main/java/ds/tree/leetcode144/Solution.java)
    - [二叉树的下一个节点](/src/main/java/ds/tree/NextNodeInTree.java)
    - [100.相同的树](/src/main/java/ds/tree/leetcode100/Solution.java)
    - [101.对称二叉树](/src/main/java/ds/tree/leetcode101/Solution.java)
    - [116.填充每个节点的下一个右侧节点指针](/src/main/java/ds/tree/leetcode116/Solution.java)
    - [114.将二叉树展开为链表](/src/main/java/ds/tree/leetcode114/Solution.java)
    - [654.最大二叉树](/src/main/java/ds/tree/leetcode654/Solution.java)
    - [105.从前序与中序遍历序列构造二叉树](/src/main/java/ds/tree/leetcode105/Solution.java)
    - [106.从中序与后序遍历序列构造二叉树](/src/main/java/ds/tree/leetcode106/Solution.java)
    - [寻找重复的子树](/src/main/java/ds/tree/FindDuplicateSubtrees.java)
    - [297. 二叉树的序列化和反序列化(前序遍历的序列化方式实现)](/src/main/java/ds/tree/leetcode297/preorder/Solution.java)
    - [297. 二叉树的序列化和反序列化(后序遍历的序列化方式实现)](/src/main/java/ds/tree/leetcode297/postorder/Solution.java)
    - [110.平衡二叉树](/src/main/java/ds/tree/leetcode110/Solution.java)
    - [剑指offer 55.二叉树的深度](/src/main/java/ds/tree/targetoffer55/Solution.java)
    - [104.二叉树的最大深度](/src/main/java/ds/tree/leetcode104/Solution.java)
    - [559.N叉树的最大深度](/src/main/java/ds/tree/leetcode559/Solution.java)
    - [111.二叉树的最小深度](/src/main/java/ds/tree/leetcode111/Solution.java)
    - [二叉树的节点个数](/src/main/java/ds/tree/leetcode222/TreeNodeCount.java)
    - [222.完全二叉树的节点个数](/src/main/java/ds/tree/leetcode222/Solution.java)
    - [572.另一个树的子树](/src/main/java/ds/tree/leetcode572/Solution.java)
    - [404.左叶子之和](/src/main/java/ds/tree/leetcode404/Solution.java)
    - [617.合并二叉树](/src/main/java/ds/tree/leetcode617/Solution.java)
    - [236.二叉树的最近公共祖先](/src/main/java/ds/tree/leetcode236/Solution.java)
    - [814.二叉树剪枝](/src/main/java/ds/tree/leetcode814/Solution.java)
    - [965.单值二叉树](/src/main/java/ds/tree/leetcode965/Solution.java)

3. 二叉查找树
    - [700.二叉搜索树中的搜索](/src/main/java/ds/bst/leetcode700/Solution.java)
    - [98.验证二叉搜索树](/src/main/java/ds/bst/leetcode98/Solution.java)
    - [530.二叉搜索树的最小绝对差](/src/main/java/ds/bst/leetcode530/Solution.java)
    - [783.二叉搜索树节点最小距离](/src/main/java/ds/bst/leetcode783/Solution.java)
    - [501.二叉搜索树中的众数](/src/main/java/ds/bst/leetcode501/Solution.java)
    - [230.二叉搜索树中第K小的元素](/src/main/java/ds/bst/leetcode230/Solution.java)
    - [538.把二叉搜索树转换为累加树](/src/main/java/ds/bst/leetcode538/Solution.java)
    - [701.二叉搜索树中的插入操作](/src/main/java/ds/bst/leetcode701/Solution.java)
    - [450.删除二叉搜索树中的节点](/src/main/java/ds/bst/leetcode450/Solution.java)
    - [二叉查找树的插入、遍历、查找、删除、反转](/src/main/java/ds/bst/base/BinarySearchTree.java)
    - [235.二叉查找树的最近公共祖先](/src/main/java/ds/bst/leetcode235/Solution.java)
    - [剑指offer 36. 二叉搜索树与双向链表](/src/main/java/ds/bst/targetoffer36/Solution.java)
    - [108.将有序数组转换为二叉搜索树](/src/main/java/ds/bst/leetcode108/Solution.java)
    - [109.有序链表转换二叉搜索树](/src/main/java/ds/bst/leetcode109/Solution.java)
    - [剑指offer 54.二叉搜索树的第k大节点](/src/main/java/ds/tree/target54/Solution.java)

4. 二分查找
    - [704.二分查找](/src/main/java/ds/binary/leetcode704/Solution.java)
    - [69.x的平方根](/src/main/java/ds/binary/leetcode69/Solution.java)
    - [374.猜数字大小](/src/main/java/ds/binary/leetcode374/Solution.java)
    - [33.搜索旋转排序数组](/src/main/java/ds/binary/leetcode33/Solution.java)
    - [278.第一个错误的版本](/src/main/java/ds/binary/leetcode278/Solution.java)
    - [162.寻找峰值](/src/main/java/ds/binary/leetcode162/Solution.java)
    - [852.山脉数组的峰顶索引](/src/main/java/ds/binary/leetcode162/Solution.java)
    - [剑指 Offer II 069.山峰数组的顶部](/src/main/java/ds/binary/leetcode162/Solution.java)
    - [153.寻找旋转排序数组中的最小值](/src/main/java/ds/binary/leetcode153/Solution.java)
    - [34.在排序数组中查找元素的第一个和最后一个位置](/src/main/java/ds/binary/leetcode34/Solution.java)
    - [二分查找(递归和非递归实现)](/src/main/java/ds/binary/BinarySearch.java)
    - [查找第一个值等于给定值的元素](/src/main/java/ds/binary/BSFirstEquals.java)
    - [查找最后一个值等于给定值的元素](/src/main/java/ds/binary/BSEndEquals.java)
    - [查找第一个大于等于给定值的元素](/src/main/java/ds/binary/BSFirstMore.java)
    - [查找最后一个小于等于给定值的元素](/src/main/java/ds/binary/BSEndLess.java)
    - [35.搜索插入位置](/src/main/java/ds/binary/leetcode35/Solution.java)
    - [剑指 Offer II 068.查找插入位置](/src/main/java/ds/binary/targetofferII068/Solution.java)

5. 双指针
    - [141.环形链表](/src/main/java/ds/pointer/leetcode141/Solution.java)
    - [142.环形链表II (已知链表当中有环，返回这个环的起始位置)](/src/main/java/ds/pointer/leetcode142/Solution.java)
    - [876.链表的中间节点](/src/main/java/ds/pointer/leetcode876/Solution.java)
    - [剑指offer 22.链表中倒数第k个节点](/src/main/java/ds/pointer/targetoffer22/Solution.java)
    - [167.两数之和II - 输入有序数组](/src/main/java/ds/pointer/leetcode167/Solution.java)
    - [905.按奇偶排序数组](/src/main/java/ds/pointer/leetcode905/Solution.java)
    - [26.删除排序数组中的重复项](/src/main/java/ds/pointer/leetcode26/Solution.java)
    - [83.删除排序链表中的重复元素](/src/main/java/ds/pointer/leetcode83/Solution.java)
    - [27.移除元素](/src/main/java/ds/pointer/leetcode27/Solution.java)
    - [283.移动零](/src/main/java/ds/pointer/leetcode283/Solution.java)
    - [287.寻找重复数](/src/main/java/ds/pointer/leetcode287/Solution.java)
    - [15.三数之和](/src/main/java/ds/pointer/leetcode15/Solution.java)
    - [18.四数之和](/src/main/java/ds/pointer/leetcode18/Solution.java)
    - [剑指offer 05.替换空格](/src/main/java/ds/pointer/targetoffer05/Solution.java)
    - [剑指 Offer II 014.字符串中的变位词](/src/main/java/ds/pointer/targetofferII014/Solution.java)
    - [剑指 Offer II 015.字符串中的所有变位词](/src/main/java/ds/pointer/targetofferII015/Solution.java)
    - [11.盛最多水的容器](/src/main/java/ds/pointer/leetcode11/Solution.java)
    - [42.接雨水](/src/main/java/ds/pointer/leetcode42/Solution.java)

6. 滑动窗口
    - [一个数组所有连续K个元素构成的子集的平均数](/src/main/java/ds/sliding/ArrayAverages.java)
    - [最小覆盖子串](/src/main/java/ds/sliding/MinWindow.java)
    - [字符串的排列](/src/main/java/ds/sliding/CheckInclusion.java)
    - [找到字符串中所有字母异位词](/src/main/java/ds/sliding/FindAnagrams.java)
    - [无重复字符的最长子串](/src/main/java/ds/sliding/LengthOfLongestSubstring.java)
    - [209.长度最小的子数组](/src/main/java/ds/sliding/leetcode209/Solution.java)
    - [239.滑动窗口最大值](/src/main/java/ds/sliding/leetcode239/Solution.java)

7. 数据结构设计
    - [146.LRU缓存机制](/src/main/java/ds/design/leetcode146/LRUCache.java)
    - [380.常数时间插入、删除和获取随机元素](/src/main/java/ds/design/leetcode380/RandomizedSet.java)
    - [232.用栈实现队列](/src/main/java/ds/stack/leetcode232/MyQueue.java)
    - [225.用队列实现栈](/src/main/java/ds/queue/leetcode225/MyStack.java)

8. 位运算
    - [位1的个数](/src/main/java/ds/bit/HammingWeight.java)
    - [2的幂](/src/main/java/ds/bit/IsPowerOfTwo.java)
    - [比特位计数](/src/main/java/ds/bit/CountBits.java)
    - [136.只出现一次的数字](/src/main/java/ds/bit/leetcode136/Solution.java)
    - [缺失数字](/src/main/java/ds/bit/MissingNumber.java)

9. 回溯(DFS) + 剪枝
    - 排列
        - [46.全排列](/src/main/java/ds/backtrack/Permute.java)
        - [47.全排列II](/src/main/java/ds/backtrack/PermuteUnique.java)
    - 组合
        - [77.组合](/src/main/java/ds/backtrack/Combine.java)
        - [216.组合总和III](/src/main/java/ds/backtrack/CombinationSum3.java)
        - [39.组合总和](/src/main/java/ds/backtrack/CombinationSum.java)
        - [17.电话号码的字母组合](/src/main/java/ds/backtrack/LetterCombinations.java)
        - [40.组合总和II](/src/main/java/ds/backtrack/CombinationSum2.java)
    - 分割
        - [131.分割回文串](/src/main/java/ds/backtrack/Partition.java)
        - [93. 复原IP地址](/src/main/java/ds/backtrack/RestoreIpAddresses.java)
    - 子集
        - [78.子集](/src/main/java/ds/backtrack/Subsets.java)
        - [90.子集II](/src/main/java/ds/backtrack/SubsetsWithDup.java)
        - [491.递增子序列](/src/main/java/ds/backtrack/FindSubsequences.java)
    - 棋盘
        - [51.N皇后](/src/main/java/ds/backtrack/SolveNQueens.java)
        - [37.解数独](/src/main/java/ds/backtrack/SolveSudoku.java)
    - 路径
        - [112.路径总和](/src/main/java/ds/tree/leetcode112/Solution.java)
        - [113.路径总和II](/src/main/java/ds/tree/leetcode113/Solution.java)
        - [257.二叉树的所有路径](/src/main/java/ds/tree/leetcode257/Solution.java)

10. 广度优先搜索(BFS)
    - [111.二叉树的最小深度](/src/main/java/ds/bfs/leetcode111/Solution.java)
    - [102.二叉树的层序遍历](/src/main/java/ds/bfs/leetcode102/Solution.java)
    - [107.二叉树的层序遍历II](/src/main/java/ds/bfs/leetcode107/Solution.java)
    - [199.二叉树的右视图](/src/main/java/ds/bfs/leetcode199/Solution.java)
    - [637.二叉树的层平均值](/src/main/java/ds/bfs/leetcode637/Solution.java)
    - [429.N叉树的层序遍历](/src/main/java/ds/bfs/leetcode429/Solution.java)
    - [513.找树左下角的值](/src/main/java/ds/tree/leetcode513/Solution.java)
    - [剑指offer 32 - I.从上到下打印二叉树](/src/main/java/ds/bfs/targetoffer321/Solution.java)
    - [剑指offer 32 - II.从上到下打印二叉树II](/src/main/java/ds/bfs/targetoffer322/Solution.java)
    - [剑指offer 32 - III.从上到下打印二叉树III](/src/main/java/ds/bfs/targetoffer323/Solution.java)
    - [103.二叉树的锯齿形层次遍历](/src/main/java/ds/bfs/leetcode103/Solution.java)
    - [117.填充每个节点的下一个右侧节点指针II](/src/main/java/ds/bfs/leetcode117/Solution.java)

11. 数组
    - [59.螺旋矩阵II](/src/main/java/ds/array/leetcode59/Solution.java)
    - [384.打乱数组](/src/main/java/ds/array/leetcode384/Solution.java)

12. 链表
    - [203.移除链表元素](/src/main/java/ds/link/leetcode203/Solution.java)
    - [707.设计链表](/src/main/java/ds/link/leetcode707/MyLinkedList.java)
    - [剑指offer 06.从尾到头打印链表](/src/main/java/ds/link/targetoffer06/Solution.java)
    - [剑指offer 18.删除链表中的节点](/src/main/java/ds/link/targetoffer18/Solution.java)
    - [234.回文链表](/src/main/java/ds/link/leetcode234/Solution.java)

13. 哈希表
    - [242.有效的字母异位词](/src/main/java/ds/hashmap/leetcode242/Solution.java)
    - [349.两个数组的交集](/src/main/java/ds/hashmap/leetcode349/Solution.java)
    - [202.快乐数](/src/main/java/ds/hashmap/leetcode202/Solution.java)
    - [1.两数之和](/src/main/java/ds/hashmap/leetcode1/Solution.java)
    - [454.四数相加II](/src/main/java/ds/hashmap/leetcode454/Solution.java)
    - [383.赎金信](/src/main/java/ds/hashmap/leetcode383/Solution.java)
    - [有效的异位词](/src/main/java/ds/ValidAnagram.java)
    - [两数之和IV - 输入BST](/src/main/java/ds/FindTargetBST.java)
    - [存在重复元素](/src/main/java/ds/ContainsDuplicate.java)
    - [字典序列化](/src/main/java/ds/MapArraySerialize.java)
    - [560.和为 K 的子数组](/src/main/java/ds/hashmap/leetcode560/Solution.java)
    - [剑指 Offer II 011.0 和 1 个数相同的子数组](/src/main/java/ds/hashmap/targetofferII011/Solution.java)
    - [剑指 Offer II 012.左右两边子数组的和相等](/src/main/java/ds/hashmap/targetofferII012/Solution.java)
    - [剑指 Offer II 013.二维子矩阵的和](/src/main/java/ds/hashmap/targetofferII013/NumMatrix.java)

14. 字符串
    - [Fizz Buzz](/src/main/java/ds/string/FizzBuzz.java)
    - [验证回文字符](/src/main/java/ds/string/ValidPalindromeString.java)
    - [最后一个单词的长度](/src/main/java/ds/string/LengthOfLastWord.java)
    - [最常见的单词](/src/main/java/ds/string/MostCommonWord.java)
    - [字符串中的第一个唯一字符](/src/main/java/ds/string/FirstUniqChar.java)
    - [根据字符出现频率排序](/src/main/java/ds/string/FrequencySort.java)
    - [验证回文串](/src/main/java/ds/string/PalindromeI.java)
    - [单词拆分](/src/main/java/ds/string/WordBreak.java)

15. 排序
    - [冒泡排序](/src/main/java/ds/sort/BubbleSort.java)
    - [插入排序](/src/main/java/ds/sort/InsertSort.java)
    - [选择排序](/src/main/java/ds/sort/SelectionSort.java)
    - [快速排序](/src/main/java/ds/sort/QuickSort.java)
    - [计数排序](/src/main/java/ds/sort/CountSort.java)
    - [堆排序](/src/main/java/ds/sort/BigHeapSort.java)

16. 贪心
    - [455.分发饼干](/src/main/java/ds/greedy/leetcode455/Solution.java)
    - [376.摆动序列](/src/main/java/ds/greedy/leetcode376/Solution.java)
    - [53.最大子序和](/src/main/java/ds/greedy/leetcode53/Solution.java)
    - [122.买卖股票的最佳时机II](/src/main/java/ds/greedy/leetcode122/Solution.java)

17. 动态规划(DP)
    - 斐波拉切
        - [斐波拉契数列的4种解法](/src/main/java/ds/dp/Fipolach.java)
        - [509.斐波那契数](/src/main/java/ds/dp/leetcode509/Solution.java)
        - [70.爬楼梯](/src/main/java/ds/dp/leetcode70/Solution.java)
        - [746.使用最小花费爬楼梯](/src/main/java/ds/dp/leetcode746/Solution.java)
    - 路径
        - [60.不同路径](/src/main/java/ds/dp/leetcode60/Solution.java)
        - [63.不同路径II](/src/main/java/ds/dp/leetcode63/Solution.java)
    - [96.不同的二叉搜索树](/src/main/java/ds/dp/leetcode96/Solution.java)
    - [343.整数拆分](/src/main/java/ds/dp/leetcode343/Solution.java)
    - [三角形最小路径和](/src/main/java/ds/dp/MinimumTotal.java)
    - [乘积最大子序列](/src/main/java/ds/dp/MaxProduct.java)
    - 打家劫舍
        - [198.打家劫舍](/src/main/java/ds/dp/leetcode198/Solution.java)
        - [213.打家劫舍II](/src/main/java/ds/dp/leetcode213/Solution.java)
        - [337.打家劫舍III](/src/main/java/ds/dp/leetcode337/Solution.java)
    - 杨辉三角
        - [118.杨辉三角](/src/main/java/ds/dp/leetcode118/Solution.java)
        - [119.杨辉三角II](/src/main/java/ds/dp/leetcode119/Solution.java)

18. 栈
    - [20.有效的括号](/src/main/java/ds/stack/leetcode20/Solution.java)
    - [1047.删除字符串中的所有相邻重复项](/src/main/java/ds/stack/leetcode1047/Solution.java)
    - [150.逆波兰表达式求值](/src/main/java/ds/stack/leetcode150/Solution.java)
    - 单调栈
        - [739.每日温度](/src/main/java/ds/stack/leetcode739/Solution.java)

## 多线程

- [1114.按序打印](/src/main/java/thread/leetcode1114/Foo.java)
- [1115.交替打印FooBar](/src/main/java/thread/leetcode1115/FooBar.java)
- [1116.打印零与奇偶数](/src/main/java/thread/leetcode1116/ZeroEvenOdd.java)
- [1117.H2O生成](/src/main/java/thread/leetcode1117/H2O.java)
- [1195.交替打印字符串](/src/main/java/thread/leetcode1195/FizzBuzz.java)
- [1226.哲学家进餐](/src/main/java/thread/leetcode1226/DiningPhilosophers.java)

## SQL

- [175.组合两个表](/src/main/java/db/leetcode175/Solution.sql)
- [176.第二高的薪水](/src/main/java/db/leetcode176/Solution.sql)
- [177.第N高的薪水](/src/main/java/db/leetcode177/Solution.sql)
- [178.分数排名](/src/main/java/db/leetcode178/Solution.sql)
- [180.连续出现的数字](/src/main/java/db/leetcode180/Solution.sql)
- [181.超过经理收入的员工](/src/main/java/db/leetcode181/Solution.sql)
- [182.查找重复的电子邮箱](/src/main/java/db/leetcode182/Solution.sql)
- [183.从不订购的客户](/src/main/java/db/leetcode183/Solution.sql)
- [196.删除重复的电子邮箱](/src/main/java/db/leetcode196/Solution.sql)
- [197.上升的温度](/src/main/java/db/leetcode197/Solution.sql)
- [511.游戏玩法分析I](/src/main/java/db/leetcode511/Solution.sql)
- [584.寻找用户推荐人](/src/main/java/db/leetcode584/Solution.sql)
- [595.大的国家](/src/main/java/db/leetcode595/Solution.sql)
- [1757.可回收且低脂的产品](/src/main/java/db/leetcode1757/Solution.sql)
- [1873.计算特殊奖金](/src/main/java/db/leetcode1873/Solution.sql)
- [627.变更性别](/src/main/java/db/leetcode627/Solution.sql)
- [586.订单最多的客户](/src/main/java/db/leetcode586/Solution.sql)
- [620.有趣的电影](/src/main/java/db/leetcode620/Solution.sql)
- [596.超过5名学生的课](/src/main/java/db/leetcode596/Solution.sql)
- [1667.修复表中的名字](/src/main/java/db/leetcode1667/Solution.sql)
- [1484.按日期分组销售产品](/src/main/java/db/leetcode1484/Solution.sql)
- [1527.患某种疾病的患者](/src/main/java/db/leetcode1527/Solution.sql)
- [607.销售员](/src/main/java/db/leetcode607/Solution.sql)
- [608.树节点](/src/main/java/db/leetcode608/Solution.sql)
- [1084.销售分析III](/src/main/java/db/leetcode1084/Solution.sql)
- [626.换座位](/src/main/java/db/leetcode626/Solution.sql)
- [1050.合作过至少三次的演员和导演](/src/main/java/db/leetcode1050/Solution.sql)
- [1148.文章浏览I](/src/main/java/db/leetcode1148/Solution.sql)
- [1179.重新格式化部门表](/src/main/java/db/leetcode1179/Solution.sql)
- [1407.排名靠前的旅行者](/src/main/java/db/leetcode1407/Solution.sql)
- [1581.进店却未进行过交易的顾客](/src/main/java/db/leetcode1581/Solution.sql)
- [1795.每个产品在不同商店的价格](/src/main/java/db/leetcode1795/Solution.sql)
- [1965.丢失信息的雇员](/src/main/java/db/leetcode1965/Solution.sql)
- [1729.求关注者的数量](/src/main/java/db/leetcode1729/Solution.sql)
- [1890.2020年最后一次登录](/src/main/java/db/leetcode1890/Solution.sql)
- [1393.股票的资本损益](/src/main/java/db/leetcode1393/Solution.sql)
- [1141.查询近30天活跃用户数](/src/main/java/db/leetcode1141/Solution.sql)
- [184.部门工资最高的员工](/src/main/java/db/leetcode184/Solution.sql)
- [1741.查找每个员工花费的总时间](/src/main/java/db/leetcode1741/Solution.sql)
- [1587.银行账户概要II](/src/main/java/db/leetcode1587/Solution.sql)
- [1158.市场分析I](/src/main/java/db/leetcode1158/Solution.sql)

## 华为OD

- [HJ1.字符串最后一个单词的长度](/src/main/java/od/HJ1/Main.java)
- [HJ2.计算某字符出现次数](/src/main/java/od/HJ2/Main.java)
- [HJ3.明明的随机数](/src/main/java/od/HJ3/Main.java)
- [HJ4.字符串分隔](/src/main/java/od/HJ4/Main.java)
- [HJ5.进制转换](/src/main/java/od/HJ5/Main.java)
- [**HJ6.质数因子**](/src/main/java/od/HJ6/Main.java)
- [HJ7.取近似值](/src/main/java/od/HJ7/Main.java)
- [HJ8.合并表记录](/src/main/java/od/HJ8/Main.java)
- [HJ9.提取不重复的整数](/src/main/java/od/HJ9/Main.java)
- [HJ10.字符个数统计](/src/main/java/od/HJ10/Main.java)
- [HJ11.数字颠倒](/src/main/java/od/HJ11/Main.java)
- [HJ12.字符串反转](/src/main/java/od/HJ12/Main.java)
- [HJ13.句子逆序](/src/main/java/od/HJ13/Main.java)
- [HJ14.字符串排序](/src/main/java/od/HJ14/Main.java)
- [**HJ15.求int型正整数在内存中存储时1的个数**](/src/main/java/od/HJ15/Main.java)
- [HJ106.字符逆序](/src/main/java/od/HJ106/Main.java)

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
    