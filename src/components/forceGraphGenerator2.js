import * as d3 from 'd3'
import styles from './forceGraph.module.css'

export function forceGraphGenerator2(container, linksData, nodesData, nodeHoverTooltip) {
	const links = linksData.map(d => Object.assign({}, d))
	const nodes = nodesData.map(d => Object.assign({}, d))
	const width = window.innerWidth
	const height = window.innerHeight

	return {
		destroy: () => simulation.stop(),
		nodes: () => svg.node(),
	}
}
