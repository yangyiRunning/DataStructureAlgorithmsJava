package ds.reverse;

/**
 * 反转一个数组
 *
 * @author yangyi 2019年01月03日22:48:11
 */
public class ReverseArray {

    /**
     * 以数组中间的索引为界点，左右互换元素
     */
    private int[] reverseArray(int[] ints) {
        int mid = ints.length / 2;
        for (int i = 0; i < mid; i++) {
            int temp = ints[i];
            ints[i] = ints[ints.length - 1 - i];
            ints[ints.length - 1 - i] = temp;
        }
        return ints;
    }

    public static void main(String[] args) {
        int[] ints = new int[10];
        System.out.println("构造一个包含10个范围为0~100的随机数的数组:");
        for (int i = 0; i < ints.length; i++) {
            ints[i] = (int) (Math.random() * 10);
            System.out.print(ints[i] + " ");
        }
        System.out.println();
        System.out.println("反转后的数组:");
        ReverseArray reverseArray = new ReverseArray();
        int[] results = reverseArray.reverseArray(ints);
        for (int result : results) {
            System.out.print(result + " ");
        }
    }
}
