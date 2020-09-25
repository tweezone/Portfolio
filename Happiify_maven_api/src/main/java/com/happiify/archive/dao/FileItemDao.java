package com.happiify.archive.dao;

import com.happiify.archive.domain.FileItem;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface FileItemDao {

    int insert(  item);

    int deleteFileItem(int fileItemId);

    int moveFileItem(@Param("fileItemId") int fileItemId,
                     @Param("destinationPath") String destinationPath,
                     @Param("isFolder") boolean isFolder,
                     @Param("currentPath") String currentPath);

    int renameFileItem(@Param("fileItemId") int fileItemId, @Param("newName") String newName);

    FileItem getFileItemDetail(int fileItemId);

    List<FileItem> getFileItemsByUserId(int userId);

    void setFileItemToBePublic(@Param("fileItemId") int fileItemId, @Param("isPublic") boolean isPublic);

    void setFileItemToBeHealthRelated(int fileItemId);

    void setFileItemCategory(@Param("itemId") int itemId, @Param("itemCategory") int itemCategory, @Param("newPath") String newPath);

    void changeFileItemPath(@Param("itemId") int itemId, @Param("destinationPath") String destinationPath);

    void changeFileItemsPathInFolder(@Param("currentPath") String currentPath, @Param("destinationPath") String destinationPath);
    void editFileItem(FileItem fileItem);
}