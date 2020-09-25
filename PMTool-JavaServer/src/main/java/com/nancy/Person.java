package com.nancy;

import java.io.*;

public class Person implements Serializable {
    private static final long serialVersionUID = 1L; //一会就说这个是做什么的
    String name;

    int age;

    public Person(String name,int age){
        this.name = name;
        this.age = age;
    }

    public String toString(){
        return "name:"+name+"\tage:"+age;
    }
}
