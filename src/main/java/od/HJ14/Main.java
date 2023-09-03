package od.HJ14;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日17:12:31
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        ArrayList<String> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String str = in.next();
            list.add(str);
        }
        list.sort(Comparator.naturalOrder());
        for (String s : list) {
            System.out.println(s);
        }
    }
}
