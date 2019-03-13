package ds;

/**
 * 顺序栈（基于数组实现的栈）
 *
 * @author yangyi 2018年12月01日21:58:25
 */
public class ArrayStack {

    private int capacity;
    private Object[] objects;
    private int count;

    ArrayStack(int capacity) {
        this.capacity = capacity;
        this.objects = new Object[capacity];
        this.count = 0;
    }

    /**
     * 压栈操作
     *
     * @param object 压入的元素
     * @return 是否成功压入
     */
    private boolean push(Object object) {
        if (object == null) {
            return false;
        }
        if (count == capacity) {
            return false;
        }
        if (count == -1) {
            return false;
        }
        //当前的个数和数组的下标在数值上来说是相等的
        objects[count] = object;
        count++;
        return true;
    }

    /**
     * 弹栈操作
     *
     * @return 弹出的元素，没有弹出null
     */
    private Object pop() {
        if (count == 0) {
            return null;
        }
        Object object = objects[count - 1];
        count--;
        return object;
    }

    /**
     * 获取栈的个数
     */
    private int getSize() {
        return count;
    }

    public static void main(String[] args) {
        //准备好大于100个（具体来说是101个）数用于测试
        int[] ints = new int[101];
        for (int i = 0; i < ints.length; i++) {
            ints[i] = i;
        }

        ArrayStack arrayStack = new ArrayStack(100);
        //将准备的好的数组顺序输出看下结果，顺便将准备好的数据依次压入栈中
        for (int anInt : ints) {
            System.out.println(anInt);
            arrayStack.push(anInt);
        }

        System.out.println("————————————朴素的分割线——————————————");

        int count = arrayStack.getSize();
        //依次输出栈内元素看看顺序
        for (int i = 0; i < count; i++) {
            System.out.println(arrayStack.pop());
        }
    }
}
