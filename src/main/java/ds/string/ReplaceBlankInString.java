package ds.string;

/**
 * 替换字符串中的空格
 * <p>
 * 目标: 将字符串中的字符替换为%20
 *
 * @author yangyi 2019年02月09日09:51:12
 */
public class ReplaceBlankInString {

    public char[] replaceBlankInString(char[] chars) {
        if (chars == null || chars.length <= 0) {
            return new char[0];
        }

        //字符串实际长度
        int originalLength = 0;
        //空格的个数
        int numberOfBlank = 0;
        int i = 0;
        //先统计出来源字符串有多长，以及其中包含多少个空格
        while (i < chars.length) {
            originalLength++;
            if (chars[i] == ' ') {
                numberOfBlank++;
            }
            i++;
        }
        //统计出来之后开辟一个新数组的长度
        int newLength = originalLength + numberOfBlank * 2;
        if (newLength < chars.length) {
            return new char[0];
        }

        //开辟一个新的长度的数组用来进行原始数据的移动
        char[] newChar = new char[newLength];
        for (int i1 = 0; i1 < chars.length; i1++) {
            newChar[i1] = chars[i1];
        }

        int indexOfOriginal = originalLength - 1;
        int indexOfNew = newLength - 1;
        //从尾到头替换
        while (indexOfOriginal >= 0 && indexOfNew > indexOfOriginal) {
            if (newChar[indexOfOriginal] == ' ') {
                newChar[indexOfNew--] = '0';
                newChar[indexOfNew--] = '2';
                newChar[indexOfNew--] = '%';
            } else {
                newChar[indexOfNew--] = chars[indexOfOriginal];
            }
            indexOfOriginal--;
        }
        return newChar;
    }

    public static void main(String[] args) {
        String string = "we are Chinese";
        String string1 = "            ";
        String string2 = "";
        String string3 = " ";
        String string4 = " we are Chinese ";
        ReplaceBlankInString replaceBlankInString = new ReplaceBlankInString();
        System.out.println(replaceBlankInString.replaceBlankInString(string.toCharArray()));
        System.out.println(replaceBlankInString.replaceBlankInString(string1.toCharArray()));
        System.out.println(replaceBlankInString.replaceBlankInString(string2.toCharArray()));
        System.out.println(replaceBlankInString.replaceBlankInString(string3.toCharArray()));
        System.out.println(replaceBlankInString.replaceBlankInString(string4.toCharArray()));
    }
}
