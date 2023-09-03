package od.HJ4;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日13:44:01
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.nextLine();
        while (str.length() >= 8) {
            System.out.println(str.substring(0, 8));
            str = str.substring(8);
        }
        if (str.length() < 8 && str.length() > 0) {
            str += "00000000";
            System.out.println(str.substring(0, 8));
        }
    }
}
