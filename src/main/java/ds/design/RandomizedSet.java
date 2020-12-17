package ds.design;

import java.util.*;

/**
 * 常数时间插入、删除和获取随机元素
 * LeetCode 380 https://leetcode-cn.com/problems/insert-delete-getrandom-o1/
 *
 * @author yangyi 2020年12月16日14:27:13
 */
public class RandomizedSet {

    private List<Integer> values;
    private HashMap<Integer, Integer> valueIndex;

    /**
     * Initialize your data structure here.
     */
    public RandomizedSet() {
        values = new ArrayList<>();
        valueIndex = new HashMap<>();
    }

    /**
     * Inserts a value to the set. Returns true if the set did not already contain the specified element.
     */
    public boolean insert(int val) {
        if (valueIndex.containsKey(val)) {
            return false;
        }
        values.add(val);
        valueIndex.put(val, values.size() - 1);
        return true;
    }

    /**
     * Removes a value from the set. Returns true if the set contained the specified element.
     */
    public boolean remove(int val) {
        if (!valueIndex.containsKey(val)) {
            return false;
        }
        //找到要查找的值的index
        int index = valueIndex.get(val);
        //找到数组中最后一个数
        int lastValue = values.get(values.size() - 1);
        //交换
        valueIndex.put(lastValue, index);
        values.set(values.size() - 1, val);
        values.set(index, lastValue);
        //移除
        values.remove(values.size() - 1);
        valueIndex.remove(val);
        return true;
    }

    /**
     * Get a random element from the set.
     */
    public int getRandom() {
        return values.get(new Random().nextInt(values.size()));
    }

    public static void main(String[] args) {
        RandomizedSet obj = new RandomizedSet();
        boolean param_1 = obj.insert(-1);
        boolean param_2 = obj.remove(-2);
        boolean param_3 = obj.insert(-2);
        int param_4 = obj.getRandom();
        System.out.println(param_1);
        System.out.println(param_2);
        System.out.println(param_3);
        System.out.println(param_4);
    }
}
