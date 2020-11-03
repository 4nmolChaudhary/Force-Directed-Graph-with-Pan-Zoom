const Tooltip = node =>
	`<div class="node-tooltip">
		<div style="padding:0 10px">
			<b class="device-type" style="font-family: 'GoogleSans-Regular';font-weight: 900;font-size: 12px;color: rgb(22, 130, 218);" >${node.device_type} - </b>
			<span class="device-name" style="font-family: 'GoogleSans-Regular';	color: #121212;	font-size: 12px;">${node.name}</span>
		</div>
		<hr style="height:3px;background:#000;border:none;margin:4px 0;">
		<div style="padding:0 10px">
			<b class="device-type" style="font-family: 'GoogleSans-Regular';font-weight: 900;font-size: 10px;" >Online Status : </b>
			<span class="device-name" style="font-family: 'GoogleSans-Regular';	color: #121212;	font-size: 10px;">${node.device_status}</span>
		</div>
		<div style="padding:0 10px">
			<b class="device-type" style="font-family: 'GoogleSans-Regular';font-weight: 900;font-size: 10px;" >Manage Status : </b>
			<span class="device-name" style="font-family: 'GoogleSans-Regular';	color: #121212;	font-size: 10px;">${node.device_managed}</span>
		</div>
		<div style="padding:0 10px">
			<b class="device-type" style="font-family: 'GoogleSans-Regular';font-weight: 900;font-size: 10px;" >Make & Model : </b>
			<span class="device-name" style="font-family: 'GoogleSans-Regular';	color: #121212;	font-size: 10px;">${node.model}</span>
		</div>
		<div style="padding:0 10px">
			<b class="device-type" style="font-family: 'GoogleSans-Regular';font-weight: 900;font-size: 10px;" >IPAddress(es) : </b>
			<span class="device-name" style="font-family: 'GoogleSans-Regular';	color: #121212;	font-size: 10px;">${node.port_ip}</span>
		</div>
		<div style="padding:0 10px">
			<b class="device-type" style="font-family: 'GoogleSans-Regular';font-weight: 900;font-size: 10px;" >Network(s) : </b>
			<span class="device-name" style="font-family: 'GoogleSans-Regular';	color: #121212;	font-size: 10px;">${node.port_network}</span>
		</div>
	</div>`

export { Tooltip }
