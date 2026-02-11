import { apiFetch } from "../services/api";
import { Link } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { useState } from "react";

export default function Register() {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(country);
  const cities = City.getCitiesOfState(country, state);

  const submit = async e => {
    e.preventDefault();
    const f = e.target;

    const payload = {
      name: f.name.value,
      email: f.email.value,
      phone: f.phone.value,
      password: f.password.value,
      address: {
        fullName: f.name.value,
        phone: f.phone.value,
        street: f.street.value,
        postalCode: f.postal.value,
        city: f.city.value,
        country: countries.find(c => c.isoCode === country),
        state: states.find(s => s.isoCode === state)
      }
    };

    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-[#313860] text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={submit} className="grid grid-cols-2 gap-4">

          <input name="name" placeholder="Full Name" className="border p-3 rounded-lg" required />
          <input name="email" type="email" placeholder="Email" className="border p-3 rounded-lg" required />

          <input name="phone" placeholder="Phone" className="border p-3 rounded-lg" required />
          <input name="password" type="password" placeholder="Password" className="border p-3 rounded-lg" required />

          <input name="street" placeholder="Street Address" className="border p-3 rounded-lg col-span-2" required />

          {/* Country */}
          <select
            onChange={e => setCountry(e.target.value)}
            className="border p-3 rounded-lg"
            required>
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>

          {/* State */}
          <select
            onChange={e => setState(e.target.value)}
            className="border p-3 rounded-lg"
            required>
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>

          {/* City */}
          <select name="city" className="border p-3 rounded-lg" required>
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          <input name="postal" placeholder="Postal Code" className="border p-3 rounded-lg" required />

          <button
            className="col-span-2 bg-[#313860] text-white py-3 rounded-lg hover:opacity-90 transition">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-[#313860] font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
