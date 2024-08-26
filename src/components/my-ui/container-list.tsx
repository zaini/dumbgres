import { Database, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DeleteContainerButton from './delete-container-button'
import { getDockerContainers } from '@/app/actions/get-containers'
import StopContainerButton from './stop-container-button'
import StartContainerButton from './start-container-button'

export default async function ContainerList() {
    const { containersAndDatabaseInfos, success } = await getDockerContainers()

    if (!success) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error fetching containers</AlertTitle>
                <AlertDescription>There was an error fetching the containers. Please try again later.</AlertDescription>
            </Alert>
        )
    }

    const noContainers = containersAndDatabaseInfos!.length === 0

    if (noContainers) {
        return (
            <Alert>
                <Database className="h-4 w-4" />
                <AlertTitle>No containers running</AlertTitle>
                <AlertDescription>There are no containers running. You should create a new container!</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            <ul className="space-y-4">
                {containersAndDatabaseInfos!.map(({ containerInfo, databaseInfo }) => (
                    <li key={containerInfo.Id} className={`bg-white shadow rounded-lg p-4 transition-all duration-300 hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Database className="mr-2 h-5 w-5 text-blue-500" />
                                {containerInfo.Names[0]}
                            </h3>
                            <div className='flex gap-2'>
                                <StopContainerButton container={containerInfo} />
                                <StartContainerButton container={containerInfo} />
                                <DeleteContainerButton container={containerInfo} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Status: {containerInfo.Status}</p>
                        <p className="text-sm text-gray-500">URL: {`postgres://${databaseInfo?.user}:${databaseInfo?.password}@localhost:${databaseInfo?.port}/${databaseInfo?.name}`}</p>
                        <p className="text-sm text-gray-500">Docker ID: {containerInfo.Id}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}