import React, { useState } from "react";
import { get } from 'axios';
import { Link, useHistory } from "react-router-dom";
import "./Login.css";

const testSuites = [
    {
        // Hits an endpoint within an AliBaba-China VPC that's tunneled to a domestic cloud VPC (AWS).
        name: 'VPC-to-VPC Tunnel',
        endpoint: 'http://112.74.189.208:9000/health'
    },
    {
        // Hits proxy outside of China forwarding to Firebase
        name: 'Reverse Proxy',
        endpoint: 'http://112.74.189.208:9000/health'
    },
    {
        // Hits Chinese proxy, forwards to reverse proxy
        name: 'Forward and Reverse Proxy',
        endpoint: 'http://112.74.189.208:9000/health'
    },
    {
        // Reaches out to Firebase via custom DNS
        name: 'Firebase DNS',
        endpoint: 'http://112.74.189.208:9000/health'
    },
]

const buildSuiteRunner = (suiteData, setter) => {
    return async (iterations) => {
        console.log(`Run test.`)
        const resp = await get(suiteData.endpoint)
        console.info(`GET health`, resp)
        setter(iterations + 1)
    }
}

function Dashboard() {

    const totalTestsToRun = 1
    const [ vpcTestCount, setVpcTestCount ] = useState(0)
    const [ proxyTestCount, setProxyTestCount ] = useState(0)
    const [ fancyProxyTestCount, setFancyProxyTestCount ] = useState(0)
    const [ firebaseTestCount, setFirebaseTestCount ] = useState(0)    

    testSuites[0].runOnce = buildSuiteRunner( testSuites[0], setVpcTestCount)
    testSuites[1].runOnce = buildSuiteRunner( testSuites[1], setProxyTestCount)
    testSuites[2].runOnce = buildSuiteRunner( testSuites[2], setFancyProxyTestCount)
    testSuites[3].runOnce = buildSuiteRunner( testSuites[3], setFirebaseTestCount)

    const runTests = () => {
        for (let i=0; i < totalTestsToRun; i++) {
            console.log(`Test iteration #${i}`)
            testSuites.forEach(async (suite) => {
                await suite.runOnce(i)
            })
        }
    }

    return (
    <div className="login">
        <div className="login__container">
            Dashboard!
            <button
                className="login__btn"
                onClick={() => runTests()}
            >Start test</button>

        <ul>
            <li> {testSuites[0].name} : { vpcTestCount } / { totalTestsToRun } </li>
            <li> {testSuites[1].name} : { proxyTestCount } / { totalTestsToRun } </li>
            <li> {testSuites[2].name} : { fancyProxyTestCount } / { totalTestsToRun } </li>
            <li> {testSuites[3].name} : { firebaseTestCount } / { totalTestsToRun } </li>
        </ul>
        </div>
    </div>
    );
}

export default Dashboard