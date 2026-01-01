import Link from 'next/link'

export default function Unit3() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Types of Polynomials</h1>

      <p>
        Polynomials ko unki degree ke basis par classify kiya jata hai.
      </p>

      <ul>
        <li>Degree 1 → Linear Polynomial</li>
        <li>Degree 2 → Quadratic Polynomial</li>
        <li>Degree 3 → Cubic Polynomial</li>
      </ul>

      <br />

      <Link href="/modules/polynomials/quiz">
        <button>Take Quiz →</button>
      </Link>
    </div>
  )
}
