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
    taskPriority : string,
    taskStatusId : number,
    taskPriorityId : number,
    taskCategoryId : number
}