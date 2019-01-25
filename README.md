## 常见数据结构与算法小结（Java语言描述）

Hello大家好我叫yangyi，是一枚Androider。这是一个数据结构和算法笔记本，**书写** 并 **整理**一些常见的数据结构和其对应的相关操作。这其中**每一个类文件都是一个可以单独运行查看结果的main方法类**，相关的关键描述和想说的话都在代码的注释中。（欢迎一同补充和完善，2019年01月04日00:07:40置为public）

1. 线性数据结构及其对应的常见算法

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
        
2. 递归（**自己调用自己，一层一层调用下去叫递，一层一层收集返回叫归**）
    - [位于第几排问题（递归、非递归分别实现）](/src/ds/LocationRow.java)
    - [n个台阶走法问题（每次可以走1个台阶或者2个台阶）](/src/ds/OneTwoStep.java)

3. 排序
    - [冒泡排序](/src/ds/BubbleSort.java)
    - [插入排序](/src/ds/InsertSort.java)
    - [选择排序](/src/ds/SelectionSort.java)
    - [快速排序](/src/ds/QuickSort.java)

4. 二分查找
    - [二分查找(递归和非递归实现)](/src/ds/BinarySearch.java)
5. 二分查找变种
    - [查找第一个值等于给定值的元素](/src/ds/BSFirstEquals.java)
    - [查找最后一个值等于给定值的元素](/src/ds/BSEndEquals.java)
    - [查找第一个大于等于给定值的元素](/src/ds/BSFirstMore.java)
    - [查找最后一个小于等于给定值的元素](/src/ds/BSEndLess.java)
6. 反转
    - [反转一个数组](/src/ds/ReverseArray.java)
    - [反转一个单链表](/src/ds/ReverseLink.java)
7. 二叉树

    1. 二叉查找树
        - [二叉查找树的插入、遍历、查找、删除、反转](/src/ds/BinarySearchTree.java)
    2. 递归树
8. 有环链表
    - [判断链表是否有环](/src/ds/CycleLink.java)
9. 堆
    - [大顶堆、堆排序](/src/ds/BigHeap.java)
    - [TopK](/src/ds/KthLargest.java)
10. 散列表
    - [两数之和](/src/ds/TwoSum.java)
    - [三数之和](/src/ds/ThreeSum.java)