import * as d3 from 'd3'
import '@fortawesome/fontawesome-free/css/all.min.css'
import styles from './forceGraph.module.css'
import { Tooltip } from './Tooltip'

export function runForceGraph(container, linksData, nodesData) {
	const links = linksData.map(d => Object.assign({}, d))

	const nodes = nodesData.map(d => Object.assign({}, d))
	nodes.forEach(node => {
		if (node.id === 21 || node.id === 18 || node.id === 22) node.group = 'alpha'
		//if (node.id === 19 || node.id === 2 || node.id === 23) node.group = 'bravo'
	})
	//setting the width/height of svg container
	const height = document.querySelector('.Main').clientHeight / 2
	const width = document.querySelector('.Main').clientWidth / 2
	const radius = 12
	//setting the color,icon,and class for the nodes(circles)
	const color = d3.scaleOrdinal(d3.schemeCategory10)
	const icon = d => (d.name === 'cloud' ? '\uf0c2' : '\uf31e')
	const getClass = d => (d.name === 'cloud' ? styles.cloud : styles.node)
	const valueline = d3
		.line()
		.x(d => d[0])
		.y(d => d[1])
		.curve(d3.curveCatmullRomClosed)
	//remove the hightlight when mouse moves out
	const exitHighlight = () => {
		svg.style('cursor', 'move')
		link.style('stroke', '#999')
		node.style('stroke', 'white')
	}
	//highlight the hovered
	const setHighlight = d => {
		svg.style('cursor', 'pointer')
		const connectLinks = []
		const connectedNodes = []
		links.forEach(l => {
			if (l.source.id === d.id || l.target.id === d.id) {
				connectLinks.push(l.index)
				connectedNodes.push(l.source.id, l.target.id)
			}
		})
		const nodeSet = [...new Set(connectedNodes)]
		link.style('stroke', d => (connectLinks.includes(d.index) ? 'blue' : '#999'))
		node.style('stroke', d => (nodeSet.includes(d.id) ? 'blue' : 'white'))
	}

	const zoomed = () => {
		g.attr('transform', d3.event.transform)
	}

	const addTooltip = d => {
		d3.select('.tooltip').transition().duration(200).style('opacity', 1)
		//console.log(d)
		div.html(Tooltip(d))
			.style('left', `${d3.event.pageX}px`)
			.style('top', `${d3.event.pageY - 28}px`)
	}

	const removeTooltip = () => {
		d3.select('.tooltip').transition().duration(200).style('opacity', 0)
	}

	const simulation = d3
		.forceSimulation(nodes)
		.force(
			'link',
			d3.forceLink(links).id(d => d.id)
		)
		.force('charge', d3.forceManyBody().strength(-150))
		.force('x', d3.forceX([width / 2]).strength(0.2))
		.force('y', d3.forceY([height / 2]).strength(0.2))
		.force('center', d3.forceCenter(width / 2, 300))

	const svg = d3
		.select(container)
		.append('svg')
		.attr('id', 'graphSvg')
		.attr('transform', 'scale(1.1)')
		.call(d3.zoom().scaleExtent([0.1, 7]).on('zoom', zoomed))

	const div = d3.select(container).append('div').attr('class', 'tooltip').style('opacity', 0)

	const g = svg.append('g')
	svg.style('cursor', 'move')

	const link = g
		.selectAll('.link')
		.data(links)
		.enter()
		.append('line')
		.attr('stroke', '#999')
		.attr('stroke-opacity', 0.6)
		.attr('class', 'link')
		.attr('stroke-width', d => Math.sqrt(d.value))

	const node = g
		.selectAll('.node')
		.data(nodes)
		.enter()
		.append('circle')
		.attr('class', 'node')
		.attr('stroke', '#fff')
		.attr('stroke-width', 2)
		.attr('r', radius)
		.attr('fill', d => (d.name === 'cloud' ? 'none' : color(d.group)))

	node
		.on('click', d => console.log(d))
		.on('mouseover', d => {
			setHighlight(d)
			addTooltip(d)
		})
		.on('mouseout', d => {
			exitHighlight(d)
			removeTooltip()
		})

	// node label
	const text = g
		.selectAll('text')
		.data(nodes)
		.enter()
		.append('text')
		.attr('class', 'label-text')
		.attr('dx', 12)
		.attr('dy', '.35em')
		.attr('font-size', '6px')
		.attr('font-weight', 900)
		.text(d => d.name)
	//.call(drag(simulation))
	text.on('click', d => console.log(d))

	const label = g
		.selectAll('.labels')
		.data(nodes)
		.enter()
		.append('text')
		.attr('class', 'labels')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('class', d => `fa ${getClass(d)}`)
		.text(d => {
			return icon(d)
		})
	//.call(drag(simulation))

	label
		.on('click', d => console.log(d))
		.on('mouseover', d => {
			setHighlight(d)
			addTooltip(d)
		})
		.on('mouseout', d => {
			exitHighlight(d)
			removeTooltip()
		})

	//-------------------Groups----------------------------------
	const groups = g.append('g').attr('class', 'groups')
	const groupIds = d3
		.set(nodes.map(d => d.group))
		.values()
		.map(groupId => ({
			groupId: groupId,
			count: nodes.filter(node => node.group === groupId).length,
		}))
		.filter(group => group.count > 1)
		.map(group => group.groupId)

	const paths = groups
		.selectAll('.path_placeholder')
		.data(groupIds, d => +d)
		.enter()
		.append('g')
		.attr('class', 'path_placeholder')
		.append('path')
		.attr('stroke', d => color(d))
		.attr('fill', d => color(d))
		.attr('opacity', 0.1)
		.attr('class', 'group_nodes')
		//.style('stroke-width', 1)
		.style('stroke-linejoin', 'round')
		.style('fill-opacity', 0.1)

	paths.transition().duration(2000).attr('opacity', 1)
	// add interaction to the groups
	groups.selectAll('.path_placeholder').call(d3.drag().on('start', group_dragstarted).on('drag', group_dragged).on('end', group_dragended))

	simulation.on('tick', d => {
		// display hierarchy in graph to make it look like a tree
		// const lev2 = []
		// //display nodes as tree by varying Y cordinate
		// nodes.forEach(d => (d.y += (d.level * 100 - d.y) * 0.1))
		// nodes.forEach(d => {
		// 	if (d.level === 2) {
		// 		lev2.push(d)
		// 	}
		// })

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
		console.log('node cords', node_coords)
		if (node_coords.length === 2) {
			var fakePoints = []
			console.log('group with two node', node_coords)
			var dx = node_coords[1][0] - node_coords[0][0]
			var dy = node_coords[1][1] - node_coords[0][1]
			dx *= 0.00001
			dy *= 0.00001
			var mx = (node_coords[1][0] + node_coords[0][0]) * 0.5
			var my = (node_coords[1][1] + node_coords[0][1]) * 0.5
			fakePoints = [
				[mx + dy, my - dx],
				[mx - dy, my + dx],
			]

			return d3.polygonHull(node_coords.map(i => [i[0], i[1]]).concat(fakePoints))
		} else return d3.polygonHull(node_coords)
	}

	function updateGroups() {
		groupIds.forEach(function (groupId) {
			var centroid
			var path = paths
				.filter(d => d === groupId)
				.attr('transform', 'scale(1.4) translate(0,0)')
				.attr('d', function (d) {
					const polygon = polygonGenerator(d)
					centroid = d3.polygonCentroid(polygon)
					// to scale the shape properly around its points:
					// move the 'g' element to the centroid point, translate
					// all the path around the center of the 'g' and then
					// we can scale the 'g' element properly
					return valueline(polygon.map(point => [point[0] - centroid[0], point[1] - centroid[1]]))
				})

			d3.select(path.node().parentNode).attr('transform', `translate(${centroid[0]} ,${centroid[1]}) scale(${1.8})`)
		})
	}
	// drag groups
	function group_dragstarted(groupId) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart()
		//d3.select(this).select('path').style('stroke-width', 1)
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
		//d3.select(this).select('path').style('stroke-width', 1)
	}

	return {
		destroy: () => simulation.stop(),
		nodes: () => svg.node(),
	}
}
