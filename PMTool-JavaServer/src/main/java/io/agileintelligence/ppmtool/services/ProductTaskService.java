package io.agileintelligence.ppmtool.services;

import io.agileintelligence.ppmtool.domain.Backlog;
import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.exceptions.ProjectNotFoundException;
import io.agileintelligence.ppmtool.repositories.BacklogRepository;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;
import io.agileintelligence.ppmtool.repositories.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductTaskService {
    @Autowired
    private ProjectTaskRepository projectTaskRepository;
    @Autowired
    private BacklogRepository backlogRepository;
    @Autowired
    private ProjectRepository projectReposity;
    public ProjectTask addProjectTask(String projectIdentifier, ProjectTask projectTask){

       try {
           Backlog backlog = backlogRepository.findByProjectIdentifier(projectIdentifier);
           projectTask.setBacklog(backlog);
           Integer backlogSequence = backlog.getPTSequence();
           Integer newSequence = backlogSequence + 1;
           backlog.setPTSequence(newSequence);
           projectTask.setProjectSequence(projectIdentifier + "_" + newSequence);
           projectTask.setProjectIdentifier(projectIdentifier);
           if ((projectTask.getPriority()==0)||(projectTask.getPriority() == null)) {
               projectTask.setPriority(3);
           }
           if (projectTask.getStatus() == "" || projectTask.getStatus() == null) {
               projectTask.setStatus("TO_DO");
           }
           // projectTask.setBacklog(backlog);
           return projectTaskRepository.save(projectTask);
       }catch(Exception e){
           throw new ProjectNotFoundException(("Project not found"));
       }
    }
    public Iterable<ProjectTask> findBacklogById(String project_id){
        Project project = projectReposity.findByProjectIdentifier(project_id);
        if(project==null){
            throw new ProjectNotFoundException("Prject with ID"+ project_id + "does not exist");
        }
       return projectTaskRepository.findByProjectIdentifierOrderByPriority(project_id);

    }
public ProjectTask findPTByProjectSequence(String backlog_id, String sequence){
        Backlog backlog = backlogRepository.findByProjectIdentifier(backlog_id);
        if (backlog==null)
        {
            throw new ProjectNotFoundException("Project with "+backlog_id+"doesnot exist");
                    }
        ProjectTask projectTask= projectTaskRepository.findByProjectSequence(sequence);
        if (projectTask==null){
            throw new ProjectNotFoundException("ProjectTask with "+sequence+"not found");
        }
        if(!projectTask.getProjectIdentifier().equals(backlog_id)){
            throw new ProjectNotFoundException("ProjectTask with "+sequence+"does not exist in project"+backlog_id);
        };
        return projectTaskRepository.findByProjectSequence(sequence);

}
   public ProjectTask updateByProjectSequence(ProjectTask updatedTask, String backlog_id, String pt_id){
        ProjectTask projectTask = findPTByProjectSequence(backlog_id, pt_id);
        projectTask=updatedTask;
        return projectTaskRepository.save(projectTask);
   }
    public void deletePTByProjectSequence(String backlog_id, String pt_id){
        ProjectTask projectTask= findPTByProjectSequence(backlog_id, pt_id);

        projectTaskRepository.delete(projectTask);
    }
}
