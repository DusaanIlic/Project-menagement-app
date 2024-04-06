export interface Task
{
    taskId : number,
    taskName : string,
    taskDescription : string,
    startDate : Date,
    deadline : Date,
    projectId : number,
    taskStatus: string,
    taskStatusId : number,
    taskPriorityId : number,
    taskCategoryId : number
}