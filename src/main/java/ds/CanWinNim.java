package ds;

/**
 * Nim游戏
 * <p>
 * 你们是聪明人，每一步都是最优解。 编写一个函数，来判断你是否可以在给定石头数量的情况下赢得游戏。
 * <p>
 * 示例:
 * <p>
 * 输入: 4
 * 输出: false
 * 解释: 如果堆中有 4 块石头，那么你永远不会赢得比赛；
 * 因为无论你拿走 1 块、2 块 还是 3 块石头，最后一块石头总是会被你的朋友拿走。
 *
 * @author yangyi 2019年02月10日22:03:50
 */
public class CanWinNim {

    /**
     * 只要不是4的整数倍，你就稳赢
     */
    public boolean canWinNim(int n) {
        return n % 4 != 0;
    }

    public static void main(String[] args) {
        CanWinNim canWinNim = new CanWinNim();
        System.out.println(canWinNim.canWinNim(4));
        System.out.println(canWinNim.canWinNim(7));
        System.out.println(canWinNim.canWinNim(11));
        System.out.println(canWinNim.canWinNim(16));
    }
}
