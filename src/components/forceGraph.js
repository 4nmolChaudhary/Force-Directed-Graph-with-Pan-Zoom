import React, { useEffect, useRef } from 'react'
import { runForceGraph } from './forceGraphGenerator'
import styles from './forceGraph.module.css'

export function ForceGraph({ linksData, nodesData, groupsData }) {
	const containerRef = useRef(null)

	useEffect(() => {
		let destroyFn
		if (containerRef.current) {
			const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, groupsData)
			destroyFn = destroy
		}

		return destroyFn
	}, [linksData, nodesData, groupsData])

	return <div ref={containerRef} className={styles.container} />
}
