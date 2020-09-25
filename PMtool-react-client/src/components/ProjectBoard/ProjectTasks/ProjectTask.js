import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ProjectTask extends Component {
  render() {
    //const id = this.props.key;//key is uniq for list of child (backlog), better not access it
    const { project_task } = this.props;
    let priorityString;
    let priorityClass;
    if (project_task.priority === 1) {
      priorityString = "HIGH";
      priorityClass = "bg-danger text-light";
    } else if (project_task.priority === 2) {
      priorityString = "MEDIUM";
      priorityClass = "bg-warning text-light";
    } else {
      priorityString = "LOW";
      priorityClass = "bg-info text-light";
    }
    return (
      <div className="card mb-1 bg-light">
        <div className={`card-header text-primary ${priorityClass}`}>
          ID: {project_task.projectSequence} -- Priority: {priorityString}
        </div>
        <div className="card-body bg-light">
          <h5 className="card-title">{project_task.summary}</h5>
          <p className="card-text text-truncate ">
            {project_task.acceptanceCriteria}
          </p>
          <Link
            to={`/updateProjectTask/${project_task.projectIdentifier}/${project_task.projectSequence}`}
            className="btn btn-primary"
          >
            View / Update
          </Link>

          <button className="btn btn-danger ml-4">Delete</button>
        </div>
      </div>
    );
  }
}
