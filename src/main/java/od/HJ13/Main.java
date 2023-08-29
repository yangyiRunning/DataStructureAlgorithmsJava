package od.HJ13;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日17:03:34
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.nextLine();
        char[] chars = str.toCharArray();
        if (str.contains(" ")) {
            String[] strs = str.split(" ");
            for (int i = strs.length - 1; i >= 0; i--) {
                System.out.print(strs[i] + " ");
            }
        } else {
            for (char aChar : chars) {
                System.out.print(aChar);
            }
        }
    }
}
