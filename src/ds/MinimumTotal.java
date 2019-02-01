package ds;

import java.util.ArrayList;
import java.util.List;

/**
 * 三角形最小路径和
 * <p>
 * <p>
 * 给定一个三角形，找出自顶向下的最小路径和。每一步只能移动到下一行中相邻的结点上。
 * <p>
 * 例如，给定三角形：
 * <p>
 * [
 * [2],
 * [3,4],
 * [6,5,7],
 * [4,1,8,3]
 * ]
 * 自顶向下的最小路径和为 11（即，2 + 3 + 5 + 1 = 11）。
 *
 * @author yangyi 2019年02月01日12:10:45
 */
public class MinimumTotal {

    public int minimumTotal(List<List<Integer>> triangle) {
        if (triangle == null || triangle.isEmpty()) {
            return 0;
        }

        //将三角形看成一个二维数组即可
        int[][] dp = new int[triangle.size() + 1][triangle.size() + 1];
        //开始递推，i为层数，j为层数中的列数
        for (int i = triangle.size() - 1; i >= 0; i--) {
            //列也开始递推，从0遍历到最后
            for (int j = 0; j < triangle.get(i).size(); j++) {
                //每一个位置的最小路径，就相当于当前路径的值+下层的两条路径中的最小者
                dp[i][j] = triangle.get(i).get(j) + Math.min(dp[i + 1][j], dp[i + 1][j + 1]);
            }
        }
        //推到了第一层第一个，结束并返回
        return dp[0][0];
    }

    public static void main(String[] args) {
        List<List<Integer>> triangle = new ArrayList<>();

        List<Integer> list1 = new ArrayList<>();
        list1.add(2);
        List<Integer> list2 = new ArrayList<>();
        list2.add(3);
        list2.add(4);
        List<Integer> list3 = new ArrayList<>();
        list3.add(6);
        list3.add(5);
        list3.add(7);
        List<Integer> list4 = new ArrayList<>();
        list4.add(4);
        list4.add(1);
        list4.add(8);
        list4.add(3);

        triangle.add(list1);
        triangle.add(list2);
        triangle.add(list3);
        triangle.add(list4);

        MinimumTotal minimumTotal = new MinimumTotal();
        System.out.println("最终的结果为:" + minimumTotal.minimumTotal(triangle));
    }
}
