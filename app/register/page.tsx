"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Copy } from "lucide-react"

export default function RegisterPage() {
const router = useRouter()
const [form, setForm] = useState({
firstName: "",
lastName: "",
email: "",
password: "",
confirmPassword: "",
terms: false,
})

const [loading, setLoading] = useState(false)
const [error, setError] = useState("")

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value, type, checked } = e.target
setForm((prev) => ({
...prev,
[name]: type === "checkbox" ? checked : value,
}))
}

const handleGoogleSignup = async () => {
try {
setLoading(true)
const provider = new GoogleAuthProvider()
await signInWithPopup(auth, provider)
router.push("/charting")
} catch (err: any) {
setError("Google sign up failed.")
} finally {
setLoading(false)
}
}

const handleRegister = async (e: React.FormEvent) => {
e.preventDefault()
setError("")

if (!form.terms) return setError("You must agree to the terms.")
if (form.password !== form.confirmPassword)
  return setError("Passwords do not match.")
if (!form.email || !form.password || !form.firstName || !form.lastName)
  return setError("All fields are required.")

try {
  setLoading(true)
  const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password)
  await updateProfile(userCred.user, {
    displayName: `${form.firstName} ${form.lastName}`,
  })
  router.push("/charting")
} catch (err: any) {
  const msg = err?.message || "Registration failed."
  setError(msg.includes("email-already") ? "Email already in use." : msg)
} finally {
  setLoading(false)
}
}

return (
<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
<div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-xl shadow-md">
<Link href="/" className="text-sm text-blue-400">← Back to Home</Link>
<div className="text-center mb-8">
  <h1 className="text-3xl font-extrabold text-white">FinSight</h1>
  
</div>

    <button
      type="button"
      onClick={handleGoogleSignup}
      className="w-full bg-white text-black font-semibold py-2 rounded mb-4"
    >
      Continue with Google
    </button>

    <div className="text-center text-sm text-gray-400 mb-4">OR CONTINUE WITH</div>

    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

    <form onSubmit={handleRegister} className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className={`w-1/2 px-4 py-2 bg-gray-800 rounded border ${
            error && !form.firstName ? "border-red-500" : "border-gray-700"
          }`}
          onChange={handleChange}
          value={form.firstName}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className={`w-1/2 px-4 py-2 bg-gray-800 rounded border ${
            error && !form.lastName ? "border-red-500" : "border-gray-700"
          }`}
          onChange={handleChange}
          value={form.lastName}
          required
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="john@example.com"
        className={`w-full px-4 py-2 bg-gray-800 rounded border ${
          error && !form.email ? "border-red-500" : "border-gray-700"
        }`}
        onChange={handleChange}
        value={form.email}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Create a strong password"
        className={`w-full px-4 py-2 bg-gray-800 rounded border ${
          error && !form.password ? "border-red-500" : "border-gray-700"
        }`}
        onChange={handleChange}
        value={form.password}
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        className={`w-full px-4 py-2 bg-gray-800 rounded border ${
          error && !form.confirmPassword ? "border-red-500" : "border-gray-700"
        }`}
        onChange={handleChange}
        value={form.confirmPassword}
        required
      />

      <label className="text-sm text-gray-400">
        <input
          type="checkbox"
          name="terms"
          className="mr-2"
          checked={form.terms}
          onChange={handleChange}
          required
        />
        I agree to the <a href="#" className="text-blue-400">Terms of Service</a> and <a href="#" className="text-blue-400">Privacy Policy</a>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-2 rounded text-white font-semibold"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>

    <p className="text-center text-sm mt-4">
      Already have an account? <Link href="/login" className="text-blue-400">Sign in</Link>
    </p>
  </div>
</main>
)
}