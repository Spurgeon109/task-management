export interface Task {
    _id: string,
    title: string,
    description: string,
    created_time: Date,
    status: string
}

export interface TaskAddReq{
    title: string,
    description: string,
    created_time: Date,
    status: string
}
