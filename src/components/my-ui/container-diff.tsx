import { ContainerWithDiscrepancy } from '@/app/actions/get-containers'
import React from 'react'

interface ContainerDiffProps {
    container: ContainerWithDiscrepancy
}

export default function ContainerDiff({ container }: ContainerDiffProps) {
    if (!container.discrepancies || Object.keys(container.discrepancies).length === 0) {
        return null
    }

    return (
        <div className="mt-4 bg-gray-100 p-4 rounded-md">
            <h4 className="text-lg font-semibold mb-2">Discrepancies:</h4>
            <ul className="space-y-2">
                <li className="flex flex-col sm:flex-row">
                    <span className="w-full sm:w-1/4 font-medium mb-1 sm:mb-0"></span>
                    <div className="w-full sm:w-3/4 flex flex-col sm:flex-row">
                        <span className="w-full sm:w-1/2 bg-red-100 px-2 py-1 rounded-t sm:rounded-l sm:rounded-t-none mb-1 sm:mb-0">
                            <b className="break-all">Database</b>
                        </span>
                        <span className="w-full sm:w-1/2 bg-green-100 px-2 py-1 rounded-b sm:rounded-r sm:rounded-b-none">
                            <b className="break-all">Docker</b>
                        </span>
                    </div>
                </li>
            </ul>
            <ul className="space-y-2">
                {Object.entries(container.discrepancies).map(([key, { docker, db }]) => (
                    <li key={key} className="flex flex-col sm:flex-row">
                        <span className="w-full sm:w-1/4 font-medium mb-1 sm:mb-0">{key}:</span>
                        <div className="w-full sm:w-3/4 flex flex-col sm:flex-row">
                            <span className="w-full sm:w-1/2 bg-red-100 px-2 py-1 rounded-t sm:rounded-l sm:rounded-t-none mb-1 sm:mb-0">
                                <span className="text-red-700">-</span>
                                <code className="break-all">{db}</code>
                            </span>
                            <span className="w-full sm:w-1/2 bg-green-100 px-2 py-1 rounded-b sm:rounded-r sm:rounded-b-none">
                                <span className="text-green-700">+</span>
                                <code className="break-all">{docker}</code>
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}