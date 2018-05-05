package ds;

/**
 * 线性表的删除（基于顺序存储的逻辑结构实现）
 *
 * @author yangyi 2018年05月05日11:59:20
 */
public class ListDelete {

    /**
     * 线性表的最大容量
     */
    private static final int MAX_SIZE = 20;

    /**
     * 代表线性表的类
     */
    static class LinkTable {
        public Object[] objects;
        /**
         * 线性表的长度
         */
        public int length;

        /**
         * 因为是删除的相关操作，所以将线性表初始化的时候装满方便测试
         */
        public LinkTable() {
            objects = new Object[MAX_SIZE];
            for (int i = 0; i < MAX_SIZE; i++) {
                objects[i] = i;
                length++;
            }
        }
    }

    /**
     * @param data  线性表本身
     * @param index 删除的位置
     * @return 删除了的元素
     */
    public Object deleteList(LinkTable data,
                             int index) throws Exception {
        if (data.length == 0) {
            throw new Exception("都空表了你还删除个毛线啊");
        }

        if (index < 1 || index > data.length) {
            throw new IndexOutOfBoundsException("删除的位置必须位于线性表的内部");
        }

        Object returnObj = null;
        if (index >= 1 && index <= data.length) {
            //返回删除位置对应的值
            returnObj = data.objects[index - 1];
            for (int i = index; i < data.length; i++) {
                data.objects[i - 1] = data.objects[i];
            }
            //删除后将最后一位置null
            data.objects[data.length - 1] = null;
        }
        data.length--;
        return returnObj;
    }

    public static void main(String[] args) {
        ListDelete listDelete = new ListDelete();
        LinkTable linkTable = new LinkTable();
        try {
            System.out.println("删除的元素为：" + listDelete.deleteList(linkTable, 20));
        } catch (Exception e) {
            e.printStackTrace();
        }
        for (Object object : linkTable.objects) {
            System.out.println(object);
        }
    }

}
