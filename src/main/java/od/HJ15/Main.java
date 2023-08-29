package od.HJ15;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日17:55:29
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int count = 0;
        while (n != 0) {
            n = n & (n-1);
            count++;
        }
        System.out.println(count);
    }
}
