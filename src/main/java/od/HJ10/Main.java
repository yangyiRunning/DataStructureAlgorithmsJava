package od.HJ10;

import java.util.HashSet;
import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日16:46:50
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.nextLine();
        char[] chars = str.toCharArray();
        HashSet<Character> set = new HashSet<>();
        for (char aChar : chars) {
            if (aChar > 0 && aChar < 127) {
                if (!set.contains(aChar)) {
                    set.add(aChar);
                }
            }
        }
        System.out.println(set.size());
    }
}
