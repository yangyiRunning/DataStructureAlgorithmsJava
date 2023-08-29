package od.HJ1;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日12:55:18
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.nextLine();
        char[] chars = str.toCharArray();
        int count = 0;
        for (int i = chars.length - 1; i >= 0; i--) {
            if (chars[i] != ' ') {
                count++;
            } else {
                break;
            }
        }
        System.out.println(count);
    }
}
