'use client'

import { useState } from 'react'
import { useXp } from '@/app/context/xp-context'

import Link from 'next/link'

export default function PolynomialQuiz() {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const correctAnswer = 'B'
  const xpEarned = 100
  const { setXp } = useXp()


  const handleSubmit = () => {
  if (selected === correctAnswer) {
    setXp((prev: number) => prev + xpEarned)
  }
  setSubmitted(true)
}


  return (
    <div style={{ padding: 40 }}>
      <h1>Polynomial Quiz</h1>

      {!submitted && (
        <>
          <p>
            Question: Polynomial 2x² + 3x + 1 ka degree kya hai?
          </p>

          <div>
            <label>
              <input type="radio" name="q1" onChange={() => setSelected('A')} />
              A) 1
            </label>
          </div>

          <div>
            <label>
              <input type="radio" name="q1" onChange={() => setSelected('B')} />
              B) 2
            </label>
          </div>

          <div>
            <label>
              <input type="radio" name="q1" onChange={() => setSelected('C')} />
              C) 3
            </label>
          </div>

          <div>
            <label>
              <input type="radio" name="q1" onChange={() => setSelected('D')} />
              D) 0
            </label>
          </div>

          <br />
          <button onClick={handleSubmit}>Submit Quiz</button>
        </>
      )}

      {submitted && (
        <div style={{ marginTop: 20 }}>
          {selected === correctAnswer ? (
            <>
              <h2 style={{ color: 'green' }}>🎉 Module Completed!</h2>
              <p>Correct answer. Degree highest power hoti hai.</p>
              <p><strong>XP Earned: {xpEarned}</strong></p>
            </>
          ) : (
            <>
              <h2 style={{ color: 'red' }}>❌ Quiz Failed</h2>
              <p>
                Degree hamesha variable ki highest power hoti hai. Try again.
              </p>
            </>
          )}

          <br />

          <Link href="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        </div>
      )}
    </div>
  )
}
