package ds;

/**
 * 线性表的增加（基于顺序存储的逻辑结构实现）
 *
 * @author yangyi 2018年05月04日20:08:37
 */
public class ListInsert {

    private static final int MAX_SIZE = 20;

    /**
     * 线性表
     */
    static class LineTable {
        /**
         * 线性表的物理存储结构
         */
        public Object[] objects;
        /**
         * 线性表当前的长度
         */
        public int length;

        /**
         * 给线性表里面装点值进去，但是别装满，因为我们还要往里塞
         */
        public LineTable() {
            objects = new Object[MAX_SIZE];
            for (int i = 0; i < 10; i++) {
                objects[i] = i;
                length++;
            }
        }
    }

    /**
     * @param data   要操作的数组的类
     * @param index  需要插入的位置（从1开始数）
     * @param object 需要插入的元素
     * @return
     * @throws Exception
     */
    private LineTable insertList(LineTable data,
                                 int index,
                                 Object object) throws Exception {
        if (data.length == MAX_SIZE) {
            throw new Exception("线性表已经满了");
        }

        if (index > data.length + 1 || index < 1) {
            throw new IndexOutOfBoundsException("超出了线性表的范围");
        }

        if (index < data.length + 1 && index >= 1) {
            for (int i = data.length - 1; i >= index - 1; i--) {
                data.objects[i + 1] = data.objects[i];
            }
        }
        data.objects[index - 1] = object;
        data.length++;
        return data;
    }

    public static void main(String[] args) {
        ListInsert listInsert = new ListInsert();
        try {
            for (Object object : listInsert.insertList(new LineTable(), 2, 88).objects) {
                System.out.println(object);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
