'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Database, Server, User, Key, Loader2, RefreshCw, EyeOff, Eye } from 'lucide-react'
import { generateSlug } from 'random-word-slugs'
import { generateStrongPassword } from '@/lib/utils'

export default function CreateContainerForm() {
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
            const response = await fetch('/api/containers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, version, port: parseInt(port), username, password }),
            })
            if (response.ok) {
                toast({ title: 'Container created successfully', description: 'Your new PostgreSQL container is now running.' })
                generateDefaults()
                setVersion('latest')
                setPort('5432')
            } else {
                throw new Error('Failed to create container')
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create container. Please try again.', variant: 'destructive' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    Container Name
                </Label>
                <div className="flex">
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="flex-grow transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
                <Label htmlFor="version" className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    PostgreSQL Version
                </Label>
                <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required className="transition-all duration-300 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="port" className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    Port
                </Label>
                <Input id="port" type="number" value={port} onChange={(e) => setPort(e.target.value)} required className="transition-all duration-300 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Username
                </Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="transition-all duration-300 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center">
                    <Key className="mr-2 h-4 w-4" />
                    Password
                </Label>
                <div className="flex">
                    <div className="relative flex-grow">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
            <Button type="submit" disabled={isLoading} className="w-full transition-all duration-300 hover:bg-blue-600">
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