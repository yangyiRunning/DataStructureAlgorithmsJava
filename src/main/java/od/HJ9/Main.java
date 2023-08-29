package od.HJ9;

import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

/**
 * @author yangyi 2023年08月29日16:18:51
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String n = in.nextLine();
        char[] chars = n.toCharArray();
        Set<Character> set = new HashSet<>();
        for (int i = chars.length - 1; i >= 0; i--) {
            if (!set.contains(chars[i])) {
                set.add(chars[i]);
                System.out.print(chars[i]);
            }
        }
    }
}
