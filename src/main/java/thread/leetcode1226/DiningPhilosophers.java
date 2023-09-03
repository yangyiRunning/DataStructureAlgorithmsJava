package thread.leetcode1226;

import java.util.concurrent.Semaphore;

/**
 * 哲学家进餐
 * LeetCode 1226 https://leetcode.cn/problems/the-dining-philosophers/
 *
 * @author yangyi 2022年08月11日18:59:39
 */
public class DiningPhilosophers {

    private Semaphore s = new Semaphore(1);

    public DiningPhilosophers() {

    }

    // call the run() method of any runnable to execute its code
    public void wantsToEat(int philosopher,
                           Runnable pickLeftFork,
                           Runnable pickRightFork,
                           Runnable eat,
                           Runnable putLeftFork,
                           Runnable putRightFork) throws InterruptedException {
        s.acquire();
        pickLeftFork.run();
        pickRightFork.run();
        eat.run();
        putLeftFork.run();
        putRightFork.run();
        s.release();
    }
}
