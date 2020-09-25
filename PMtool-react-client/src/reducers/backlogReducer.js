import {
  GET_BACKLOG,
  GET_PROJECT_TASK,
  DELETE_PROJECT_TASK,
} from "../actions/types";

const initialState = {
  project_Tasks: [],
  project_Task: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BACKLOG:
      return {
        ...state,
        project_Tasks: action.payload,
      };
    case GET_PROJECT_TASK:
      return {
        ...state,
        project_Task: action.payload,
      };
    case DELETE_PROJECT_TASK:
      return {
        ...state,
        //to do
      };
    default:
      return state;
  }
};
