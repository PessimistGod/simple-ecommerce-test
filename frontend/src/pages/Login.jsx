import { apiFetch } from "../services/api";
import { Link } from "react-router-dom";

export default function Login() {
  const submit = async e => {
    e.preventDefault();
    const f = e.target;

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: f.email.value,
        password: f.password.value
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    localStorage.setItem("token", data.token);
    window.location.href = "/shop";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">

      <div className="bg-white w-[380px] p-10 rounded-2xl shadow-xl space-y-5">
        <h2 className="text-3xl font-bold text-[#313860] text-center">
          Welcome Back
        </h2>

        <p className="text-gray-500 text-center text-sm">
          Login to continue shopping
        </p>

        <form onSubmit={submit} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="w-full border p-3 rounded-lg focus:outline-[#313860]"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            className="w-full bg-[#313860] text-white py-3 rounded-lg hover:opacity-90 transition">
            Login
          </button>

        </form>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#313860] font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
