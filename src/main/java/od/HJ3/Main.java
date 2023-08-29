package od.HJ3;

import java.util.Scanner;
import java.util.TreeSet;

/**
 * @author yangyi 2023年08月29日13:25:04
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        TreeSet<Integer> result = new TreeSet<>();
        for (int i = 0; i < n; i++) {
            result.add(in.nextInt());
        }
        for (Integer integer : result) {
            System.out.println(integer);
        }
    }

}
