import React, { useEffect, useState } from 'react'
//import data from './data/data.json'
import { ForceGraph } from './components/forceGraph'
import './App.css'
import axios from 'axios'

function App() {
	const nodeHoverTooltip = React.useCallback(node => {
		return `<div>     
      <b>${node.name}</b>
    </div>`
	}, [])

	const [data, setData] = useState()
	useEffect(() => {
		;(async () => {
			const allnodes = await axios.get(`http://192.168.1.51:8020/allnodes`)
			setData(allnodes.data)
		})()
	}, [])

	return (
		<div className="App">
			<section className="Main">{data && <ForceGraph linksData={data?.links} nodesData={data?.nodes} nodeHoverTooltip={nodeHoverTooltip} />}</section>
		</div>
	)
}

export default App
