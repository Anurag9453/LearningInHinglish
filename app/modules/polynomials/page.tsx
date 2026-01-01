import Link from 'next/link'

export default function PolynomialsModule() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Polynomials</h1>

      <p>
        Is module me hum polynomial ka concept step by step samjhenge.
      </p>

      <h3>Units</h3>

      <ul>
        <li>
          <Link href="/modules/polynomials/unit-1">
            👉 What is a Polynomial?
          </Link>
        </li>

        <li>
          <Link href="/modules/polynomials/unit-2">
            👉 Degree of a Polynomial
          </Link>
        </li>

        <li>
          <Link href="/modules/polynomials/unit-3">
            👉 Types of Polynomials
          </Link>
        </li>
      </ul>
    </div>
  )
}
