export interface taskActivity
{
    projectId: number,
    taskId: number,
    memberId: number,
    projectName : string,
    taskName? : string,
    memberName? : string,
    type? : string,
    dateModified : Date,
    description? : string
}