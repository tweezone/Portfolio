package io.agileintelligence.ppmtool.web;

import io.agileintelligence.ppmtool.domain.ProjectTask;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;
import io.agileintelligence.ppmtool.services.ProductTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.xml.ws.Response;
import java.util.List;

@RestController
@RequestMapping("/api/backlog")
@CrossOrigin
public class BacklogController {
    @Autowired
    ProductTaskService productTaskService;
    @Autowired
    MapValidationErrorService mapValidationErrorService;
    @PostMapping("/{backlog_id}")
    public ResponseEntity <?> addPTtoBacklog(@Valid @RequestBody ProjectTask projectTask, BindingResult result,
                                             @PathVariable String backlog_id){
        ResponseEntity<?> errResponse =  mapValidationErrorService.MapValidationService(result);
        if(errResponse!=null)
            return errResponse;
        ProjectTask responsePT = productTaskService.addProjectTask(backlog_id, projectTask);
        return new ResponseEntity<ProjectTask>(responsePT, HttpStatus.CREATED);
    }
    @GetMapping("/{backlog_id}")
    public Iterable<ProjectTask> getProjectTasks(@PathVariable String backlog_id){
        return productTaskService.findBacklogById(backlog_id);

    }
    @GetMapping("/{backlog_id}/{pt_id}")
    public ResponseEntity<?> getProjectTask(@PathVariable String backlog_id, @PathVariable String pt_id){
        ProjectTask projectTask=productTaskService.findPTByProjectSequence(backlog_id, pt_id);
        return new ResponseEntity<ProjectTask>(projectTask, HttpStatus.OK);
    }

@PatchMapping("/{backlog_id}/{pt_id}")
    public ResponseEntity<?> updateProjectTask(@Valid @RequestBody ProjectTask projectTask, BindingResult result,
                                               @PathVariable String backlog_id, @PathVariable String pt_id){
        ResponseEntity<?> errorMap=mapValidationErrorService.MapValidationService(result);
        if (errorMap!=null) return errorMap;
        ProjectTask updatedTask= productTaskService.updateByProjectSequence(projectTask, backlog_id, pt_id);
        return new ResponseEntity<ProjectTask>(updatedTask, HttpStatus.OK);
}

@DeleteMapping("/{backlog_id}/{pt_id}")
    public ResponseEntity<?> deleteProjectTask(@PathVariable String backlog_id, @PathVariable String pt_id){
    productTaskService.deletePTByProjectSequence(backlog_id,pt_id );
    return new ResponseEntity<String >("deleted", HttpStatus.OK);

}
}
