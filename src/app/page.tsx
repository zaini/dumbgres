import ContainerList from '@/components/my-ui/container-list'
import { Suspense } from 'react'
import { Database, List, Loader2 } from 'lucide-react'
import { getPostgresVersions } from './actions/get-postgres-versions'
import CreateContainerForm from '@/components/my-ui/create-container-form'

export default async function DashboardPage() {
  const versions = await getPostgresVersions()

  return (
    <div className="container mx-auto p-4 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Database className="mr-2 h-8 w-8 text-blue-500" />
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          dumbgres
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Database className="mr-2 h-6 w-6 text-green-500" />
            Create New Container
          </h2>
          <CreateContainerForm versions={versions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <List className="mr-2 h-6 w-6 text-blue-500" />
            Running Containers
          </h2>
          <Suspense fallback={
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          }>
            <ContainerList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}