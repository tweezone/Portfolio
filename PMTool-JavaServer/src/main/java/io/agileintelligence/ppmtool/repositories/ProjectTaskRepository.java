package io.agileintelligence.ppmtool.repositories;

import io.agileintelligence.ppmtool.domain.ProjectTask;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProjectTaskRepository extends CrudRepository<ProjectTask, Long> {
     List<ProjectTask> findByProjectIdentifier(String backlog_id);
     List<ProjectTask> findByProjectIdentifierOrderByPriority(String backlog_id);
     ProjectTask findByProjectSequence(String sequence);

}
