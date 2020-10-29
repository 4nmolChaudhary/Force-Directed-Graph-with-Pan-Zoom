import * as d3 from 'd3'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createContextMenu } from './utils'
import styles from './forceGraph.module.css'
import { CloudPath } from './CloudPath'

export function runForceGraph(container, linksData, nodesData, groupsData, nodeHoverTooltip) {
	const links = linksData.map(d => Object.assign({}, d))
	const nodes = nodesData.map(d => Object.assign({}, d))
	//const groupData = groupsData.map(d => Object.assign({}, d))

	const menuItems = [
		{
			title: 'Add to group',
			action: d => {
				console.log(d)
			},
		},
		{
			title: 'Second action',
			action: d => {
				console.log(d)
			},
		},
	]

	//setting the width/height of svg container
	const height = 800
	const width = 550
	//setting the color,icon,and class for the nodes(circles)
	const color = d3.scaleOrdinal(d3.schemeCategory10)
	const icon = d => '\uf31e'
	const getClass = d => styles.node
	const valueline = d3
		.line()
		.x(d => d[0])
		.y(d => d[1])
		.curve(d3.curveCatmullRomClosed)

	const drag = simulation => {
		const dragstarted = d => {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart()
			d.fx = d.x
			d.fy = d.y
		}

		const dragged = d => {
			d.fx = d3.event.x
			d.fy = d3.event.y
		}

		const dragended = d => {
			if (!d3.event.active) simulation.alphaTarget(0)
			d.fx = null
			d.fy = null
		}

		return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
	}

	// Add the tooltip element to the graph
	const tooltip = document.querySelector('#graph-tooltip')
	if (!tooltip) {
		const tooltipDiv = document.createElement('div')
		tooltipDiv.classList.add(styles.tooltip)
		tooltipDiv.style.opacity = '0'
		tooltipDiv.id = 'graph-tooltip'
		document.body.appendChild(tooltipDiv)
	}
	const div = d3.select('#graph-tooltip')

	const addTooltip = (hoverTooltip, d, x, y) => {
		div.transition().duration(200).style('opacity', 0.9)
		div.html(hoverTooltip(d))
			.style('left', `${x}px`)
			.style('top', `${y - 28}px`)
	}

	const removeTooltip = () => {
		div.transition().duration(200).style('opacity', 0)
	}

	const simulation = d3
		.forceSimulation(nodes)
		.force(
			'link',
			d3.forceLink(links).id(d => d.id)
		)
		.force('charge', d3.forceManyBody().strength(-150))
		.force('x', d3.forceX())
		.force('y', d3.forceY())
		.force('link', d3.forceLink().distance(54))

	const svg = d3
		.select(container)
		.append('svg')
		.attr('id', 'graphSvg')
		.attr('viewBox', [-width / 2, -height / 2, width, height])
		.attr('transform', 'scale(1.6)')
	// .call(
	// 	d3.zoom().on('zoom', function () {
	// 		svg.attr('transform', d3.event.transform)
	// 	})
	// )

	const link = svg
		.append('g')
		.attr('stroke', '#999')
		.attr('stroke-opacity', 0.6)
		.selectAll('line')
		.data(links)
		.join('line')
		.attr('stroke-width', d => Math.sqrt(d.value))

	const node = svg
		.append('g')
		.attr('class', 'node')
		.attr('stroke', '#fff')
		.attr('stroke-width', 2)
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.on('contextmenu', d => {
			createContextMenu(d, menuItems, width, height, '#graphSvg')
		})
		.attr('r', 12)
		.attr('fill', d => color(d.group))
		.call(drag(simulation))

	node.on('click', d => console.log(d))

	//-------------------Groups----------------------------------
	const groups = svg.append('g').attr('class', 'groups')
	const groupIds = d3
		.set(nodes.map(d => d.group))
		.values()
		.map(groupId => ({
			groupId: groupId,
			count: nodes.filter(node => node.group === groupId).length,
		}))
		.filter(group => group.count > 1)
		.map(group => group.groupId)

	console.log(groupIds)

	const paths = groups
		.selectAll('.path_placeholder')
		.data(groupIds, d => +d)
		.enter()
		.append('g')
		.attr('class', 'path_placeholder')
		.append('path')
		.attr('stroke', d => color(d))
		.attr('fill', d => color(d))
		.attr('class', 'group_nodes')
		.attr('opacity', 0)

	paths.transition().duration(2000).attr('opacity', 1)
	// add interaction to the groups
	groups.selectAll('.path_placeholder').call(d3.drag().on('start', group_dragstarted).on('drag', group_dragged).on('end', group_dragended))

	// node label
	const text = svg
		.append('g')
		.attr('class', 'label-text')
		.selectAll('text')
		.data(nodes)
		.enter()
		.append('text')
		.attr('dx', 12)
		.attr('dy', '.35em')
		.attr('font-size', '6px')
		.attr('font-weight', 900)
		.text(d => d.name)
		.call(drag(simulation))
	text.on('click', d => console.log(d))

	const label = svg
		.append('g')
		.attr('class', 'labels')
		.selectAll('text')
		.data(nodes)
		.enter()
		.append('text')
		.on('contextmenu', d => {
			createContextMenu(d, menuItems, width, height, '#graphSvg')
		})
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('class', d => `fa ${getClass(d)}`)
		.text(d => {
			return icon(d)
		})
		.call(drag(simulation))

	label
		.on('mouseover', d => addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY))
		.on('mouseout', () => removeTooltip())
		.on('click', d => console.log(d))

	simulation.on('tick', () => {
		//update link positions
		link
			.attr('x1', d => d.source.x)
			.attr('y1', d => d.source.y)
			.attr('x2', d => d.target.x)
			.attr('y2', d => d.target.y)

		// update node positions
		node.attr('cx', d => d.x).attr('cy', d => d.y)
		// update label positions
		label.attr('x', d => d.x).attr('y', d => d.y)
		text.attr('x', d => d.x).attr('y', d => d.y)
		updateGroups()
	})

	// select nodes of the group, retrieve its positions
	// and return the convex hull of the specified points
	// (3 points as minimum, otherwise returns null)
	var polygonGenerator = function (groupId) {
		var node_coords = node
			.filter(d => d.group === groupId)
			.data()
			.map(d => [d.x, d.y])

		return d3.polygonHull(node_coords)
	}

	function updateGroups() {
		groupIds.forEach(function (groupId) {
			var centroid
			var path = paths
				.filter(d => d === groupId)
				.attr('transform', 'scale(1) translate(0,0)')
				.attr('d', function (d) {
					const polygon = polygonGenerator(d)
					centroid = d3.polygonCentroid(polygon)

					// to scale the shape properly around its points:
					// move the 'g' element to the centroid point, translate
					// all the path around the center of the 'g' and then
					// we can scale the 'g' element properly
					return valueline(polygon.map(point => [point[0] - centroid[0], point[1] - centroid[1]]))
				})

			d3.select(path.node().parentNode).attr('transform', `translate(${centroid[0]} ,${centroid[1]}) scale(${1.6})`)
		})
	}
	// drag groups
	function group_dragstarted(groupId) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart()
		d3.select(this).select('path').style('stroke-width', 3)
	}

	function group_dragged(groupId) {
		node
			.filter(d => d.group === groupId)
			.each(d => {
				d.x += d3.event.dx
				d.y += d3.event.dy
			})
	}

	function group_dragended(groupId) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart()
		d3.select(this).select('path').style('stroke-width', 1)
	}

	return {
		destroy: () => simulation.stop(),
		nodes: () => svg.node(),
	}
}
