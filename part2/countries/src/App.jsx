import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [searchCountries, setSearchCountries] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchCountries.toLowerCase())
  )

  const country = countriesToShow.length === 1 ? countriesToShow[0] : null

  useEffect(() => {
    if (!country) {
      setWeather(null)
      return
    }

    const [lat, lon] = country.latlng
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
      .then(response => setWeather(response.data))
  }, [country])

  return (
    <main>
      <label>
        find countries{' '}
        <input value={searchCountries} onChange={e => setSearchCountries(e.target.value)} />
      </label>

      {countriesToShow.length > 10 && <p>Too many matches, specify another filter</p>}

      {countriesToShow.length <= 10 && countriesToShow.length > 1 &&
        countriesToShow.map(c => (
          <p key={c.cca3}>
            {c.name.common}{' '}
            <button onClick={() => setSearchCountries(c.name.common)}>show</button>
          </p>
        ))}

      {country && (
        <div>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>

          <h2>Languages</h2>
          <ul>
            {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
          </ul>

          <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

          {weather && (
            <div>
              <h2>Weather in {country.capital}</h2>
              <p>Temperature {weather.main.temp} °C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>Wind {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default App