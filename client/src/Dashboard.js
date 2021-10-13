import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";

const testSuites = [
    {
        name: 'VPC-to-VPC Tunnel',
        runOnce: null
    },
    {
        name: 'Reverse Proxy'
    },
    {
        name: 'Forward and Reverse Proxy'
    },
    {
        name: 'Firebase DNS'
    },
]

const buildSuiteRunner = (suiteData, setter) => {
    return async (iterations) => {
        console.log(`Run test.`)
        setter(iterations + 1)
    }
}

function Dashboard() {

    const totalTestsToRun = 100
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