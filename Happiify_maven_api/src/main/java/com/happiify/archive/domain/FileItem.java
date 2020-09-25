package com.happiify.archive.domain;

import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


public class FileItem<MultipartFile> implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;
    private String item_path;
    private Integer user_id;
    private String item_description;
    private Date creation_date;
    private String str_creation_date;
    private String item_name;
    private MultipartFile item_file;
    private Boolean is_private = true;
    private Boolean is_financial = false;
    private Boolean is_encrypted = false;
    private Boolean is_health = false;
    private Boolean is_folder;
    private Boolean is_deleted = false;
    private List<String> shared_with;
    private Date modify_date;
    private String physical_name;
    private String user_name;
    private long item_size = 0;
    private Integer item_category;

    public String getItem_name() {
        return item_name;
    }

    public void setItem_name(String item_name) {
        this.item_name = item_name;
    }

    public MultipartFile getItem_file() {
        return item_file;
    }

    public void setItem_file(MultipartFile item_file) {
        this.item_file = item_file;
    }

    public String getStr_creation_date() {
        return str_creation_date;
    }

    public void setStr_creation_date(String str_creation_date) {
        this.str_creation_date = str_creation_date;
    }


    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getItem_path() {
        return item_path;
    }

    public void setItem_path(String item_path) {
        this.item_path = item_path;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public String getItem_description() {
        return item_description;
    }

    public void setItem_description(String item_description) {
        this.item_description = item_description;
    }

    public Date getCreation_date() {
        return creation_date;
    }

    public void setCreation_date(Date creation_date) {

        this.creation_date = creation_date;
    }

    public Boolean getIs_private() {
        return is_private;
    }

    public void setIs_private(Boolean is_private) {
        this.is_private = is_private;
    }

    public Boolean getIs_health() {
        return is_health;
    }

    public void setIs_health(Boolean is_health) {
        this.is_health = is_health;
    }

    public Boolean getIs_folder() {
        return is_folder;
    }

    public void setIs_folder(Boolean is_folder) {
        this.is_folder = is_folder;
    }

    public Boolean getIs_deleted() {
        return is_deleted;
    }

    public void setIs_deleted(Boolean is_deleted) {
        this.is_deleted = is_deleted;
    }

    public List<String> getShared_with() {
        return shared_with;
    }

    public void setShared_with(List<String> shared_with) {
        this.shared_with = shared_with;
    }

    public Date getModify_date() {
        return modify_date;
    }

    public void setModify_date(Date modify_date) {
        this.modify_date = modify_date;
    }

    public String getPhysical_name() {
        return physical_name;
    }

    public void setPhysical_name(String physical_name) {
        this.physical_name = physical_name;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public long getItem_size() {
        return item_size;
    }

    public void setItem_size(long item_size) {
        this.item_size = item_size;
    }

    public Boolean getIs_financial() {
        return is_financial;
    }

    public void setIs_financial(Boolean is_financial) {
        this.is_financial = is_financial;
    }

    public Boolean getIs_encrypted() {
        return is_encrypted;
    }

    public void setIs_encrypted(Boolean is_encrypted) {
        this.is_encrypted = is_encrypted;
    }

    public Integer getItem_category() {
        return item_category;
    }

    public void setItem_category(Integer item_category) {
        this.item_category = item_category;
    }
}