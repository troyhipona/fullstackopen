// 1. State → 2. Server loading → 3. Notification → 
// 4. Add/update → 5. Filter → 6. Delete → 7. Components.
import { useState, useEffect } from 'react'
import phoneBookData from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    phoneBookData.getAll().then(initialData => {
      setPersons(initialData)
    })
  }, [])

  const showNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPhoneBook = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        phoneBookData
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id
                  ? person
                  : returnedPerson
              )
            )

            showNotification(
              `${newName}'s number was updated`,
              'success'
            )

            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showNotification(
              `Information of ${newName} has already been removed from the server`,
              'error'
            )

            setPersons(
              persons.filter(
                person => person.id !== existingPerson.id
              )
            )
          })
      }

      return
    }

    const personsObject = {
      name: newName,
      number: newNumber
    }

    phoneBookData
      .create(personsObject)
      .then(returnedPhoneBook => {
        setPersons(persons.concat(returnedPhoneBook))

        showNotification(
          `${newName} was added to the phonebook`,
          'success'
        )

        setNewName('')
        setNewNumber('')
      })
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }

  const filterSearch = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filterName.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneBookData
        .remove(id)
        .then(() => {
          setPersons(
            persons.filter(person => person.id !== id)
          )
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification
        message={notification}
        type={notificationType}
      />

      <Filter
        filterName={filterName}
        handleFilter={handleFilter}
      />

      <h2>Add a new</h2>

      <PersonForm
        addPhoneBook={addPhoneBook}
        newName={newName}
        handleName={handleName}
        newNumber={newNumber}
        handleNumber={handleNumber}
      />

      <h2>Numbers</h2>

      <Persons
        persons={filterSearch}
        handleDelete={handleDelete}
      />
    </div>
  )
}

const Filter = ({ filterName, handleFilter }) => {
  return (
    <label>
      Filter shown with:{' '}
      <input
        type="search"
        value={filterName}
        onChange={handleFilter}
      />
    </label>
  )
}

const PersonForm = ({
  addPhoneBook,
  newName,
  handleName,
  newNumber,
  handleNumber
}) => {
  return (
    <form onSubmit={addPhoneBook}>
      <label>
        name:{' '}
        <input
          type="text"
          value={newName}
          onChange={handleName}
        />
      </label>

      <br />

      <label>
        number:{' '}
        <input
          type="tel"
          value={newNumber}
          onChange={handleNumber}
        />
      </label>

      <div>
        <button type="submit">
          add
        </button>
      </div>
    </form>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}{' '}

          <button
            onClick={() =>
              handleDelete(person.id, person.name)
            }
          >
            delete
          </button>
        </p>
      ))}
    </>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

export default App