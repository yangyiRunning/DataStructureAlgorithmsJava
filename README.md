## 常见数据结构与算法小结（Java语言描述）

这是一个数据结构和算法笔记本，**书写** 并 **整理**一些常见数据结构和其对应的相关操作。（欢迎补充）

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
    3. 队列
        - [顺序队列（基于数组实现的队列）](/src/ds/ArrayQueue.java)
        - [链式队列（基于链表实现的队列）](/src/ds/LinkQueue.java)
        - [循环队列（基于数组成环）](/src/ds/CircleQueue.java)
2. 递归（**自己调用自己，一层一层调用下去叫递，一层一层收集返回叫归**）
    1. 目前处于第几排的问题：
        