"use client"
import { Container } from "@/types/container"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"

export default function DeleteContainerButton({ container }: { container: Container }) {
    return (
        <Button variant="destructive" size="sm" className="transition-all duration-300 hover:bg-red-600">
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}