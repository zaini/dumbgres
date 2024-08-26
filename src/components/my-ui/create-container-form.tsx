'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, RefreshCw, EyeOff, Eye } from 'lucide-react'
import { generateSlug } from 'random-word-slugs'
import { generateStrongPassword } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createContainer } from '@/app/actions/create-container'
import DetailDialog from './container-details-dialog'

interface CreateContainerFormProps {
    versions: string[]
}

export default function CreateContainerForm({ versions }: CreateContainerFormProps) {
    const [name, setName] = useState('')
    const [version, setVersion] = useState('latest')
    const [port, setPort] = useState('5432')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const generateDefaults = () => {
        setName(generateSlug(3, { format: 'kebab' }))
        setUsername('postgres_user')
        setPassword(generateStrongPassword())
    }

    useEffect(() => {
        generateDefaults()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const result = await createContainer({
                name,
                version,
                port: parseInt(port),
                username,
                password
            })

            if (result.success) {
                toast({
                    title: 'Container created successfully',
                    description: 'Your new PostgreSQL container is now running.',
                    action: <DetailDialog container={result.container} database={result.database} />,
                    duration: 100000
                })
                generateDefaults()
                setVersion('latest')
                setPort('5432')
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create container. Please try again.'
            toast({
                title: 'Error',
                description: 'Failed to create container. Click for more details.',
                variant: 'destructive',
                action: <DetailDialog errorDetails={errorMessage} />,
                duration: 100000
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Container Name</Label>
                <div className="flex">
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="flex-grow"
                    />
                    <Button
                        type="button"
                        onClick={() => setName(generateSlug(3, { format: 'kebab' }))}
                        className="ml-2"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="version">PostgreSQL Version</Label>
                <Select value={version} onValueChange={setVersion}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a version" />
                    </SelectTrigger>
                    <SelectContent>
                        {versions.map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" type="number" value={port} onChange={(e) => setPort(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex">
                    <div className="relative flex-grow">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            variant="ghost"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setPassword(generateStrongPassword())}
                        className="ml-2"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    'Create Container'
                )}
            </Button>
        </form>
    )
}