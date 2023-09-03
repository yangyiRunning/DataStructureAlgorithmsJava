package od.HJ2;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日13:16:17
 */
class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String a = in.nextLine();
        String b = in.nextLine();
        System.out.println(a.length() - a.toLowerCase().replaceAll(b.toLowerCase(), "").length());
    }
}
