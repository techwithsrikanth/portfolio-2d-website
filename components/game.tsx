"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import InfoModal from "./info-modal"

// Game constants
const GRAVITY = 0.5
const JUMP_FORCE = -10
const SPEED = 5
const GROUND_HEIGHT = 80
const CHARACTER_WIDTH = 50
const CHARACTER_HEIGHT = 80

// Career milestones
const milestones = [
  {
    id: "mvm",
    title: "MVM, Chennai",
    position: 800,
    description: "Started educational journey at MVM, Chennai",
    type: "education",
  },
  {
    id: "iiit",
    title: "IIIT Chennai",
    position: 1600,
    description: "Pursuing final year at IIIT Chennai",
    type: "education",
  },
  {
    id: "ford",
    title: "Ford Intern (ML)",
    position: 2400,
    description: "Worked on GAN and LLM technologies during internship at Ford",
    type: "work",
  },
  {
    id: "congruent",
    title: "Congruent",
    position: 3200,
    description: "Developed applications using State Machines and React",
    type: "work",
  },
  {
    id: "happyfox",
    title: "HappyFox",
    position: 4000,
    description: "Built solutions with Django, Workflows, and API integrations",
    type: "work",
  },
  {
    id: "quant",
    title: "Quant Firm",
    position: 4800,
    description:
      "Working with a quant firm in stealth to build python scripts for trading models, analytical scripts to analyze various options trading strategies and backtesting algorithms",
    type: "work",
  },
  {
    id: "project1",
    title: "Time-series Analysis",
    position: 5600,
    description:
      "Built a time-series analysis for our college food-store to predict which product will have what amount of demand at a certain time to improve logistics and supply chain",
    type: "project",
  },
  {
    id: "project2",
    title: "Car-pooling Website",
    position: 6400,
    description:
      "Developed Car-pooling websites where we as a driver can initiate car pooling services and riders can request for the same",
    type: "project",
  },
  {
    id: "end",
    title: "Future Awaits",
    position: 7200,
    description: "Looking ahead to new opportunities (Connect on whatsapp +91 6374900245 and srikanthprakash072003@gmail.com)",
    type: "future",
  },
]

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [character, setCharacter] = useState({
    x: 100,
    y: 0,
    velocityY: 0,
    isJumping: false,
    age: 0, // 0 = young, 100 = adult
  })
  const [cameraOffset, setCameraOffset] = useState(0)
  const [selectedMilestone, setSelectedMilestone] = useState<(typeof milestones)[0] | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const { toast } = useToast()

  // Game loop
  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Track which keys are pressed
    const keys = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
    }

    // Key event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys and space
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
      }

      if (e.key === "ArrowLeft") keys.ArrowLeft = true
      if (e.key === "ArrowRight") keys.ArrowRight = true
      if (e.key === " ") keys.Space = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.ArrowLeft = false
      if (e.key === "ArrowRight") keys.ArrowRight = false
      if (e.key === " ") keys.Space = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    let animationFrameId: number
    let lastTimestamp = 0

    // Game state
    let characterX = 100
    let characterY = 0
    let velocityY = 0
    let isJumping = false
    let characterAge = 0
    let cameraOffsetValue = 0

    const gameLoop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp
      const deltaTime = (timestamp - lastTimestamp) / 16 // normalize to ~60fps
      lastTimestamp = timestamp

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Handle movement
      if (keys.ArrowLeft) {
        characterX -= SPEED * deltaTime
      }
      if (keys.ArrowRight) {
        characterX += SPEED * deltaTime
      }

      // Handle jumping
      if (keys.Space && !isJumping) {
        velocityY = JUMP_FORCE
        isJumping = true
      }

      // Apply gravity
      if (isJumping) {
        velocityY += GRAVITY * deltaTime
        characterY += velocityY

        // Check if landed
        if (characterY >= 0) {
          characterY = 0
          velocityY = 0
          isJumping = false
        }
      }

      // Ensure character stays within bounds
      characterX = Math.max(50, characterX)

      // Update camera
      cameraOffsetValue = Math.max(0, characterX - canvas.width / 3)

      // Update character age based on progress
      const maxDistance = milestones[milestones.length - 1].position
      characterAge = Math.min(100, (characterX / maxDistance) * 100)

      // Check if game completed
      if (characterX >= milestones[milestones.length - 1].position + 200 && !gameCompleted) {
        setGameCompleted(true)
        toast({
          title: "Journey Complete!",
          description: "I am open to job opportunities as a Software Engineer!",
          duration: 5000,
        })
      }

      // Update state for React components
      setCharacter({
        x: characterX,
        y: characterY,
        velocityY: velocityY,
        isJumping: isJumping,
        age: characterAge,
      })
      setCameraOffset(cameraOffsetValue)

      // Draw background
      drawBackground(ctx, canvas.width, canvas.height, cameraOffsetValue)

      // Draw ground
      drawGround(ctx, canvas.width, canvas.height, cameraOffsetValue)

      // Draw milestones
      drawMilestones(ctx, canvas.width, canvas.height, cameraOffsetValue, characterX)

      // Draw character
      drawCharacter(
        ctx,
        {
          x: characterX,
          y: characterY,
          velocityY: velocityY,
          isJumping: isJumping,
          age: characterAge,
        },
        canvas.height - GROUND_HEIGHT,
        cameraOffsetValue,
      )

      // Continue animation
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, gameCompleted])

  // Handle canvas click for milestone interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + cameraOffset
    const y = e.clientY - rect.top

    // Check if clicked on a milestone
    for (const milestone of milestones) {
      const signX = milestone.position
      const signY = canvasRef.current.height - GROUND_HEIGHT - 100

      if (x >= signX - 50 && x <= signX + 50 && y >= signY - 100 && y <= signY) {
        setSelectedMilestone(milestone)
        break
      }
    }
  }

  // Drawing functions
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) => {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height - GROUND_HEIGHT)
    gradient.addColorStop(0, "#1a365d")
    gradient.addColorStop(1, "#4a5568")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height - GROUND_HEIGHT)

    // Stars
    ctx.fillStyle = "white"
    for (let i = 0; i < 100; i++) {
      const starX = i * 100 + Math.sin(i) * 500 - ((offset * 0.1) % (width * 10))
      const starY = Math.cos(i) * 150 + 100
      if (starX > 0 && starX < width) {
        ctx.beginPath()
        ctx.arc(starX, starY, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Distant mountains
    ctx.fillStyle = "#2d3748"
    for (let i = 0; i < 5; i++) {
      const mountainX = (i * 500 - offset * 0.2) % (width * 3)
      if (mountainX > -500 && mountainX < width) {
        ctx.beginPath()
        ctx.moveTo(mountainX, height - GROUND_HEIGHT)
        ctx.lineTo(mountainX + 250, height - GROUND_HEIGHT - 150)
        ctx.lineTo(mountainX + 500, height - GROUND_HEIGHT)
        ctx.fill()
      }
    }

    // Closer hills
    ctx.fillStyle = "#4a5568"
    for (let i = 0; i < 8; i++) {
      const hillX = (i * 300 - offset * 0.5) % (width * 2)
      if (hillX > -300 && hillX < width) {
        ctx.beginPath()
        ctx.moveTo(hillX, height - GROUND_HEIGHT)
        ctx.quadraticCurveTo(hillX + 150, height - GROUND_HEIGHT - 80, hillX + 300, height - GROUND_HEIGHT)
        ctx.fill()
      }
    }

    // Buildings in the distance for later milestones
    if (offset > 4000) {
      ctx.fillStyle = "#1a202c"
      for (let i = 0; i < 10; i++) {
        const buildingX = 5000 + i * 100 - offset * 0.8
        const buildingHeight = 100 + Math.sin(i) * 50
        if (buildingX > -50 && buildingX < width) {
          ctx.fillRect(buildingX, height - GROUND_HEIGHT - buildingHeight, 50, buildingHeight)

          // Windows
          ctx.fillStyle = "#f6e05e"
          for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 3; k++) {
              if (Math.random() > 0.3) {
                ctx.fillRect(buildingX + 10 + k * 15, height - GROUND_HEIGHT - buildingHeight + 10 + j * 20, 8, 12)
              }
            }
          }
          ctx.fillStyle = "#1a202c"
        }
      }
    }

    // Final scene with towers
    if (offset > 7000) {
      // City skyline
      ctx.fillStyle = "#2d3748"
      ctx.fillRect(7300 - offset, height - GROUND_HEIGHT - 250, 150, 250)
      ctx.fillRect(7500 - offset, height - GROUND_HEIGHT - 350, 120, 350)
      ctx.fillRect(7650 - offset, height - GROUND_HEIGHT - 200, 100, 200)
      ctx.fillRect(7800 - offset, height - GROUND_HEIGHT - 400, 130, 400)

      // Windows
      ctx.fillStyle = "#f6e05e"
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 5; j++) {
          if (Math.random() > 0.3) {
            ctx.fillRect(7310 + j * 25 - offset, height - GROUND_HEIGHT - 240 + i * 22, 15, 15)
          }
        }
      }

      // "Open to job" sign
      if (gameCompleted) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(width / 2 - 200, height / 2 - 50, 400, 100)

        ctx.fillStyle = "white"
        ctx.font = "bold 24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("I am open to job opportunities", width / 2, height / 2)
        ctx.fillText("as a Software Engineer!", width / 2, height / 2 + 30)
        ctx.fillText("(Connect on +91 6374900245 and srikanthprakash072003@gmail.com)", width / 2, height / 2 + 60)

      }
    }
  }

  const drawGround = (ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) => {
    // Ground
    ctx.fillStyle = "#2d3748"
    ctx.fillRect(0, height - GROUND_HEIGHT, width, GROUND_HEIGHT)

    // Road
    ctx.fillStyle = "#4a5568"
    ctx.fillRect(0, height - GROUND_HEIGHT + 20, width, 40)

    // Road markings
    ctx.fillStyle = "white"
    for (let i = 0; i < width / 50 + 1; i++) {
      const markingX = i * 100 - (offset % 100)
      if (markingX >= 0 && markingX <= width) {
        ctx.fillRect(markingX, height - GROUND_HEIGHT + 38, 50, 4)
      }
    }
  }

  const drawMilestones = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number,
    characterX: number,
  ) => {
    milestones.forEach((milestone, index) => {
      const signX = milestone.position - offset
      const signY = height - GROUND_HEIGHT - 100

      // Only draw if in view
      if (signX > -100 && signX < width + 100) {
        // Signpost
        ctx.fillStyle = "#805AD5"
        ctx.fillRect(signX - 5, signY, 10, 100)

        // Sign background
        ctx.fillStyle = characterX >= milestone.position ? "#68D391" : "#F56565"
        if (milestone.type === "education") ctx.fillStyle = "#4299E1"
        if (milestone.type === "work") ctx.fillStyle = "#F6AD55"
        if (milestone.type === "project") ctx.fillStyle = "#9F7AEA"
        if (milestone.type === "future") ctx.fillStyle = "#F6E05E"

        ctx.beginPath()
        ctx.roundRect(signX - 80, signY - 60, 160, 60, 10)
        ctx.fill()

        // Sign text
        ctx.fillStyle = "white"
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(milestone.title, signX, signY - 30)

        // Click indicator
        ctx.font = "12px Arial"
        ctx.fillText("(Click for details)", signX, signY - 10)
      }
    })
  }

  const drawCharacter = (
    ctx: CanvasRenderingContext2D,
    character: typeof character,
    groundY: number,
    offset: number,
  ) => {
    const x = character.x - offset
    const y = groundY - CHARACTER_HEIGHT + character.y

    // Only draw if in view
    if (x < -CHARACTER_WIDTH || x > ctx.canvas.width + CHARACTER_WIDTH) {
      return
    }

    // Character body
    ctx.fillStyle = "#4299E1"

    // Legs
    const legOffset = Math.sin(Date.now() / 100) * 5
    ctx.fillRect(x - 10, y + 50, 8, 30 - legOffset)
    ctx.fillRect(x + 2, y + 50, 8, 30 + legOffset)

    // Body
    ctx.fillStyle = "#3182CE"
    ctx.fillRect(x - 15, y + 20, 30, 30)

    // Head - size changes with age
    const headSize = 20 + (character.age / 100) * 10
    ctx.fillStyle = "#FBD38D"
    ctx.beginPath()
    ctx.arc(x, y + 10, headSize, 0, Math.PI * 2)
    ctx.fill()

    // Eyes
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(x - 5, y + 5, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + 5, y + 5, 3, 0, Math.PI * 2)
    ctx.fill()

    // Mouth
    ctx.beginPath()
    ctx.arc(x, y + 15, 5, 0, Math.PI)
    ctx.stroke()

    // Hair - changes with age
    ctx.fillStyle = "#2D3748"
    if (character.age < 30) {
      // Young hair
      ctx.fillRect(x - 15, y - 5, 30, 5)
    } else if (character.age < 60) {
      // Teen/young adult hair
      ctx.beginPath()
      ctx.moveTo(x - 15, y - 5)
      ctx.lineTo(x, y - 15)
      ctx.lineTo(x + 15, y - 5)
      ctx.fill()
    } else {
      // Adult hair
      ctx.beginPath()
      ctx.arc(x, y - 5, 15, Math.PI, Math.PI * 2)
      ctx.fill()
    }
  }

  return (
    <div className="relative w-full">
      {!gameStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Srikanthan's Journey</h2>
          <p className="mb-6 text-center">
            Follow my journey from education to professional experience. Click on signboards to learn more about each
            milestone.
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="px-6 py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Start Journey
          </button>
        </div>
      ) : null}

      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-[400px] bg-gray-800 rounded-lg"
        onClick={handleCanvasClick}
      />

      {selectedMilestone && <InfoModal milestone={selectedMilestone} onClose={() => setSelectedMilestone(null)} />}
    </div>
  )
}

