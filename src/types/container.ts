export interface Container {
    id: string;
    name: string;
    status: string;
    url: string;
}

export interface CreateContainerRequest {
    name: string;
    version: string;
    port: number;
    username: string;
    password: string;
}