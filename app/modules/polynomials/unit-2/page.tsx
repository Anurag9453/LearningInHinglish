import Link from 'next/link'

export default function Unit2() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Degree of a Polynomial</h1>

      <p>
        Polynomial ki degree ka matlab hota hai variable ki highest power.
      </p>

      <p>
        Example:
      </p>

      <p>
        3x² + 2x + 5
      </p>

      <p>
        Yahan x² sabse badi power hai, isliye degree 2 hai.
      </p>

      <br />

      <Link href="/modules/polynomials/unit-3">
        <button>Next Unit →</button>
      </Link>
    </div>
  )
}
