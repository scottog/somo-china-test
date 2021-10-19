import React, { useState } from "react"
import { get } from 'axios'
import TestSummary from "./TestSummary"
import { database, auth } from './firebase'
import { ref, set } from "firebase/database";
import { Link, useHistory } from "react-router-dom"
import "./Login.css"

const urlBase = `//112.74.189.208:9000`
// const urlBase = `//localhost:9000`

const testSuites = [
    {
        // Hits an endpoint within an AliBaba-China VPC that's tunneled to a domestic cloud VPC (AWS).
        name: 'VPC-to-VPC Tunnel',
        endpoint: `${urlBase}/vpc`,
        results: [],
    },
    {
        // Hits proxy outside of China forwarding to Firebase
        name: 'Reverse Proxy',
        endpoint: `${urlBase}/rProxy`,
        results: [],
    },
    {
        // Hits Chinese proxy, forwards to reverse proxy
        name: 'Forward and Reverse Proxy',
        endpoint: `${urlBase}/fancyProxy`,
        results: [],
    },
    {
        // Reaches out to Firebase via custom DNS
        name: 'Firebase DNS',
        endpoint: `${urlBase}/firebase`,
        results: [],
    },
]

const buildSuiteRunner = (suiteData, setter) => {
    return async (iterations) => {
        const start = Date.now()
        let success = false
        try {
            const resp = await get(suiteData.endpoint)
            success = true
            console.info(`GET test-stub`, resp)
        } catch (err) {
            console.error(`Failed to good response`, err)
        }
        const latency = Date.now() - start
        setter(iterations + 1)
        return [latency, success]
    }
}

function Dashboard() {
    const [ vpcTestCount, setVpcTestCount ] = useState(0)
    const [ proxyTestCount, setProxyTestCount ] = useState(0)
    const [ fancyProxyTestCount, setFancyProxyTestCount ] = useState(0)
    const [ firebaseTestCount, setFirebaseTestCount ] = useState(0)    
    const [ totalTestsToRun, setTotalTests ] = useState(0)
    const [ runningTests, setRunningTests ] = useState(false)
    const [ finishedTests, setFinishedTests ] = useState(false)

    testSuites[0].runOnce = buildSuiteRunner( testSuites[0], setVpcTestCount)
    testSuites[1].runOnce = buildSuiteRunner( testSuites[1], setProxyTestCount)
    testSuites[2].runOnce = buildSuiteRunner( testSuites[2], setFancyProxyTestCount)
    testSuites[3].runOnce = buildSuiteRunner( testSuites[3], setFirebaseTestCount)

    const runTests = async (totalTests) => {
        setRunningTests(true)
        setTotalTests(totalTests)
        for (let i=0; i < totalTests; i++) {
            console.log(`Test iteration #${i}`)
            for (const suite of testSuites) {
                const [latency, pass] = await suite.runOnce(i)
                suite.results.push({ latency, pass })
            }
        }
         
        const user = auth.currentUser
        if (user) {
            console.log(`Writing results`)
            for (const suite of testSuites) {
                const epochMillis = new Date().getTime()
                const id = `test-${user.uid}-${epochMillis}`
                const testData = Object.assign({}, suite)
                delete testData.runOnce
                await set(ref(database, `${id}`), testData)
                suite.results = []
            }
        }
        setRunningTests(false)
        setFinishedTests(true)
    }

    return (
    <div className="login">
        <div className="login__container">
            <h2>Test Harness</h2>
            {/* <button
                className="login__btn"
                disabled={runningTests}
                onClick={() => runTests(5)}
            >Run 5 tests</button> */}
                        <button
                className="login__btn"
                disabled={runningTests}
                onClick={() => runTests(100)}
            >Run Tests</button>

        <ul>
            <TestSummary suite={testSuites[0]} testCount={vpcTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
            <TestSummary suite={testSuites[1]} testCount={proxyTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
            <TestSummary suite={testSuites[2]} testCount={fancyProxyTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
            <TestSummary suite={testSuites[3]} testCount={firebaseTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
        </ul>
        { finishedTests ? <h2 style={{color: 'green'}}>Testing complete! Thank you.</h2> : null }
        </div>
    </div>
    );
}

export default Dashboard