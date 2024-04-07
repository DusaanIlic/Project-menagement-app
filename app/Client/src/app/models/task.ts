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
    taskPriority : string,
    taskStatusId : number,
    taskPriorityId : number,
    taskCategoryId : number
}