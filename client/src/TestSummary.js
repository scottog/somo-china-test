import React from "react";

const averageMs = (results) => {
    if (!results || results.length === 0) return null
    const sum = results.reduce((prev, curr) => prev+curr)
    return `average ${sum/results.length}ms`
}

const TestSummary = ({suite, testCount, totalTestsToRun}) => {
    const {name, results} = suite
    return (
        <li> {name} : { testCount } / { totalTestsToRun } { averageMs(results) } 
        </li>
    )
}

export default TestSummary