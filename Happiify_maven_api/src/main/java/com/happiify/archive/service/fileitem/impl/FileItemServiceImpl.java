package com.happiify.archive.service.fileitem.impl;

import java.util.List;
import java.util.Map;

import com.happiify.archive.dao.FileItemDao;
import com.happiify.archive.domain.FileItem;
import com.happiify.archive.service.fileitem.FileItemService;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileItemServiceImpl implements FileItemService {

    @Autowired
    private FileItemDao fileItemDao;

    @Override
    public int addFileItem(FileItem item) {
        return fileItemDao.insert(item);
    }

    @Override
    public List<FileItem> fetchAllFileItems(int userId) {
        return fileItemDao.getFileItemsByUserId(userId);
    }

    @Override
    public int deleteFileItem(int fileItemId) {
        return fileItemDao.deleteFileItem(fileItemId);
    }

    @Override
    public int moveFileItem(@Param("fileItemId") int fileItemId,
                            @Param("destinationPath") String destinationPath,
                            @Param("isFolder") boolean isFolder,
                            @Param("currentPath") String currentPath) {
        return fileItemDao.moveFileItem(fileItemId, destinationPath, isFolder, currentPath);
    }

    @Override
    public int renameFileItem(int fileItemId, String newName) {
        return fileItemDao.renameFileItem(fileItemId, newName);
    }

    @Override
    public FileItem getFileItemDetail(int fileItemId) {
        return fileItemDao.getFileItemDetail(fileItemId);
    }

    @Override
    public void setFileItemToBePublic(int fileItemId, boolean isPublic) {
        fileItemDao.setFileItemToBePublic(fileItemId, isPublic);
    }

    @Override
    public void setFileItemToBeHealthRelated(int fileItemId) {
        fileItemDao.setFileItemToBeHealthRelated(fileItemId);
    }

    @Override
    public void setFileItemCategory(int itemId, int itemCategory, String newPath) {
        fileItemDao.setFileItemCategory(itemId, itemCategory, newPath);
    }

    @Override
    public void changeFileItemPath(int itemId, String destinationPath) {
        fileItemDao.changeFileItemPath(itemId, destinationPath);
    }

    @Override
    public void changeFileItemsPathInFolder(String currentPath, String destinationPath) {
        fileItemDao.changeFileItemsPathInFolder(currentPath, destinationPath);
    }

    @Override
    public void editFileItem(FileItem fileItem) {
        fileItemDao.editFileItem(fileItem);
    }

}