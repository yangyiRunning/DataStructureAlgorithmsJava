package od.HJ5;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日13:51:10
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.nextLine();
        System.out.println(Integer.parseInt(str.substring(2), 16));
    }
}
