package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * N皇后
 * LeetCode 51 https://leetcode-cn.com/problems/n-queens/
 *
 * @author yangyi 2020年12月17日15:06:47
 */
public class SolveNQueens {

    private List<List<String>> result = new LinkedList<>();

    public List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for (char[] i : board) {
            Arrays.fill(i, '.');
        }
        backtrack(board, 0);
        return result;
    }

    private void backtrack(char[][] board, int row) {
        if (row == board.length) {
            result.add(array2List(board));
            return;
        }

        for (int j = 0; j < board[row].length; j++) {
            if (!check(board, row, j)) {
                continue;
            }
            board[row][j] = 'Q';
            backtrack(board, row + 1);
            board[row][j] = '.';
        }
    }

    List<String> array2List(char[][] board) {
        List<String> res = new LinkedList<>();
        for (char[] i : board) {
            StringBuilder sb = new StringBuilder();
            for (char j : i) {
                sb.append(j);
            }
            res.add(sb.toString());
        }
        return res;
    }

    boolean check(char[][] board, int row, int col) {
        int n = board.length;
        // 检查列是否有皇后互相冲突
        for (int i = 0; i < n; i++) {
            if (board[i][col] == 'Q')
                return false;
        }
        // 检查右上方是否有皇后互相冲突
        for (int i = row - 1, j = col + 1;
             i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q')
                return false;
        }
        // 检查左上方是否有皇后互相冲突
        for (int i = row - 1, j = col - 1;
             i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q')
                return false;
        }
        return true;
    }

    public static void main(String[] args) {
        SolveNQueens solveNQueens = new SolveNQueens();
        System.out.println(Arrays.toString(solveNQueens.solveNQueens(4).toArray()));
    }
}
