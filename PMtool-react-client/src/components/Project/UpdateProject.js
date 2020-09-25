import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProject } from "../../actions/projectActions";
import { createProject } from "../../actions/projectActions";
import classnames from "classnames";

class UpdateProject extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      projectName: "",
      projectIdentifier: "",
      description: "",
      start_date: "",
      end_date: "",
      error3s: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getProject(id, this.props.history);
  }
  //life cycle hooks
  componentWillReceiveProps(nextProps) {
    if (nextProps.error2s) {
      this.setState({ error3s: nextProps.error2s });
    }
    const {
      id,
      projectName,
      projectIdentifier,
      description,
      start_date,
      end_date,
    } = nextProps.aproject;

    this.setState({
      id,
      projectName,
      projectIdentifier,
      description,
      start_date,
      end_date,
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newProject = {
      id: this.state.id,
      projectName: this.state.projectName,
      projectIdentifier: this.state.projectIdentifier,
      description: this.state.description,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    };
    this.props.createProject(newProject, this.props.history);
  }

  render() {
    const { error3s } = this.state;

    return (
      <div>
        rod{" "}
        <div className="project">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h5 className="display-4 text-center">Update Project form</h5>
                <hr />
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className={classnames("form-control form-control-lg ", {
                        "is-invalid": error3s.projectName,
                      })}
                      placeholder="Project Name"
                      name="projectName"
                      value={this.state.projectName}
                      onChange={this.onChange}
                    />

                    {error3s.projectName && (
                      <div className="invalid-feedback">
                        {error3s.projectName}
                      </div>
                    )}
                  </div>

                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="Unique Project ID"
                      value={this.state.projectIdentifier}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      className={classnames("form-control form-control-lg ", {
                        "is-invalid": error3s.description,
                      })}
                      placeholder="Project Description"
                      name="description"
                      value={this.state.description}
                      onChange={this.onChange}
                    ></textarea>
                    {error3s.description && (
                      <div className="invalid-feedback">
                        {error3s.description}
                      </div>
                    )}
                  </div>
                  <h6>Start Date</h6>
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="start_date"
                      value={this.state.start_date}
                      onChange={this.onChange}
                    />
                  </div>
                  <h6>Estimated End Date</h6>
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="end_date"
                      value={this.state.end_date}
                      onChange={this.onChange}
                    />
                  </div>

                  <input
                    type="submit"
                    className="btn btn-primary btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateProject.propTypes = {
  getProject: PropTypes.func.isRequired,
  createProject: PropTypes.func.isRequired,

  error2s: PropTypes.object.isRequired,
  aproject: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  aproject: state.project.project,
  error2s: state.errors,
});
export default connect(mapStateToProps, { createProject, getProject })(
  UpdateProject
);
