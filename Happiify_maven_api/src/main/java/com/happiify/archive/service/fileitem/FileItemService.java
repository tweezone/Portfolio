package com.happiify.archive.service.fileitem;

import java.util.List;

import com.happiify.archive.domain.FileItem;

public interface FileItemService {
    int addFileItem(FileItem item);

    List<FileItem> fetchAllFileItems(int userId);

    int deleteFileItem(int fileItemId);

    int moveFileItem(int fileItemId, String destinationPath, boolean isFolder, String currentPath);

    int renameFileItem(int fileItemId, String newName);

    FileItem getFileItemDetail(int fileItemId);

    void setFileItemToBePublic(int fileItemId, boolean isPublic);

    void setFileItemToBeHealthRelated(int fileItemId);

    void setFileItemCategory(int itemId, int itemCategory, String newPath);

    void changeFileItemPath(int itemId, String destinationPath);

    void changeFileItemsPathInFolder(String currentPath, String destinationPath);

    void editFileItem(FileItem fileItem);
}