import React from "react";

const averageMs = (results) => {
    if (!results || results.length === 0) return null
    let sum = 0
    for (const result of results) {
        sum += result.latency
    }
    return `avg lat ${Math.floor(sum/results.length)}ms`
}

const TestSummary = ({suite, testCount, totalTestsToRun}) => {
    const {name, results} = suite
    return (
        <li> {name} : { testCount } / { totalTestsToRun } { averageMs(results) } 
        </li>
    )
}

export default TestSummary