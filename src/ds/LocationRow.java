package ds;

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

    /**
     * 递归方式实现
     */
    public int locationRowRecursion(int n) {
        if (n == 1) {
            return 1;
        }
        return locationRowRecursion(n - 1) + 1;
    }

    /**
     * 非递归方式实现
     */
    public int locationRowNonRecursion(int n) {
        int row = 1;
        for (int i = 1; i <= n - 1; i++) {
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
