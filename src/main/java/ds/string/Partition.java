package ds.string;

import java.util.ArrayList;
import java.util.List;

/**
 * 分割回文串
 * <p>
 * <p>
 * 给定一个字符串 s，将 s 分割成一些子串，使每个子串都是回文串。
 * <p>
 * 返回 s 所有可能的分割方案。
 * <p>
 * 示例:
 * <p>
 * 输入: "aab"
 * 输出:
 * [
 * ["aa","b"],
 * ["a","a","b"]
 * ]
 *
 * @author yangyi 2019年03月02日16:02:12
 */
public class Partition {

    public List<List<String>> partition(String s) {

        List<List<String>> res = new ArrayList<>();

        for(int i = 0; i < s.length(); i++){
            if(check(s.substring(0, i + 1))){
                List<String> temp = new ArrayList<>();
                temp.add(s.substring(0, i + 1));
                split(s, i + 1, temp, res);
            }
        }
        return res;
    }

    //递归
    public void split(String s, int start, List<String> list,  List<List<String>> res){
        if(start == s.length()){
            res.add(list);
            return;
        }
        for(int i = start; i < s.length(); i++){
            ArrayList<String> temp = new ArrayList<>(list);
            if(check(s.substring(start, i + 1))){
                temp.add(s.substring(start, i + 1));
                split(s, i + 1, temp, res);
            }
        }
    }


    public boolean check(String s){
        int i = 0, j = s.length() - 1;
        while(i < j){
            if(s.charAt(i) == s.charAt(j)){
                i++;
                j--;
            }else{
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        String a = "aab";
        Partition partition = new Partition();
        for (List<String> strings : partition.partition(a)) {
            for (String string : strings) {
                System.out.println(string);
            }
        }
    }
}
