"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Milestone = {
  id: string
  title: string
  position: number
  description: string
  type: "education" | "work" | "project" | "future"
}

interface InfoModalProps {
  milestone: Milestone
  onClose: () => void
}

export default function InfoModal({ milestone, onClose }: InfoModalProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case "education":
        return "🎓"
      case "work":
        return "💼"
      case "project":
        return "🚀"
      case "future":
        return "🔮"
      default:
        return "📌"
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case "education":
        return "bg-blue-100 text-blue-800"
      case "work":
        return "bg-orange-100 text-orange-800"
      case "project":
        return "bg-purple-100 text-purple-800"
      case "future":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Additional details based on milestone ID
  const getAdditionalDetails = (id: string) => {
    switch (id) {
      case "ford":
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Work Details:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Worked on Generative Adversarial Networks (GAN)</li>
              <li>Implemented Large Language Models (LLM) for automotive applications</li>
              <li>Contributed to machine learning research initiatives</li>
            </ul>
          </div>
        )
      case "congruent":
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Work Details:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Developed applications using State Machines</li>
              <li>Built frontend interfaces with React</li>
              <li>Collaborated with cross-functional teams</li>
            </ul>
          </div>
        )
      case "happyfox":
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Work Details:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Built solutions with Django framework</li>
              <li>Implemented custom workflows</li>
              <li>Integrated various APIs into the platform</li>
            </ul>
          </div>
        )
      case "quant":
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Work Details:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Developed Python scripts for trading models</li>
              <li>Created analytical tools for options trading strategies</li>
              <li>Built and maintained backtesting algorithms</li>
            </ul>
          </div>
        )
      case "project1":
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Project Details:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Implemented time-series forecasting models</li>
              <li>Improved supply chain logistics</li>
              <li>Reduced waste and optimized inventory</li>
            </ul>
          </div>
        )
      case "project2":
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Project Details:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Built full-stack carpooling platform</li>
              <li>Implemented driver and rider matching algorithms</li>
              <li>Created real-time ride tracking features</li>
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getIconForType(milestone.type)}</span>
            <DialogTitle>{milestone.title}</DialogTitle>
          </div>
          <div
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getColorForType(milestone.type)}`}
          >
            {milestone.type.charAt(0).toUpperCase() + milestone.type.slice(1)}
          </div>
        </DialogHeader>

        <DialogDescription className="text-base text-gray-700">{milestone.description}</DialogDescription>

        {getAdditionalDetails(milestone.id)}

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

