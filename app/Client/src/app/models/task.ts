import {Member} from "./member";

export interface Task
{
    taskId : number,
    taskName : string,
    taskDescription : string,
    startDate : Date,
    deadline : Date,
    projectName : string,
    projectId : number,
    taskStatus: string,
    isTaskDependentOn : boolean,
    taskPriorityName : string,
    taskStatusId : number,
    taskPriorityId : number,
    taskCategoryId : number,
    assignedMembers: Member[],
    dependentTasks?: any,
}
