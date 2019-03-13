package ds;

import java.util.HashMap;
import java.util.Map;

/**
 * 位于第几排问题（递归方式实现）
 * <p>
 * 核心：
 * <p>
 * 1. 递推公式为： f(n)=f(n-1)+1  因为你目前处于的行永远比你前面一行多1
 * 2. 终止条件为： f(1)=1  因为位于第一行的人心知肚明，知道自己是在第一行
 *
 * @author yangyi 2018年12月03日23:19:59
 */
public class LocationRow {

    private static final int MAX = 1000;
    private int deep;
    private Map<Integer, Integer> maps = new HashMap<>();

    /**
     * 递归方式实现
     */
    public int locationRowRecursion(int n) {
        deep++;
        if (deep > MAX) {
            throw new StackOverflowError();
        }
        if (n == 1) {
            return 1;
        }
        //避免在递归的过程当中重复计算
        if (maps.containsKey(n)) {
            return maps.get(n);
        }
        int result = locationRowRecursion(n - 1) + 1;
        maps.put(n, result);
        return result;
    }

    /**
     * 非递归方式实现
     */
    public int locationRowNonRecursion(int n) {
        //第一个人肯定知道自己是第一排
        int row = 1;
        //第二排往后一直到我所在那排（也就是第n排）
        for (int i = 2; i <= n; i++) {
            row++;
        }
        return row;
    }

    public static void main(String[] args) {
        LocationRow locationRow = new LocationRow();
        System.out.println("递归实现↓");
        System.out.println("在第" + locationRow.locationRowRecursion(10) + "排");
        System.out.println();
        System.out.println("非递归实现↓");
        System.out.println("在第" + locationRow.locationRowNonRecursion(10) + "排");
    }
}
