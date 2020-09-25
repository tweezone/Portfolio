package com.nancy;

import com.sun.xml.internal.ws.addressing.EPRSDDocumentFilter;

import java.io.*;
import java.util.Arrays;

/**
 * @Author Nancy
 * @Date
 * @Version
 * @Description com.nancy
 */
public class SerializableDemo{

 /**
 *@param: 
 *@return: 
 *@auther: 
 *@date:  
 */
    public static void main(String[] args) {
        File file = new File("c:\\nan"+ File.separator+"out.txt");
        String name="nancy";
        FileOutputStream fos = null;
      

        try {
            fos = new FileOutputStream(file);
            ObjectOutputStream oos = null;
            try {
                oos = new ObjectOutputStream(fos);
                Person person = new Person("tom", 22);
                System.out.println(person);
                oos.writeObject(person);			//写入对象
                oos.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }finally{
                try {
                    oos.close();
                } catch (IOException e) {
                    System.out.println("oos关闭失败："+e.getMessage());
                }
            }
        } catch (FileNotFoundException e) {
            System.out.println("找不到文件："+e.getMessage());
        } finally{
            try {
                fos.close();
            } catch (IOException e) {
                System.out.println("fos关闭失败："+e.getMessage());
            }
        }

        FileInputStream fis = null;
        try {
            fis = new FileInputStream(file);
            ObjectInputStream ois = null;
            try {
                ois = new ObjectInputStream(fis);
                try {
                    Person person = (Person)ois.readObject();	//读出对象
                    System.out.println(person);
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }finally{
                try {
                    ois.close();
                } catch (IOException e) {
                    System.out.println("ois关闭失败："+e.getMessage());
                }
            }
        } catch (FileNotFoundException e) {
            System.out.println("找不到文件："+e.getMessage());
        } finally{
            try {
                fis.close();
            } catch (IOException e) {
                System.out.println("fis关闭失败："+e.getMessage());
            }
        }
    }
}
