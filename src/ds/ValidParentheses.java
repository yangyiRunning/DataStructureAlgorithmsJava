package ds;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

/**
 * 判断有效的括号
 *
 * @author yangyi 2019年01月22日13:48:19
 */
public class ValidParentheses {

    private Map<Character, Character> map;

    {
        map = new HashMap<>();
        map.put(')', '(');
        map.put(']', '[');
        map.put('}', '{');
    }

    public boolean isValid(String value) {
        //准备一个映射来保存括号关系，右括号作为key是为了更好的适应map的contain查找方法来查找key对应的value
        Stack<Character> characterStack = new Stack<>();
        for (int i = 0; i < value.length(); i++) {
            char target = value.charAt(i);
            if (map.containsKey(target)) {
                //如果遍历的字符串中的字符是右括号，从栈中弹出一个先前压入栈的左括号和它配对
                char pop;
                if (characterStack.isEmpty()) {
                    pop = '#';
                } else {
                    pop = characterStack.pop();
                }
                //如果从栈中拿出的元素不符合映射表的规则，结论已经有了，一切都该结束了
                if (!(pop == map.get(target))) {
                    return false;
                }
            } else {
                //如果遍历的字符串中的字符是左括号，放入栈中
                characterStack.push(target);
            }
        }
        return characterStack.isEmpty();
    }

    public static void main(String[] args) {
        String one = "()";
        String two = "()[]";
        String three = "([)]";
        String four = "(((([]))";
        String five = "]][[";

        ValidParentheses validParentheses = new ValidParentheses();
        System.out.println(one + (validParentheses.isValid(one) ? "有效" : "无效"));
        System.out.println(two + (validParentheses.isValid(two) ? "有效" : "无效"));
        System.out.println(three + (validParentheses.isValid(three) ? "有效" : "无效"));
        System.out.println(four + (validParentheses.isValid(four) ? "有效" : "无效"));
        System.out.println(five + (validParentheses.isValid(five) ? "有效" : "无效"));
    }
}
