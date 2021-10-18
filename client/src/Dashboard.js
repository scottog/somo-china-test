import React, { useState } from "react";
import { get } from 'axios';
import TestSummary from "./TestSummary";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";

const urlBase = `http://112.74.189.208:9000`
// const urlBase = `http://localhost:9000`

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
        try {
            const resp = await get(suiteData.endpoint)
            console.info(`GET test-stub`, resp)
        } catch (err) {
            console.error(`Failed to good response`, err)
            // Get failure data, append
        }
        const latency = Date.now() - start
        setter(iterations + 1)
        return [suiteData, latency]
    }
}

function Dashboard() {
    const [ vpcTestCount, setVpcTestCount ] = useState(0)
    const [ proxyTestCount, setProxyTestCount ] = useState(0)
    const [ fancyProxyTestCount, setFancyProxyTestCount ] = useState(0)
    const [ firebaseTestCount, setFirebaseTestCount ] = useState(0)    
    const [ totalTestsToRun, setTotalTests ] = useState(0)
    const [ runningTests, setRunningTests ] = useState(false)

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
                const [suiteData, testResult] = await suite.runOnce(i)
                suiteData.results.push(testResult)
            }
        }
        setRunningTests(false)
    }

    return (
    <div className="login">
        <div className="login__container">
            <h2>Test Harness</h2>
            <button
                className="login__btn"
                disabled={runningTests}
                onClick={() => runTests(5)}
            >Run 5 tests</button>
                        <button
                className="login__btn"
                disabled={runningTests}
                onClick={() => runTests(100)}
            >Run 100 tests</button>

        <ul>
            <TestSummary suite={testSuites[0]} testCount={vpcTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
            <TestSummary suite={testSuites[1]} testCount={proxyTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
            <TestSummary suite={testSuites[2]} testCount={fancyProxyTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
            <TestSummary suite={testSuites[3]} testCount={firebaseTestCount} totalTestsToRun={totalTestsToRun} ></TestSummary>
        </ul>
        </div>
    </div>
    );
}

export default Dashboard