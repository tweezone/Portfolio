import React, { Component } from "react";
import { Link } from "react-router-dom";
import Backlog from "./Backlog";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBacklog } from "../../actions/backlogActions";

class ProjectBoard extends Component {
  //constructor to handle errors
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBacklog(id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { project_Tasks } = this.props.backlogprop;
    const { errors } = this.state;
    const boardAlgorithm = (errors, project_Tasks) => {
      if (project_Tasks.length < 1) {
        if (errors.projectNotFound) {
          return (
            <div className="alert alert-danger text-center " role="alert">
              {errors.projectNotFound}
            </div>
          );
        } else {
          return (
            <div className="alert alert-info text-center" role="alert">
              No Project Tasks in this Project board
            </div>
          );
        }
      } else {
        return <Backlog project_tasks_prop={project_Tasks} />;
      }
    };
    let contentBoard = boardAlgorithm(errors, project_Tasks);

    return (
      <div className="container">
        <Link to={`/addProjectTask/${id}`} className="btn btn-primary mb-3">
          <i className="fas fa-plus-circle"> Create Project Task</i>
        </Link>
        <br />
        <hr />
        {contentBoard}
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  backlogprop: PropTypes.object.isRequired,
  getBacklog: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  backlogprop: state.backlog,
  errors: state.errors,
});

export default connect(mapStateToProps, { getBacklog })(ProjectBoard);
