package ds;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class FileSearch {

    private List<File> files = new ArrayList<>();
    private List<File> filesList = new ArrayList<>();

    /**
     * 递归方式输出一个路径下的所有文件名，但是会有stackoverflow的风险
     */
    private List<File> getFiles(String filePath) {
        File file = new File(filePath);
        File[] filesArray = file.listFiles();
        if (filesArray != null) {
            for (File file1 : filesArray) {
                if (file1.isDirectory()) {
                    getFiles(file1.getAbsolutePath());
                } else {
                    files.add(file1);
                }
            }
        }
        return files;
    }

    /**
     * 用栈模拟递归，输出一个路径下的所有文件名，没有stackoverflow的风险
     */
    private List<File> getFilesStack(String filePath) {
        Stack<File> stack = new Stack<>();
        File file = new File(filePath);
        stack.push(file);
        while (!stack.isEmpty()) {
            File currentFile = stack.pop();
            File[] fileArray = currentFile.listFiles();
            if (fileArray != null) {
                for (File file1 : fileArray) {
                    if (file1.isDirectory()) {
                        stack.push(file1);
                    } else {
                        filesList.add(file1);
                    }
                }
            }
        }
        return filesList;
    }

    public static void main(String[] args) {
        FileSearch fileSearch = new FileSearch();
        List<File> files = fileSearch.getFiles("/Users/yangyi/DS");
        for (File file : files) {
            System.out.println(file.getName());
        }
        System.out.println("==================================");
        FileSearch fileSearch2 = new FileSearch();
        List<File> files2 = fileSearch2.getFilesStack("/Users/yangyi/DS");
        for (File file : files2) {
            System.out.println(file.getName());
        }
    }
}