import React, { useState } from "react";
import { get } from 'axios';
import TestSummary from "./TestSummary";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";

const testSuites = [
    {
        // Hits an endpoint within an AliBaba-China VPC that's tunneled to a domestic cloud VPC (AWS).
        name: 'VPC-to-VPC Tunnel',
        endpoint: 'http://112.74.189.208:9000/vpc',
        results: [],
    },
    {
        // Hits proxy outside of China forwarding to Firebase
        name: 'Reverse Proxy',
        endpoint: 'http://112.74.189.208:9000/rProxy',
        results: [],
    },
    {
        // Hits Chinese proxy, forwards to reverse proxy
        name: 'Forward and Reverse Proxy',
        endpoint: 'http://112.74.189.208:9000/fancyProxy',
        results: [],
    },
    {
        // Reaches out to Firebase via custom DNS
        name: 'Firebase DNS',
        endpoint: 'http://112.74.189.208:9000/firebase',
        results: [],
    },
]

const buildSuiteRunner = (suiteData, setter) => {
    return async (iterations) => {
        const start = Date.now()
        const resp = await get(suiteData.endpoint)
        console.info(`GET health`, resp)
        const latency = Date.now() - start
        suiteData.results.push(latency)
        setter(iterations + 1)
    }
}

function Dashboard() {

    const totalTestsToRun = 5
    const [ vpcTestCount, setVpcTestCount ] = useState(0)
    const [ proxyTestCount, setProxyTestCount ] = useState(0)
    const [ fancyProxyTestCount, setFancyProxyTestCount ] = useState(0)
    const [ firebaseTestCount, setFirebaseTestCount ] = useState(0)    

    testSuites[0].runOnce = buildSuiteRunner( testSuites[0], setVpcTestCount)
    testSuites[1].runOnce = buildSuiteRunner( testSuites[1], setProxyTestCount)
    testSuites[2].runOnce = buildSuiteRunner( testSuites[2], setFancyProxyTestCount)
    testSuites[3].runOnce = buildSuiteRunner( testSuites[3], setFirebaseTestCount)

    const runTests = async () => {
        for (let i=0; i < totalTestsToRun; i++) {
            console.log(`Test iteration #${i}`)
            for (const suite of testSuites) {
                await suite.runOnce(i)
            }
        }
    }

    return (
    <div className="login">
        <div className="login__container">
            <h2>Test Harness</h2>
            <button
                className="login__btn"
                onClick={() => runTests()}
            >Start tests</button>

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