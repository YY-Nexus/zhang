"use client"

import { useEffect } from "react"

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("[SW] Registration successful:", registration.scope)
        },
        (err) => {
          console.log("[SW] Registration failed:", err)
        }
      )
    }
  }, [])

  return null
}
