package ds.dp;

/**
 * 斐波拉契数列的4种解法
 * 1. 递归
 * 2. 缓存前次递归结果
 * 3. 动态规划
 * 4. 原地动态规划
 *
 * @author yangyi 2020年05月13日23:27:20
 */
public class Fipolach {

    /**
     * 1. 递归
     * 时间复杂度O(2^n),空间复杂度O(n),不仅占用了额外空间,而且内含大量重复计算,恐怖的指数级复杂度,一般不采用此方法
     */
    private static int fipoRecursive(int n) {
        if (n < 2) {
            return n;
        }
        return fipoRecursive(n - 1) + fipoRecursive(n - 2);
    }

    /**
     * 2. 缓存前次递归结果
     * 时间复杂度为O(n),空间复杂度为O(n),依旧占用了额外空间,但是消除了重复计算,将复杂度降为了线性阶,但是本质依旧是递归
     */
    private static int fipoRecursiveCache(int n) {
        if (n < 2) {
            return n;
        }
        int[] cache = new int[n + 1];
        if (cache[n] == 0) {
            cache[n] = fipoRecursiveCache(n - 1) + fipoRecursiveCache(n - 2);
        }
        return cache[n];
    }

    /**
     * 3. 动态规划
     * 时间复杂度为O(n),空间复杂度为O(n),仍然占用了额外空间,和递归的计算顺序正好相反
     * 递归的计算顺序为: 求当前数的过程当中去计算前两个数的结果
     * 动态规划的计算顺序为: 已知前两个数的结果去计算当前的数
     */
    private static int fipoDp(int n) {
        if (n < 2) {
            return n;
        }
        int[] result = new int[n + 1];
        result[0] = 0;
        result[1] = 1;
        for (int i = 2; i <= n; i++) {
            result[i] = result[i - 2] + result[i - 1];
        }
        return result[n];
    }

    /**
     * 4. 原地动态规划
     * 时间复杂度为O(n),空间复杂度为O(1),不占用额外的空间,和递归的计算顺序正好相反
     * 已知前两个数的结果去计算当前的数
     * 此方法为最佳实践
     */
    private static int fipoDpInPlace(int n) {
        if (n < 2) {
            return n;
        }
        int n0 = 0, n1 = 1, temp;
        for (int i = 2; i <= n; i++) {
            temp = n0 + n1;
            n0 = n1;
            n1 = temp;
        }
        return n1;
    }

    public static void main(String[] args) {
        System.out.println("1. 依次打出斐波拉切数列: ↓");
        for (int i = 0; i < 10; i++) {
            System.out.print(fipoRecursive(i) + " ");
        }

        System.out.println();
        System.out.println("2. 依次打出斐波拉切数列: ↓");
        for (int i = 0; i < 10; i++) {
            System.out.print(fipoRecursiveCache(i) + " ");
        }

        System.out.println();
        System.out.println("3. 依次打出斐波拉切数列: ↓");
        for (int i = 0; i < 10; i++) {
            System.out.print(fipoDp(i) + " ");
        }

        System.out.println();
        System.out.println("4. 依次打出斐波拉切数列: ↓");
        for (int i = 0; i < 10; i++) {
            System.out.print(fipoDpInPlace(i) + " ");
        }
    }
}
