export interface Task
{
    taskId : number,
    taskName : string,
    taskDescription : string,
    startDate : Date,
    deadline : Date,
    projectId : number,
    taskStatusId : number,
    taskPriorityId : number,
    taskCategoryId : number
}