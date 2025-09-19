import StatisticLine from './StatisticLine'

const Statistics = (props) => {
  const totalFeedback = props.good + props.neutral + props.bad

  if (totalFeedback === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={totalFeedback} />
          <StatisticLine text="average" value={(props.good * 1 + props.neutral * 0 + props.bad * -1) / totalFeedback} />
          <StatisticLine text="positive" value={(props.good / totalFeedback) * 100 + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
