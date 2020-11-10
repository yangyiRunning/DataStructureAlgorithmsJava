package pat.pat1017;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * 1017 A除以B (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805305181847552
 *
 * @author yangyi
 */
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        String[] ab = bufferedReader.readLine().split(" ");
        bufferedReader.close();
        String A = ab[0];
        int B = Integer.parseInt(ab[1]);
        //	  初始化结果和余数
        StringBuilder result = new StringBuilder();//结果
        String remainder = "";//余数
        for (int i = 0; i < A.length(); i++) {
            int dividend = Integer.parseInt(remainder + A.charAt(i));
            result.append(dividend / B);
            remainder = String.valueOf(dividend % B);
        }
        //	  如果结果的第一位数是0，就把结果第一位去掉
        if (result.charAt(0) == '0' && result.length() != 1) {
            result = new StringBuilder(result.substring(1));
        }
        System.out.println(result + " " + remainder);
    }
}
