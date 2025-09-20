import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    if (apiKey && capital) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.error("Error fetching weather data:", error)
        })
    }
  }, [capital, apiKey])

  if (!apiKey) {
    return <p>API key for OpenWeatherMap is missing. Please set VITE_OPENWEATHER_API_KEY environment variable.</p>
  }

  if (!capital) {
    return <p>No capital specified for weather.</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="150" />
      {country.capital && <Weather capital={country.capital[0]} />}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredCountries = searchQuery
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map(country =>
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => setSearchQuery(country.name.common)}>show</button>
            </li>
          )}
        </ul>
      )
    }

    if (filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />
    }

    return null
  }

  return (
    <div>
      find countries <input value={searchQuery} onChange={handleSearchQueryChange} />
      {renderCountries()}
    </div>
  )
}

export default App