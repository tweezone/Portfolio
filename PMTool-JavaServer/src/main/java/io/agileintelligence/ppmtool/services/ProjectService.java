package io.agileintelligence.ppmtool.services;

import io.agileintelligence.ppmtool.domain.Backlog;
import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.exceptions.ProjectIdException;
import io.agileintelligence.ppmtool.repositories.BacklogRepository;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    private BacklogRepository backlogRepository;
    public Project saveOrUpdateProject(Project project){
        //logic
        try {
            project.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());
            if(project.getId() == null){
                Backlog backlog =new Backlog();
                project.setBacklog(backlog);
                backlog.setProject(project);
                backlog.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());
            }
            if(project.getId() != null){
                Backlog backlog =backlogRepository.findByProjectIdentifier(project.getProjectIdentifier().toUpperCase());
                project.setBacklog(backlog);
            }
            return projectRepository.save(project);
        }catch (Exception e){
            throw new ProjectIdException("Project ID'" + project.getProjectIdentifier().toUpperCase() + "'already exists");
        }
    }
    public Project findProjectbyIdentifer(String projectId){
        Project project = projectRepository.findByProjectIdentifier(projectId.toUpperCase());
        if(project == null){
            throw new ProjectIdException("Project ID'" + projectId + "'does not exist");
        }

        return project;
    }
    public Iterable<Project> findAllProjects(){
        return projectRepository.findAll();
    }
    public void deleteProjectByIdentifier(String projectid){
        Project project = projectRepository.findByProjectIdentifier(projectid.toUpperCase());
        if(project == null){
            throw new ProjectIdException("cant delete project'"+projectid+"'this project not exist");
        }
        projectRepository.delete(project);
    }
}
