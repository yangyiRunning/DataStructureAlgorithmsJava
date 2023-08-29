package od.HJ106;

import java.util.Scanner;

/**
 * @author yangyi 2023年08月29日18:40:12
 */
class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String n = in.nextLine();
        int start = 0;
        int end = n.length() - 1;
        char[] chars = n.toCharArray();
        while (start < end) {
            char temp = chars[start];
            chars[start] = chars[end];
            chars[end] = temp;
            start++;
            end--;
        }
        for (char aChar : chars) {
            System.out.print(aChar);
        }
    }
}
