const Course = ({ course }) => {
  return (
    <>
    <Header course={course} />
    <Content course={course} />
    <Total course={course } />  
    </>
  )
}

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Content = ({course}) => {
  return (
    <>
      {course.parts.map((part) => (
  <Part
    key={part.id}
    name={part.name}
    exercises={part.exercises}
  />
))}
    </>
  )
}

const Part = ({name, exercises}) => {
  return (
    <p>{name} {exercises}</p>
  )

}

const Total = ({course}) => {
  return (
    <p>
      Total of{" "}
      {course.parts.reduce((sum, part) => sum + part.exercises, 0)}{" "}
      exercises
    </p>
  )
}

export default Course