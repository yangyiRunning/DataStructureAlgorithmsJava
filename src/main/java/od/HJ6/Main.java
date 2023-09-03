package od.HJ6;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日15:33:05
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        long n = in.nextLong();
        long sqrt = (long) Math.sqrt(n);
        for (int i = 2; i <= sqrt; i++) {
            while (n % 2 == 0) {
                n /= i;
                System.out.println(i + " ");
            }
        }
        if (n != 1) {
            System.out.println(n + " ");
        }
    }
}
